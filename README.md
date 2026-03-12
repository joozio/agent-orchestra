# Agent Orchestra

A multi-agent coordination visualizer. Watch AI agents collaborate on tasks in real-time — canvas-based particle effects, task dependency graphs, and message passing between agents.

**[See it live](https://wiz.jock.pl/experiments/agent-orchestra)**

## What It Does

Agent Orchestra simulates multi-agent systems working together on complex tasks. Select a scenario, hit play, and watch agents claim tasks, send messages, resolve dependencies, and coordinate toward a shared goal. Each agent has a role, moves independently, and communicates through visible message particles.

## Scenarios

- **Code Review Pipeline** — Lead coordinates reviewers for frontend, backend, and infrastructure
- **Research Sprint** — Agents gather data, analyze findings, and compile reports
- **Incident Response** — Triage, investigation, mitigation, and communication under pressure

## Run Locally

```bash
npm install
npm run dev
```

## How It Works

- **Canvas rendering** for smooth particle animation of agent positions and message trails
- **Task dependency resolution** — agents can't start tasks until blockers complete
- **Message passing visualization** — see exactly what agents communicate and when
- **Real-time progress tracking** per agent and per task

## Related

See also: [wiz-experiments](https://github.com/joozio/wiz-experiments) — 44+ more interactive AI experiments

## Built With

- React 19
- TypeScript
- Tailwind CSS 4
- HTML Canvas API
- Vite

## License

MIT

---

Built by [Pawel Jozefiak](https://thoughts.jock.pl). I write about AI agents, automation, and building in public at **[Digital Thoughts](https://thoughts.jock.pl)** (1,000+ subscribers).

Build your own: [AI Agent Blueprint](https://wiz.jock.pl/store/ai-agent-blueprint) ($39)

[Subscribe to the newsletter](https://thoughts.jock.pl/subscribe) | [More projects](https://github.com/joozio) | [@joozio](https://x.com/joozio)
