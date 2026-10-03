# Agenda for Logseq DB

Agenda is a proof of concept for Logseq DB graphs. It provides calendar and task-planning views over tasks in your graph, keeping Logseq as the source of truth.

## Try it

1. Use a Logseq **DB graph** and enable Developer mode in Logseq's settings.
2. Clone this repository and build the plugin:

   ```sh
   pnpm install
   pnpm build:plugin
   ```

If you have Node.js and npm but not pnpm, run these from the repository folder:

   ```sh
   npx pnpm@8 install
   npx pnpm@8 build:plugin
   ```

3. In Logseq's Plugins settings, choose **Load unpacked plugin** and select the repository folder containing `package.json`.
4. Open Agenda from its toolbar button, or run **Agenda: Show** from the command palette.
5. Create or select tasks in Agenda. Tasks are Logseq blocks tagged with the `Task` class; their status, scheduled date, and deadline are stored as DB properties. If no page is selected when creating a task, it is added to today's journal.

This is an early DB-only MVP; see [Current scope](#current-scope) for supported features and limitations.

## Design direction

Agenda should be a planning layer over a Logseq graph, not a separate place to store tasks. Logseq remains the source of truth: tasks stay as blocks on their pages, while Agenda provides graph-wide calendar, kanban, and planning views.

The intended user already captures work in Logseq and wants to plan and review it across pages and journals. They should be able to keep a task in its original context, schedule it or set a deadline, find it in Agenda, and have changes made in either place apply to the same DB task.

## Integration principles

- Prefer Logseq's Task class and native DB properties. Do not silently overwrite values or metadata Agenda does not understand.
- Treat calendar, kanban, and planning views as projections over existing graph blocks; changes should update the source task rather than create a parallel copy.
- Keep the full planner on the plugin app surface. Page embeds should be optional, compact contextual views—not a squeezed version of the entire planner.
- Support in-context task capture and scheduling from the current page or block, operating on the same underlying DB task.
- Make it easy to navigate from an Agenda item back to its source block and page.
- Keep Agenda-specific properties to the minimum needed for data without a suitable native Logseq property, and document them.
- Define clearly which tasks, statuses, schedules, and deadlines appear in each view.

## Current scope

The DB-only MVP supports page selection and creating, listing, editing, and deleting scheduled tasks. It discovers blocks tagged with Logseq's `Task` class and uses DB properties for status, schedule, and deadline. Tasks created without a selected page go on today's journal.

Agenda-specific end dates, estimated time, and all-day settings are stored in hidden Agenda properties. In-context capture and scheduling are not yet implemented. Other unsupported areas include filters, objectives, actual-time logs, and task statuses beyond the MVP's Todo/Done handling.


### Inspirations

<img width="3104" height="1974" alt="image" src="https://github.com/user-attachments/assets/4a05cd0a-db55-4d7b-8419-4c948691f5d1" />
<img width="3104" height="1974" alt="image" src="https://github.com/user-attachments/assets/626bbeb6-c8b0-474b-b14e-a802811d2388" />
<img width="3104" height="1974" alt="image" src="https://github.com/user-attachments/assets/3374f305-63e3-4512-b2b5-a401b9f730b8" />
<img width="920" height="817" alt="image" src="https://github.com/user-attachments/assets/c4da45a2-2e0e-4ae3-9314-41cf76ad1c92" />


[Jethro Kuan's preview of an Org-mode workflow] shows how agenda views can bring actionable items together without requiring notes and tasks to live in separate systems. This is a useful design inspiration for Logseq: actionable work can remain close to the notes and project context it came from, while Agenda gathers it into focused views when the user wants to plan.

Agenda should therefore act as a set of views over the graph, not impose a separate task hierarchy or require users to move or duplicate information just to see it in a planner. Users may organize and refile work in ways that suit them; Agenda should make those tasks easier to find, schedule, and review across the graph.
