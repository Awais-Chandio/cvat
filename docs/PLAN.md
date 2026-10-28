# Plan: Annotation Analytics in CVAT

Branch: `dev-test01` · Base commit: `a81ed252dce15b805d5a544116cf98005e42f257`
Started: 08:16 · Deadline: 16:16

## Goal
Add a per-class annotation count to CVAT: an API endpoint that reads the counts
from the database, and a page in the web UI that shows them as a bar chart,
protected by CVAT's existing login and task permissions.

## Order of work (revised at 11:25, see "Changes to the plan")
| # | Step | Req. items | Time |
|---|------|-----------|------|
| 1 | Plan, Definition of Done, Objectives committed | docs | 11:30 |
| 2 | COCO val2017 subset imported into one task; read engine models | setup | 11:40–12:20 |
| 3 | Django app `cvat.apps.test`: counts endpoint as one DB aggregate | 1 | 12:20–12:50 |
| 4 | Reuse CVAT login: 401 without login, 403 without task access | 5 | 12:50–13:20 |
| 5 | UI route + page that calls the endpoint | 2 | 13:20–14:00 |
| 6 | Bar chart, empty state, error state with retry | 3, 4 | 14:00–14:45 |
| 7 | Measure MO-1, 5 runs, raw output saved | 6 | 14:45–15:05 |
| 8 | Group counts by shape type, only if time allows | 7 | — |
| 9 | Finish docs, decision record, DoD evidence | 10 | 15:05–15:30 |
| 10 | Loom recording, PR into my own fork's `main`, reply email | — | 15:30–16:00 |

Items 1–4 come first. Nothing after them starts until they work.

## Decided to skip
- Items 8–9 (live updates over WebSocket, reconnect). CVAT's server does not
  serve WebSockets today. Adding Django Channels, an ASGI route and a broadcast
  on every annotation save is a large change to infrastructure I do not know,
  and it would put the floor items at risk.
- Video tracks and tag annotations. I count drawn shapes only, because the
  COCO task is images.

## Risks
- CVAT's permission system (OPA policies) is new to me. I will reuse CVAT's own
  task permission check instead of writing my own rules.
- The prebuilt Docker images do not contain my code. Running it means building
  or mounting it, which costs time.
- Apple Silicon runs the amd64 images under Rosetta, so the server is slower
  than on native hardware. MO-1 numbers will reflect this.

## Changes to the plan
- 11:25: Setup and data took ~3h instead of 0:30. The fork had to be created,
  the Docker Compose plugin was missing on my Colima setup, Rosetta had to be
  installed for amd64 images, and the network was very slow: downloads from
  images.cocodataset.org and S3 stalled, so the annotation file was fetched from
  a Hugging Face mirror and checked by SHA256. Timings above were revised and
  item 7 moved to "only if time allows".
- Resetting the admin password failed with `auth.User has been swapped for
  iam.User`. CVAT uses a custom user model; `get_user_model()` fixed it.

## Decision record
(written when item 10 is reached)