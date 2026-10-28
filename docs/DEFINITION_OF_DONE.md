# Definition of Done

Written before implementation. Each line is ticked only with evidence beside it
(a number, raw output, or a link). A tick without evidence counts as unticked.

- [x] Endpoint counts match the counts computed directly from the COCO subset file.
  Evidence: endpoint total 797 = sum of polygon parts in the subset file; person
  321 = 321, wine glass 28 = 28, car 26 = 26 (commit f3fb1da2c explains 797 vs 714).
- [x] Request with no login is refused with 401.
  Evidence: `no login: 401` from curl against /api/test/tasks/1/label-counts.
- [x] Logged-in user without access to the task is refused with 403.
  Evidence: user `viewer` (group user, not owner or assignee) gets
  {"detail":"You do not have access to this task."} with 403; admin gets 200.
- [x] Page renders the bar chart for a real task.
  Evidence: [ui-chart-task1.png](evidence/ui-chart-task1.png), "797 shapes across 72 labels".
- [x] Task with no annotations shows an empty state, not a crash.
  Evidence: [ui-empty-task2.png](evidence/ui-empty-task2.png); API returns {"task_id":2,"total":0,"labels":[]}.
- [x] Failed request shows an error message with a retry.
  Evidence: [ui-error-task999.png](evidence/ui-error-task999.png); API returns 404.
- [x] MO-1 measured 5 times, raw output saved, median and spread reported.
  Evidence: [OBJECTIVES.md](OBJECTIVES.md#result).
- [x] MO-1 target met, or missed with the reason written down.
  Evidence: median 23.7 ms against 200 ms; why the target was too loose is in OBJECTIVES.md.
- [x] Commits are small and each message says what changed and why.
  Evidence: `git log --oneline a81ed252d..dev-test01`.
- [x] Everything not finished is listed with the reason.
  Evidence: items 8 and 9 in PLAN.md, "Decided to skip".
- [x] (added at 13:00, after start) Counts grouped by shape type.
  Evidence: every label's types sum to its count; task-wide 792 polygons and 5 masks;
  [ui-chart-by-shape-type.png](evidence/ui-chart-by-shape-type.png).
