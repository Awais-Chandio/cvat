# Definition of Done

Written before implementation. Each line is ticked only with evidence beside it
(a number, raw output, or a link). A tick without evidence counts as unticked.

- [ ] Endpoint counts match the counts computed directly from the COCO subset file. Evidence:
- [ ] Request with no login is refused with 401. Evidence:
- [ ] Logged-in user without access to the task is refused with 403. Evidence:
- [ ] Page renders the bar chart for a real task. Evidence:
- [ ] Task with no annotations shows an empty state, not a crash. Evidence:
- [ ] Failed request shows an error message with a retry. Evidence:
- [ ] MO-1 measured 5 times, raw output saved, median and spread reported. Evidence:
- [ ] MO-1 target met, or missed with the reason written down. Evidence:
- [ ] Commits are small and each message says what changed and why. Evidence:
- [ ] Everything not finished is listed with the reason. Evidence: