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
  in the task: (filled after import)

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
(raw output, median and spread go here after measurement)