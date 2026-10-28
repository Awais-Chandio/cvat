# Objectives

## Environment
- CPU: Apple M1 Pro
- RAM: 32 GB
- OS: macOS 26.6.2
- Docker: Colima (6 CPU, 12 GB RAM, vz + Rosetta)
- CVAT commit: a81ed252dce15b805d5a544116cf98005e42f257
- Data: COCO 2017 val annotations (`instances_val2017.json`), fetched from a
  Hugging Face mirror because the official host stalled on my network;
  SHA256 checked against the hash published for the file. Number of images
  in the task: 100
- Annotation file SHA256: e8c7f7908f1d7278341fae127d0da654f102f11bd7b21d8aeefa635b8c810b6f
- Images: images.cocodataset.org timed out on every request from my network, so the
  100 images are grey placeholders with the exact file names and sizes from the COCO
  file. Annotations are the real COCO ones. The endpoint counts shapes, not
  pixels, so counts are unaffected.
- Ground truth for the first 100 images by file name: 100 images, 714 COCO
  annotations, 72 labels. CVAT imports each polygon part of a COCO annotation as
  its own shape, so the task holds 797 shapes (person 321, wine glass 28, car 26,
  cup 25, ...). The endpoint counts shapes and matches the 797 exactly.

## MO-1: label-count endpoint response time
| Field | Entry |
|---|---|
| What is measured | Total time of one GET request to the label-count endpoint for the COCO task |
| How | `curl -s -o /dev/null -w "%{time_total}\n"` with an auth token, 5 sequential runs |
| Target | Median of 5 runs at or below 200 ms |
| Why this target | The page makes one request and should show the chart without a visible wait. 200 ms is well under the point where a user notices delay, and the endpoint is a single GROUP BY query, so it should be reachable without caching. The server runs under Rosetta emulation, so I leave headroom. |
| Conditions | Local Docker stack on Colima, server already warm, nothing else running |
| Not included | First request after a container restart, browser render time |

## Result
Raw output (`~/coco/mo1_raw.txt`, run after the UI build finished, no build running):
```
Wed Oct 28 13:13:51 PDT 2026
run 1: 200 0.021027s
run 2: 200 0.021624s
run 3: 200 0.024219s
run 4: 200 0.023674s
run 5: 200 0.024105s
--- summary ---
runs: 5 | all HTTP 200: True
times (ms): 21.0, 21.6, 24.2, 23.7, 24.1
median: 23.7 ms | min: 21.0 ms | max: 24.2 ms | spread: 3.2 ms
median <= 200 ms: PASS
```

- Median 23.7 ms, min 21.0 ms, max 24.2 ms, spread 3.2 ms. Target met.
- The target was too loose: it was cleared by a factor of eight without any
  optimisation. I set it with headroom for Rosetta emulation and had not yet seen
  how cheap a single GROUP BY over 797 rows is.
- Not measured: behaviour at scale. The task holds 797 shapes; the full COCO val
  set would hold about 36,000. A useful next objective would be the same
  measurement on the full set, with a target tied to what the page needs.
