"""
Tests for the one piece of original logic in this graph: the orchestrator's
keyword-based routing (mock_llm.plan_for_task), its JSON-parse fallback, and
route_next's plan-exhaustion branch.

Run with: pytest
"""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "graph"))

import mock_llm  # noqa: E402
import qa_workflow_graph as wf  # noqa: E402


# ---------------------------------------------------------------------------
# plan_for_task - the actual (mocked) routing logic
# ---------------------------------------------------------------------------


def test_ui_only_task_excludes_unrelated_agents():
    plan = mock_llm.plan_for_task("Check the checkout page layout")
    assert "ui_flow_agent" in plan
    assert "dev_integration_agent" not in plan
    assert "debugging_agent" not in plan
    assert "pr_review_agent" not in plan


def test_api_ci_task_includes_dev_integration_agent():
    plan = mock_llm.plan_for_task("Update the CI pipeline for the new API endpoint")
    assert "dev_integration_agent" in plan


def test_failing_test_task_includes_debugging_agent():
    plan = mock_llm.plan_for_task("The checkout test is flaky in CI")
    assert "debugging_agent" in plan


def test_pr_task_includes_pr_review_agent():
    plan = mock_llm.plan_for_task("Please review this pull request before merge")
    assert "pr_review_agent" in plan


def test_security_task_includes_security_agent():
    plan = mock_llm.plan_for_task("Check this feature for OWASP vulnerabilities")
    assert "security_agent" in plan
    assert "pr_review_agent" not in plan


def test_multi_keyword_task_includes_all_matching_agents():
    task = (
        "Write a Jira ticket, automate the checkout UI flow as a Playwright "
        "test, and update the CI pipeline for the new API endpoint"
    )
    plan = mock_llm.plan_for_task(task)
    assert plan == [
        "requirements_agent",
        "ui_flow_agent",
        "automation_engineer_agent",
        "dev_integration_agent",
    ]


def test_no_keyword_task_returns_empty_plan():
    # plan_for_task itself has no fallback - that lives one layer up, in
    # _mock_orchestrator_plan / orchestrator_plan. Confirmed separately below.
    assert mock_llm.plan_for_task("do the thing") == []


# ---------------------------------------------------------------------------
# Orchestrator fallback behavior
# ---------------------------------------------------------------------------


def test_orchestrator_plan_falls_back_to_full_pipeline_on_no_keywords():
    raw = mock_llm.mock_llm_call(
        mock_llm.ORCHESTRATOR_PLAN,
        "role is ignored by the mock",
        "AVAILABLE AGENTS:\nirrelevant\n\nTASK:\ndo the thing\n\n",
    )
    parsed = json.loads(raw)
    assert parsed["plan"] == mock_llm.ALL_AGENTS


def test_orchestrator_plan_node_falls_back_to_full_pipeline_on_invalid_json(monkeypatch):
    monkeypatch.setattr(wf, "mock_llm_call", lambda *args, **kwargs: "not valid json")
    result = wf.orchestrator_plan({"task": "anything"})
    assert result["plan"] == mock_llm.ALL_AGENTS
    assert result["current_step"] == 0
    assert result["agent_outputs"] == {}


def test_mock_llm_call_raises_for_unknown_agent_key():
    # Dispatch is by explicit agent_key, not by matching substrings of a
    # free-text role - an unrecognized key should fail loudly, not silently
    # fall through.
    import pytest

    with pytest.raises(ValueError):
        mock_llm.mock_llm_call("not_a_real_agent", "some role", "some prompt")


# ---------------------------------------------------------------------------
# route_next - the plan-exhaustion branch
# ---------------------------------------------------------------------------


def test_route_next_returns_next_agent_in_plan():
    state = {"plan": ["requirements_agent", "ui_flow_agent"], "current_step": 0}
    assert wf.route_next(state) == "requirements_agent"

    state["current_step"] = 1
    assert wf.route_next(state) == "ui_flow_agent"


def test_route_next_returns_synthesize_when_plan_exhausted():
    state = {"plan": ["requirements_agent"], "current_step": 1}
    assert wf.route_next(state) == "synthesize"


def test_route_next_returns_synthesize_for_empty_plan():
    assert wf.route_next({"plan": [], "current_step": 0}) == "synthesize"


# ---------------------------------------------------------------------------
# End-to-end sanity check (still deterministic - the LLM boundary is mocked)
# ---------------------------------------------------------------------------


def test_full_graph_invoke_produces_final_output():
    result = wf.graph.invoke({"task": "Automate the add-to-cart flow"})
    assert "ui_flow_agent" in result["agent_outputs"]
    assert "final_output" in result
    assert result["final_output"]
