"""
Mock LLM boundary for the QA multi-agent workflow demo.

This module is the ONLY place that stands in for a real model call. Every
agent node in qa_workflow_graph.py calls `mock_llm_call(...)` instead of
hitting a real LLM, so the whole graph runs instantly and deterministically
with no API key, no local model, and no network access required.

To make this live, replace the body of `mock_llm_call` with a real call, e.g.
using the local-first approach already used elsewhere in this portfolio
(see AI-QA/AI-Dojo, which runs qwen2.5-coder:7b via Ollama):

    from langchain_ollama import ChatOllama
    _llm = ChatOllama(model="qwen2.5-coder:7b")

    def mock_llm_call(role: str, prompt: str) -> str:
        return _llm.invoke([("system", role), ("human", prompt)]).content

Nothing else in qa_workflow_graph.py — the state schema, the nodes, the
routing logic — needs to change either way. The graph doesn't know or care
whether the model behind this function is mocked or real.
"""

import json
import re

ALL_AGENTS = [
    "requirements_agent",
    "ui_flow_agent",
    "automation_engineer_agent",
    "dev_integration_agent",
]

_ROUTING_KEYWORDS = {
    "requirements_agent": (
        "ticket",
        "jira",
        "acceptance criteria",
        "design doc",
        "requirement",
        "story",
    ),
    "ui_flow_agent": (
        "ui",
        "page",
        "flow",
        "selector",
        "checkout",
        "cart",
        "login",
        "signup",
        "search",
        "scroll",
    ),
    "automation_engineer_agent": (
        "automate",
        "automation",
        "test",
        "playwright",
        "spec",
    ),
    "dev_integration_agent": (
        "api",
        "ci",
        "pipeline",
        "backend",
        "unit test",
        "endpoint",
    ),
}

_SPECIALIST_RESPONSES = {
    "ui_flow_agent": (
        "Based on ui_flows_reference.md, the closest matching documented flow is "
        'Add to Cart -> Checkout: product list ([href="/products"]) -> '
        '[data-product-id="N"].add-to-cart -> text=Continue Shopping -> '
        'text=View Cart -> .btn:has-text("Proceed To Checkout") -> '
        "#address_delivery / #address_invoice. Selectors follow the "
        "data-qa/data-product-id convention over text selectors where possible."
    ),
    "requirements_agent": (
        "Following the JIRA-142 template in requirements_reference.md, this breaks "
        "into Given/When/Then scenarios: (1) the happy path completes the described "
        "action, (2) an invalid/edge-case input is rejected with a visible inline "
        "error, (3) skipping the new input entirely does not regress the existing "
        "flow. Engineering breakdown should separate new API surface from UI changes."
    ),
    "automation_engineer_agent": (
        "Per automation_standards.md: add a new spec under tests/, named for the "
        "behavior (kebab-case, no typos). Reuse tests/helpers/ for any setup shared "
        "with existing specs (e.g. registerNewAccount). Assert with "
        "expect(...).toBeVisible()/toHaveText() at each step - no waitForTimeout. "
        "Prefer data-qa/data-testid selectors per ui_flows_reference.md. Keep the "
        "global timeout at Playwright's 30s default."
    ),
    "dev_integration_agent": (
        "Per dev_repo_reference.md: if this touches the API, assert on individual "
        "response fields (not just status 200), following the "
        "post-api-request.spec.js pattern. The existing CI workflow "
        "(.github/workflows/ci.yml) will pick up a new spec automatically via "
        "`npx playwright test` - no pipeline change needed unless a new install "
        "step or secret is required."
    ),
}

_AGENT_LABELS = {
    "ui_flow_agent": "UI Flow Agent",
    "requirements_agent": "Requirements Agent",
    "automation_engineer_agent": "Automation Engineer Agent",
    "dev_integration_agent": "Dev Integration Agent",
}


def mock_llm_call(role: str, prompt: str) -> str:
    """Deterministic stand-in for a real LLM call. Dispatches on which agent
    is calling (identified by a marker embedded in `role`) plus simple
    keyword matching over `prompt` - enough to demonstrate real orchestration
    and data flow through the graph without needing a live model."""
    if "Orchestrator" in role and "AVAILABLE AGENTS" in prompt:
        return _mock_orchestrator_plan(prompt)
    if "Orchestrator" in role and "SYNTHESIZE" in prompt:
        return _mock_synthesis(prompt)
    for agent_key, response in _SPECIALIST_RESPONSES.items():
        if _AGENT_LABELS[agent_key] in role:
            return f"{_AGENT_LABELS[agent_key]} (mock response):\n{response}"
    return "(mock) No matching agent role found for this prompt."


def _extract_task(prompt: str) -> str:
    match = re.search(r"TASK:\n(.+?)\n\n", prompt, re.DOTALL)
    return match.group(1).strip() if match else ""


def _mock_orchestrator_plan(prompt: str) -> str:
    task = _extract_task(prompt).lower()
    plan = [
        agent
        for agent in ALL_AGENTS
        if any(keyword in task for keyword in _ROUTING_KEYWORDS[agent])
    ]
    if not plan:
        plan = list(ALL_AGENTS)
        reasoning = "No strong keyword signal in the task - running the full pipeline."
    else:
        reasoning = (
            "Routed to " + ", ".join(plan) + " based on keywords found in the task."
        )
    return json.dumps({"plan": plan, "reasoning": reasoning})


def _mock_synthesis(prompt: str) -> str:
    task = _extract_task(prompt)
    outputs_match = re.search(r"AGENT OUTPUTS:\n(.+)", prompt, re.DOTALL)
    outputs_block = outputs_match.group(1).strip() if outputs_match else ""
    return (
        f'Synthesized plan for "{task}":\n\n{outputs_block}\n\n'
        "All specialist findings above are consistent and ready to hand off for "
        "implementation."
    )
