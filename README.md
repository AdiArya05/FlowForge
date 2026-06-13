# FlowForge

FlowForge turns a screen recording of repetitive business work into an automation diagnosis and a tested automation run.

## Sponsor Stack

- VideoDB: extracts workflow steps from screen recordings.
- Bright Data: researches live public web data needed by the automation.
- Kimi API Platform: reasons over the workflow, recommends AI usage, and generates code.
- Daytona: safely runs the generated automation in an isolated sandbox.

## Start

```bash
cp .env.example .env.local
node server.mjs
```

Open `http://localhost:3002`.

The app runs with realistic demo fallbacks if sponsor keys are missing, so it is safe for live demos while integrations are being connected.

## Demo

1. Open `http://localhost:3002`.
2. Click `Run FlowForge`.
3. Show the judges:
   - VideoDB-style workflow steps
   - Kimi automation diagnosis
   - Bright Data web research output
   - generated automation code
   - Daytona sandbox run panel
