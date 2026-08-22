# Frontend route performance baseline

## Scope

This baseline covers the production JavaScript emitted by `npm run build`. The application now loads route pages through dynamic imports so the initial document does not eagerly download merchant, review, payment, and administration modules.

## Guardrails

The build fails when either guardrail is exceeded:

- module entry: 400,000 bytes
- largest emitted JavaScript chunk: 500,000 bytes

These are engineering guardrails for the gray release, not a substitute for user-facing performance acceptance. The next measurement step is a cold-cache browser run for Home, Login, Profile, and Merchant Dashboard with a recorded network profile, LCP, and usable interaction time.

## Prior evidence

Before route splitting on 2026-08-22, Vite emitted JavaScript chunks of approximately 1,137,470 bytes and 375,170 bytes and reported a chunk-size warning.

## Acceptance boundary

This change establishes and enforces the bundle-size baseline. Close the performance issue only after the cold-cache measurements are recorded against the agreed network profile and the route budgets are either met or deliberately revised with evidence.
