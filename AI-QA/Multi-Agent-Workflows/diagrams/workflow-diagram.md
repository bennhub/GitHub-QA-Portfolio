# Workflow Diagram

The graph follows a supervisor pattern: the Orchestrator plans which specialists are
needed, the graph loops through that plan one specialist at a time (each one reading
and extending shared state), then falls through to a synthesis step once the plan is
exhausted.

```mermaid
flowchart TD
    START([START]) --> ORCH[Orchestrator<br/>plans which agents are needed]

    ORCH -->|route_next| REQ[Requirements Agent]
    ORCH -->|route_next| UI[UI Flow Agent]
    ORCH -->|route_next| AUTO[Automation Engineer Agent]
    ORCH -->|route_next| DEV[Dev Integration Agent]
    ORCH -->|route_next| DEBUG[Debugging Agent]
    ORCH -->|route_next| PR[PR Review Agent]
    ORCH -->|plan exhausted| SYN[Synthesize]

    REQ -->|route_next| UI
    REQ -->|route_next| AUTO
    REQ -->|route_next| DEV
    REQ -->|route_next| DEBUG
    REQ -->|route_next| PR
    REQ -->|plan exhausted| SYN

    UI -->|route_next| AUTO
    UI -->|route_next| DEV
    UI -->|route_next| DEBUG
    UI -->|route_next| PR
    UI -->|plan exhausted| SYN

    AUTO -->|route_next| DEV
    AUTO -->|route_next| DEBUG
    AUTO -->|route_next| PR
    AUTO -->|plan exhausted| SYN

    DEV -->|route_next| DEBUG
    DEV -->|route_next| PR
    DEV -->|plan exhausted| SYN

    DEBUG -->|route_next| PR
    DEBUG -->|plan exhausted| SYN

    PR -->|plan exhausted| SYN

    SYN --> END([END])
```

Every specialist node and the orchestrator share one state object
(`QAWorkflowState` in `../graph/qa_workflow_graph.py`): `task`, `plan`,
`current_step`, `agent_outputs`, `final_output`. `route_next` reads `plan` and
`current_step` after every node to decide where to go next — so the actual path
through the graph depends entirely on what the Orchestrator decided the task needs,
not a fixed sequence. Every agent can transition to every other agent in principle;
which edges actually get taken for a given run depends on the Orchestrator's plan.
