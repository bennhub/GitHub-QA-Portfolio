# Multi-Agent Workflows for QA

A graph-based multi-agent system that mirrors how I use AI for QA work day-to-day: one
Orchestrator agent that reads a task and delegates to specialist agents, each grounded
in a real reference file, with a final synthesis step combining their findings.

See [diagrams/workflow-diagram.md](./diagrams/workflow-diagram.md) for the graph
shape.

## Agents

| Agent | Specialty | Reference file |
|---|---|---|
| **Orchestrator** | Plans which specialists a task needs, in what order, and synthesizes their outputs at the end | — |
| **Requirements Agent** | Design docs, Jira ticket stories, engineering tech breakdown docs | [context/requirements_reference.md](./context/requirements_reference.md) |
| **UI Flow Agent** | Documented UI flows and page structure of the app under test | [context/ui_flows_reference.md](./context/ui_flows_reference.md) |
| **Automation Engineer Agent** | Current automation repo's code structure, codebase, and strict test-implementation guidelines | [context/automation_standards.md](./context/automation_standards.md) |
| **Dev Integration Agent** | Dev repo's unit tests, API control-flow structure, codebase, and CI/CD pipelines | [context/dev_repo_reference.md](./context/dev_repo_reference.md) |

The reference files aren't hypothetical — they're grounded in the real
[Automation-Project](../../Automation-Project/) suite and
[CI workflow](../../.github/workflows/ci.yml) already in this repo, so the agents'
"knowledge" matches what's actually true here.

## Running It

```bash
pip install -r requirements.txt
python3 graph/qa_workflow_graph.py "Automate the add-to-cart and checkout flow described in JIRA-142"
```

The graph itself — state, nodes, conditional routing — is a real LangGraph
`StateGraph`. The one thing that's mocked is the LLM call (see
[graph/mock_llm.py](./graph/mock_llm.py)), so this runs instantly with no API key, no
local model, and no network required, while still demonstrating genuine orchestration:
the Orchestrator reads the task, decides which specialists are actually relevant (not
all four, every time), routes between them in sequence, and synthesizes their outputs.
Swapping `mock_llm_call` for a real model call (e.g. the local-first approach already
used in [AI-Dojo](../AI-Dojo/)) wouldn't require changing anything else in the graph.

## Status

In development — this is the first working pass: orchestration, routing, and agent
grounding are real and tested; the LLM boundary is intentionally mocked for now.
Planned next: a write-up on using AI to run UI checks to help build out automation
frameworks, and on the value of MCP in this kind of workflow.
