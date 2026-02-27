# Agent Orchestra — Scenario System

## How the Scenario System Works

Each scenario is a self-contained simulation definition declared as an object in the `SCENARIOS` array inside `src/App.tsx`. When a simulation runs, the engine:

1. Reads the selected scenario's `lead`, `agents`, `tasks`, and `messages` fields.
2. Initialises all agents with `status: 'idle'` and `progress: 0`.
3. Advances a simulation clock (`simTime`) over a fixed `SIM_DURATION` of 9 seconds.
4. Fires scheduled messages at their defined `time` offsets.
5. Resolves task dependencies — a task only starts once every task listed in its `dependencies` array reaches `status: 'completed'`.
6. Updates agent statuses (`idle → working → done`) based on their assigned task's state.
7. Renders agent nodes, connection lines, message particles, and progress bars on an HTML Canvas element in real time.

The simulation is purely visual and deterministic: given the same scenario definition it will always produce the same animation.

---

## Existing Scenarios

### 1. Build a Website (`id: 'website'`)

**Icon:** 🌐
**Agents:** 4 specialists + 1 lead (5 total)

A team lead coordinates four specialists to design, build, and test a website end-to-end.

| Agent | Role | Emoji | Color |
|-------|------|-------|-------|
| lead | Team Lead | 🧙 | `#00ffff` |
| designer | Designer | 🎨 | `#ff6b9d` |
| frontend | Frontend | ⚡ | `#ffd93d` |
| backend | Backend | 🔧 | `#6bcb77` |
| tester | Tester | 🔍 | `#4d96ff` |

**Task dependency chain:**

```
[designer] Design mockups
        ↓
[frontend] Build UI components ─┐
[backend]  Create API endpoints ─┴→ [tester] Integration testing
```

The designer and backend work can start in parallel. The tester waits for both frontend and backend to complete.

**Key messages (8 total):**
- Lead kicks off designer and backend simultaneously at the start.
- Designer delivers mockups → lead unblocks frontend.
- Backend confirms API is live.
- Frontend completes UI → lead triggers tester.
- Tester reports 47 passing tests.

---

### 2. Write a Blog Post (`id: 'blogpost'`)

**Icon:** ✍️
**Agents:** 3 specialists + 1 lead (4 total)

A sequential pipeline where a researcher, writer, and SEO optimizer collaborate to produce a polished article.

| Agent | Role | Emoji | Color |
|-------|------|-------|-------|
| lead | Team Lead | 🧙 | `#00ffff` |
| researcher | Researcher | 📚 | `#ff6b9d` |
| writer | Writer | ✒️ | `#ffd93d` |
| seo | SEO Optimizer | 📈 | `#6bcb77` |

**Task dependency chain:**

```
[researcher] Research topic & sources
        ↓
[writer] Write draft
        ↓
[seo] Optimize for SEO
```

Fully sequential — each agent waits for the previous one to complete before starting.

**Key messages (6 total):**
- Lead assigns research; researcher returns 12 sources.
- Lead assigns writing; writer delivers 1,847-word draft.
- Lead assigns SEO; optimizer returns a score of 94/100.

---

### 3. Debug a Crash (`id: 'debug'`)

**Icon:** 🐛
**Agents:** 3 specialists + 1 lead (4 total)

A sequential pipeline that reproduces, traces, and fixes a production crash.

| Agent | Role | Emoji | Color |
|-------|------|-------|-------|
| lead | Team Lead | 🧙 | `#00ffff` |
| reproducer | Reproducer | 🔄 | `#ff6b9d` |
| analyzer | Analyzer | 🧬 | `#ffd93d` |
| fixer | Fixer | 🛠️ | `#6bcb77` |

**Task dependency chain:**

```
[reproducer] Reproduce the crash
        ↓
[analyzer] Analyze stack trace
        ↓
[fixer] Write & test fix
```

Fully sequential — each stage depends on the output of the previous.

**Key messages (6 total):**
- Lead assigns reproduction; reproducer confirms crash on inputs larger than 2 MB.
- Lead asks analyzer to trace root cause; analyzer identifies a buffer overflow in the parser.
- Lead assigns fix; fixer deploys and verifies the patch.

---

### 4. Debug a Production Incident (`id: 'incident'`)

**Icon:** 🚨
**Agents:** 5 specialists + 1 lead (6 total)

A parallel incident-response workflow where an on-call engineer triages, specialists investigate concurrently, and an incident commander coordinates communication throughout.

| Agent | Role | Emoji | Color |
|-------|------|-------|-------|
| lead | Incident Commander | 🎖️ | `#00ffff` |
| oncall | On-Call Engineer | 📟 | `#ff6b9d` |
| backend | Backend Lead | 🖥️ | `#ffd93d` |
| dba | Database Expert | 🗄️ | `#a78bfa` |
| devops | DevOps Engineer | 🏗️ | `#6bcb77` |
| comms | Comms Lead | 📣 | `#fb923c` |

See the section below for full task and message definitions.

---

## Agent Role Definitions

Every agent in a scenario shares the same base fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier used to wire tasks and messages. The lead must use `id: 'lead'`. |
| `role` | `string` | Display name shown beneath the agent node. |
| `emoji` | `string` | Single emoji rendered inside the agent circle. |
| `x` | `number` | Horizontal position as a percentage of the container width (0–100). |
| `y` | `number` | Vertical position as a percentage of the container height (0–100). |
| `color` | `string` | Hex colour used for the agent's border, glow, message trails, and task progress bar. |

At runtime the engine attaches additional state fields (`status`, `progress`, `currentTask`, `pulsePhase`) — these are not part of the scenario definition.

### Lead vs. Specialist Agents

- **Lead** (`id: 'lead'`): Declared in the `lead` field of the scenario. Rendered slightly larger (56 px vs. 48 px). Appears at the top of the visualisation by convention (`y: 18`). Does not have a task assigned to it; it is always in `Coordinating` mode.
- **Specialists**: Declared in the `agents` array. Each should have exactly one task assigned to it (matched by `assignedTo` in the tasks array).

---

## Task Definitions

Each task object has these fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier referenced in `dependencies`. |
| `name` | `string` | Human-readable label shown in the Tasks panel. |
| `assignedTo` | `string` | Agent `id` responsible for this task. |
| `dependencies` | `string[]` | Array of task `id`s that must complete before this task starts. Empty array means the task starts immediately. |

### Timing model

The engine divides the `SIM_DURATION` (9 s) evenly across the number of tasks, then applies an offset of 0.5 s per dependency chain link. Tasks with no dependencies start at `t = 0.5 s`; tasks blocked by one dependency start at `t = depEnd + 0.5 s`; and so on. Each task runs for `(SIM_DURATION - 1) / taskCount` simulated seconds.

---

## Message Definitions

Messages are pre-scripted events fired at specific simulation times:

| Field | Type | Description |
|-------|------|-------------|
| `time` | `number` | Simulation time in seconds at which the message fires. |
| `from` | `string` | Agent `id` sending the message. |
| `to` | `string` | Agent `id` receiving the message. |
| `text` | `string` | Short message text shown in the floating bubble and appended to the Message Log. |

Messages animate as a moving dot along the line between the two agent nodes. They fade in and out during travel and are logged to the side panel in order of firing.

Best practices:
- Keep `text` under ~35 characters so it fits in the bubble without wrapping.
- Space messages at least 0.5 s apart to avoid visual collisions.
- Align message times with the expected task transition points (task start, task end).
- The lead sends messages at the start of each task and receives confirmation when a task completes.

---

## How to Create a Custom Scenario

Follow these steps to add a new scenario to `src/App.tsx`.

### Step 1: Plan your agent layout

Decide how many agents you need and place them at `(x, y)` percentage positions that avoid overlap. Common layouts:

- **3 agents**: `(25, 55)`, `(50, 75)`, `(75, 55)` — inverted triangle below the lead.
- **4 agents**: `(20, 50)`, `(50, 65)`, `(80, 50)`, `(50, 85)` — diamond.
- **5 agents**: `(15, 45)`, `(38, 65)`, `(62, 65)`, `(85, 45)`, `(50, 85)` — arc.

The lead always sits at `(50, 18)` by convention.

### Step 2: Define the task dependency graph

Draw the dependency chain on paper first. Identify which tasks can run in parallel and which must be sequential. Assign one task per specialist agent.

### Step 3: Write the scenario object

Add a new entry to the `SCENARIOS` array:

```typescript
{
  id: 'my-scenario',           // Unique kebab-case ID
  name: 'My Scenario',         // Short display name (shown in scenario picker)
  description: 'One sentence', // Shown beneath the name in the picker
  icon: '🔥',                  // Single emoji for the picker button
  lead: {
    id: 'lead',
    role: 'Team Lead',
    emoji: '🧙',
    x: 50, y: 18,
    color: '#00ffff',
  },
  agents: [
    { id: 'agent-a', role: 'Role A', emoji: '🔧', x: 25, y: 55, color: '#ff6b9d' },
    { id: 'agent-b', role: 'Role B', emoji: '📚', x: 75, y: 55, color: '#ffd93d' },
  ],
  tasks: [
    { id: 't1', name: 'First task',  assignedTo: 'agent-a', dependencies: [] },
    { id: 't2', name: 'Second task', assignedTo: 'agent-b', dependencies: ['t1'] },
  ],
  messages: [
    { time: 0.5, from: 'lead',    to: 'agent-a', text: 'Start first task' },
    { time: 3.0, from: 'agent-a', to: 'lead',    text: 'First task done' },
    { time: 3.5, from: 'lead',    to: 'agent-b', text: 'Start second task' },
    { time: 7.5, from: 'agent-b', to: 'lead',    text: 'Second task done' },
  ],
}
```

### Step 4: Pick colours

Use visually distinct hex colours with good contrast against the dark background. Each agent should have a unique colour so message trails are easy to follow. Suggested palette:

| Colour | Hex |
|--------|-----|
| Cyan (lead default) | `#00ffff` |
| Pink | `#ff6b9d` |
| Yellow | `#ffd93d` |
| Green | `#6bcb77` |
| Blue | `#4d96ff` |
| Purple | `#a78bfa` |
| Orange | `#fb923c` |

### Step 5: Verify

Run `npm run dev` and select your scenario from the picker. Check that:
- No agent nodes overlap.
- Messages fire at sensible times relative to the task progress.
- Every specialist agent has a matching task (`assignedTo` matches an agent `id`).
- The lead node is visually connected to all other agents by the dashed lines.
