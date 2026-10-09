# Multi-Agent Workflows for QA

A graph-based multi-agent system that mirrors how I use AI for QA work day-to-day: one
Orchestrator agent that reads a task and routes it to specialist agents (by
keyword-matching over the task text; see "How routing actually works" below), each
grounded in a real reference file, with a final synthesis step combining their
findings.

See [diagrams/workflow-diagram.md](./diagrams/workflow-diagram.md) for the graph
shape.

## Agents

| Agent | Specialty | Reference file |
|---|---|---|
| **Orchestrator** | Plans which specialists a task needs, in what order, and synthesizes their outputs at the end | n/a |
| **Requirements Agent** | Design docs, Jira ticket stories, engineering tech breakdown docs | [context/requirements_reference.md](./context/requirements_reference.md) |
| **UI Flow Agent** | Documented UI flows and page structure of the app under test | [context/ui_flows_reference.md](./context/ui_flows_reference.md) |
| **Automation Engineer Agent** | Current automation repo's code structure, codebase, and strict test-implementation guidelines | [Automation-Project/Playwright/agent/automation-agent.md](../../Automation-Project/Playwright/agent/automation-agent.md) |
| **Dev Integration Agent** | Dev repo's unit tests, API control-flow structure, codebase, and CI/CD pipelines | [context/dev_repo_reference.md](./context/dev_repo_reference.md) |
| **Debugging Agent** | Triaging a failing test: flaky, a real regression, or a test that's simply wrong | [context/debugging_reference.md](./context/debugging_reference.md) |
| **PR Review Agent** | Reviewing an automation test PR against this repo's standards before it merges | [context/pr_review_reference.md](./context/pr_review_reference.md) |

The reference files aren't hypothetical. Most are grounded in the real
[Automation-Project](../../Automation-Project/) suite and
[CI workflow](../../.github/workflows/ci.yml) already in this repo. The Automation
Engineer Agent goes one step further: its reference file isn't a copy at all, it's
loaded directly from the automation repo's own self-description,
[agent/automation-agent.md](../../Automation-Project/Playwright/agent/automation-agent.md).
If that file changes, the agent's grounding changes with it automatically, no
duplicate to keep in sync.

## How Routing Actually Works

The Orchestrator's "decision" is keyword matching over the task text
(`plan_for_task` in [graph/mock_llm.py](./graph/mock_llm.py)), not reasoning. See
"What's Mocked" below. It's genuinely conditional, though: a task about the UI only
pulls in the UI Flow Agent, not all six agents every time. If no keywords match
anything, it falls back to running the full pipeline rather than returning nothing.

## Sample Run

```
$ python3 graph/qa_workflow_graph.py "Automate the add-to-cart and checkout flow described in JIRA-142"

[orchestrator] plan: ['requirements_agent', 'ui_flow_agent', 'automation_engineer_agent']
[orchestrator] reasoning: Routed to requirements_agent, ui_flow_agent, automation_engineer_agent based on keywords found in the task.

[requirements_agent] Requirements Agent (mock response):
Following the JIRA-142 template in requirements_reference.md, this breaks into
Given/When/Then scenarios: (1) the happy path completes the described action,
(2) an invalid/edge-case input is rejected with a visible inline error, (3) skipping
the new input entirely does not regress the existing flow. ...

[ui_flow_agent] UI Flow Agent (mock response):
Based on ui_flows_reference.md, the closest matching documented flow is Add to Cart
-> Checkout: product list ([href="/products"]) -> [data-product-id="N"].add-to-cart
-> ... Selectors follow the data-qa/data-product-id convention over text selectors
where possible.

[automation_engineer_agent] Automation Engineer Agent (mock response):
Per agent/automation-agent.md: add a new spec under tests/, named for the behavior
(kebab-case, no typos). Add or reuse a page object in pages/ (getter-based
locators, no assertions inside the page object) and wire it into
fixtures/pages.fixture.js. Pull any needed values from test-data/ rather than
hardcoding them. Assert with expect(...).toBeVisible()/toHaveText() at each step,
no waitForTimeout. ...
```

Note `dev_integration_agent`, `debugging_agent`, and `pr_review_agent` were correctly
excluded. Nothing in that task text matched their keywords.

## Running It

```bash
pip install -r requirements.txt
python3 graph/qa_workflow_graph.py "Automate the add-to-cart and checkout flow described in JIRA-142"
```

## Running Tests

```bash
pip install -r requirements-dev.txt
pytest tests/ -v
```

Covers the routing logic for each agent (including that unrelated agents are
correctly excluded), the JSON-parse fallback, and `route_next`'s plan-exhaustion
branch: the actual original logic in this repo, as opposed to the mocked LLM
boundary.

## What's Mocked (By Design, Not a Placeholder)

The graph itself (state, nodes, conditional routing) is a real LangGraph
`StateGraph`. The one thing that's mocked is the LLM call (see
[graph/mock_llm.py](./graph/mock_llm.py)): `plan_for_task` is keyword matching, and
each specialist's response is a canned string, not a model generation.

This is the intended end state for this demo, not something waiting to be wired up to
a real model. The point of publishing this is for someone to be able to read the
README and the code and understand the orchestration design in a couple of minutes,
not to require them to install anything or hold an API key first. Requiring a live
model would make this harder to review, not more impressive.

## Using This With Your Own AI Workflows

This is built to be adapted, not just read. To get it working with your own AI
workflows:

1. **Clone this folder** (`AI-QA/Multi-Agent-Workflows/`) into your own project.
2. **Update the reference files** (most in `context/`, the Automation Engineer
   Agent's in your own automation repo) to point at your workflows instead of this
   portfolio's: your UI flows, your requirements/ticket format, your automation
   standards, your dev/CI setup, your debugging approach, your PR checklist. The
   agents are only as useful as what they're grounded in.
3. **Run the multi-agent flow in your model of choice**: Codex, Claude Desktop, a
   local Ollama model, the Anthropic/OpenAI API, whatever you've got. Swap
   `mock_llm_call` in `graph/mock_llm.py` for a real call to that model (the module
   docstring shows the shape of the change); nothing else in the graph needs to
   change.

## Status

Working: the orchestration graph, routing (including the two newest agents,
Debugging and PR Review), and a test suite covering the routing/fallback logic.

Not yet built:
- A doc on using AI to run UI checks, to help build out automation frameworks.
- A write-up on the value of MCP (Model Context Protocol) in this kind of workflow.
