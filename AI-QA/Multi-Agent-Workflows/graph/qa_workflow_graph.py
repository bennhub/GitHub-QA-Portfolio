"""
QA Workflow Graph. A graph-based multi-agent system for QA engineering tasks.

One Orchestrator agent reads an incoming task (a feature request, a Jira
ticket, a bug report, a failing test, a PR to review) and decides which
specialist agents need to weigh in and in what order, by keyword-matching
over the task text (see plan_for_task in mock_llm.py - this is simple
keyword matching, not reasoning). Each specialist is grounded in a real
reference file, does its part, and the Orchestrator synthesizes all of it
into one cohesive deliverable. Most of those reference files live under
../context/, but the Automation Engineer Agent is grounded directly in the
real automation repo's own self-description
(../../../Automation-Project/Playwright/agent/automation-agent.md), not a
hand-copied summary of it.

This is a genuine LangGraph StateGraph: real nodes, real conditional
routing, real state passing between agents. The one thing that's mocked is
the LLM call itself (see mock_llm.py), so this runs instantly with no API
key, no local model, and no network required. Swap mock_llm_call for a real
model call and nothing else in this file needs to change.

Run it directly:

    python3 qa_workflow_graph.py "Automate the add-to-cart flow from JIRA-142"
"""

import json
import sys
from pathlib import Path
from typing import TypedDict

from langgraph.graph import END, START, StateGraph

sys.path.insert(0, str(Path(__file__).parent))
from mock_llm import (  # noqa: E402
    ALL_AGENTS,
    ORCHESTRATOR_PLAN,
    ORCHESTRATOR_SYNTHESIZE,
    mock_llm_call,
)

CONTEXT_DIR = Path(__file__).parent.parent / "context"
# graph/ -> Multi-Agent-Workflows/ -> AI-QA/ -> repo root
REPO_ROOT = Path(__file__).resolve().parents[3]


def load_context(path: str) -> str:
    """Loads a reference file either by bare filename (resolved against
    ../context/) or by a path relative to the repo root (for a specialist
    grounded directly in a real file elsewhere in the repo, not a copy)."""
    if "/" in path:
        return (REPO_ROOT / path).read_text()
    return (CONTEXT_DIR / path).read_text()


# ---------------------------------------------------------------------------
# Agent roles
# ---------------------------------------------------------------------------

ORCHESTRATOR_ROLE = (
    "You are the Orchestrator for a QA engineering multi-agent system. You do "
    "not do specialist work yourself. You read an incoming task and decide "
    "which specialist agents are needed and in what order their input should "
    "be gathered, then later synthesize their outputs into one cohesive "
    "deliverable."
)

AGENT_DESCRIPTIONS = """\
- requirements_agent (Requirements Specialist): understands design docs, \
Jira ticket stories, and engineering tech breakdown docs. Translates a \
feature ask into acceptance criteria.
- ui_flow_agent (UI Flows Specialist): understands all documented UI flows \
and page structure of the application under test.
- automation_engineer_agent (Automation Engineering Specialist): understands \
the current automation repo's code structure and codebase, and enforces \
strict test-implementation guidelines and best practices.
- dev_integration_agent (Dev Integration Specialist): understands the dev \
repo's unit tests, API control-flow structure, codebase, and CI/CD \
pipelines.
- debugging_agent (Debugging Specialist): triages a failing test - flaky vs. \
a real regression vs. a test that's simply wrong - using the CI report/trace \
artifacts.
- pr_review_agent (PR Review Specialist): reviews an automation test pull \
request against this repo's automation standards before it merges.\
"""

UI_FLOW_AGENT_ROLE = (
    "You are the UI Flow Agent. You know every documented UI flow and page "
    "structure of the application under test. Ground every answer in the "
    "provided UI flows reference material."
)

REQUIREMENTS_AGENT_ROLE = (
    "You are the Requirements Agent. You understand design docs, Jira ticket "
    "stories, and engineering tech breakdown docs, and translate a feature "
    "ask into clear, testable acceptance criteria. Ground every answer in the "
    "provided requirements reference material."
)

AUTOMATION_ENGINEER_AGENT_ROLE = (
    "You are the Automation Engineer Agent. You understand the current "
    "automation repo's code structure and codebase, and enforce strict "
    "guidelines for implementing automation tests using best coding "
    "practices. Ground every answer in the provided automation standards."
)

DEV_INTEGRATION_AGENT_ROLE = (
    "You are the Dev Integration Agent. You know the ins and outs of the dev "
    "repo: unit test and API control-flow structure, the codebase, and the "
    "CI/CD pipelines. Ground every answer in the provided dev repo reference "
    "material."
)

DEBUGGING_AGENT_ROLE = (
    "You are the Debugging Agent. You're invoked when a test fails. You "
    "triage whether it's flaky, a genuinely wrong test, or a real product "
    "regression, using the CI report/trace artifacts. Ground every answer in "
    "the provided debugging reference material."
)

PR_REVIEW_AGENT_ROLE = (
    "You are the PR Review Agent. You review an automation test pull request "
    "against this repo's automation standards before it merges, and end with "
    "an explicit approve / approve with nits / request changes. Ground every "
    "answer in the provided PR review reference material."
)

SPECIALIST_CONFIG = {
    "requirements_agent": (REQUIREMENTS_AGENT_ROLE, "requirements_reference.md"),
    "ui_flow_agent": (UI_FLOW_AGENT_ROLE, "ui_flows_reference.md"),
    "automation_engineer_agent": (
        AUTOMATION_ENGINEER_AGENT_ROLE,
        "Automation-Project/Playwright/agent/automation-agent.md",
    ),
    "dev_integration_agent": (DEV_INTEGRATION_AGENT_ROLE, "dev_repo_reference.md"),
    "debugging_agent": (DEBUGGING_AGENT_ROLE, "debugging_reference.md"),
    "pr_review_agent": (PR_REVIEW_AGENT_ROLE, "pr_review_reference.md"),
}


# ---------------------------------------------------------------------------
# State
# ---------------------------------------------------------------------------


class QAWorkflowState(TypedDict):
    task: str
    plan: list[str]
    current_step: int
    agent_outputs: dict[str, str]
    final_output: str


# ---------------------------------------------------------------------------
# Nodes
# ---------------------------------------------------------------------------


def orchestrator_plan(state: QAWorkflowState) -> dict:
    prompt = (
        f"AVAILABLE AGENTS:\n{AGENT_DESCRIPTIONS}\n\n"
        f"TASK:\n{state['task']}\n\n"
        'Respond with JSON only: {"plan": [...], "reasoning": "..."}. Only '
        "include agents actually needed, in the order their input should be "
        "gathered."
    )
    raw = mock_llm_call(ORCHESTRATOR_PLAN, ORCHESTRATOR_ROLE, prompt)
    try:
        parsed = json.loads(raw)
        plan = parsed.get("plan") or list(ALL_AGENTS)
        reasoning = parsed.get("reasoning", "")
    except json.JSONDecodeError:
        plan = list(ALL_AGENTS)
        reasoning = "Failed to parse orchestrator output; running the full pipeline."
    print(f"[orchestrator] plan: {plan}")
    print(f"[orchestrator] reasoning: {reasoning}\n")
    return {"plan": plan, "current_step": 0, "agent_outputs": {}}


def build_specialist_node(agent_key: str, role_prompt: str, context_filename: str):
    context_text = load_context(context_filename)

    def node(state: QAWorkflowState) -> dict:
        prompt = (
            f"CONTEXT:\n{context_text}\n\n"
            f"TASK:\n{state['task']}\n\n"
            f"PRIOR AGENT OUTPUTS:\n{json.dumps(state.get('agent_outputs', {}), indent=2)}\n"
        )
        output = mock_llm_call(agent_key, role_prompt, prompt)
        print(f"[{agent_key}] {output}\n")
        updated_outputs = dict(state.get("agent_outputs", {}))
        updated_outputs[agent_key] = output
        return {
            "agent_outputs": updated_outputs,
            "current_step": state.get("current_step", 0) + 1,
        }

    return node


def synthesize(state: QAWorkflowState) -> dict:
    outputs_block = "\n\n".join(
        f"- {agent}: {output}" for agent, output in state.get("agent_outputs", {}).items()
    )
    prompt = (
        f"SYNTHESIZE\n\nTASK:\n{state['task']}\n\nAGENT OUTPUTS:\n{outputs_block}\n"
    )
    final = mock_llm_call(ORCHESTRATOR_SYNTHESIZE, ORCHESTRATOR_ROLE, prompt)
    print(f"[synthesize]\n{final}\n")
    return {"final_output": final}


def route_next(state: QAWorkflowState) -> str:
    plan = state.get("plan", [])
    step = state.get("current_step", 0)
    if step < len(plan):
        return plan[step]
    return "synthesize"


# ---------------------------------------------------------------------------
# Graph
# ---------------------------------------------------------------------------

workflow = StateGraph(QAWorkflowState)
workflow.add_node("orchestrator", orchestrator_plan)
for agent_key, (role_prompt, context_filename) in SPECIALIST_CONFIG.items():
    workflow.add_node(agent_key, build_specialist_node(agent_key, role_prompt, context_filename))
workflow.add_node("synthesize", synthesize)

workflow.add_edge(START, "orchestrator")

_route_map = {agent: agent for agent in ALL_AGENTS}
_route_map["synthesize"] = "synthesize"

workflow.add_conditional_edges("orchestrator", route_next, _route_map)
for agent_key in ALL_AGENTS:
    workflow.add_conditional_edges(agent_key, route_next, _route_map)

workflow.add_edge("synthesize", END)

graph = workflow.compile()


if __name__ == "__main__":
    task = (
        " ".join(sys.argv[1:])
        or "Automate the add-to-cart and checkout flow described in JIRA-142"
    )
    print(f"TASK: {task}\n{'=' * 60}\n")
    result = graph.invoke({"task": task})
    print("=" * 60)
    print("FINAL OUTPUT:\n")
    print(result["final_output"])
