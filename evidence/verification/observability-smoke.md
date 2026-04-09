# Observability Smoke Evidence

Timestamp (UTC): 2026-04-09T14:02:44Z

## Service Status

`docker compose ps` output:

```
NAME                    IMAGE                     COMMAND                  SERVICE      CREATED             STATUS                    PORTS
signal-lab-backend      signal-lab-backend        "sh -c 'npm run pris…"   backend      18 seconds ago      Up 14 seconds (healthy)   0.0.0.0:3001->3001/tcp, [::]:3001->3001/tcp
signal-lab-frontend     signal-lab-frontend       "sh -c 'npm run dev'"    frontend     16 seconds ago      Up 8 seconds (healthy)    0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp
signal-lab-grafana      grafana/grafana:11.1.4    "/run.sh"                grafana      About an hour ago   Up 31 minutes             0.0.0.0:3100->3000/tcp, [::]:3100->3000/tcp
signal-lab-loki         grafana/loki:2.9.8        "/usr/bin/loki -conf…"   loki         About an hour ago   Up 31 minutes             3100/tcp
signal-lab-postgres     postgres:16-alpine        "docker-entrypoint.s…"   postgres     About an hour ago   Up 31 minutes (healthy)   0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp
signal-lab-prometheus   prom/prometheus:v2.54.1   "/bin/prometheus --c…"   prometheus   About an hour ago   Up 31 minutes             0.0.0.0:9090->9090/tcp, [::]:9090->9090/tcp
signal-lab-promtail     grafana/promtail:2.9.8    "/usr/bin/promtail -…"   promtail     About an hour ago   Up 31 minutes
```

## Endpoint Checks

- Backend health: {"status":"ok","timestamp":"2026-04-09T14:04:03.131Z"}
- Frontend HTTP code: 200
- Swagger HTTP code: 200

## Scenario Runs

- success response:

```
{"id":"cmnrjssg3000043o2mwfjc40b","type":"success","status":"completed","duration":0}
```

- validation_error HTTP: 400

```
{"statusCode":400,"message":"Validation failed: demo scenario triggered.","path":"/api/scenarios/run","timestamp":"2026-04-09T14:04:06.576Z"}
```

- system_error HTTP: 500

```
{"statusCode":500,"message":"Scenario execution failed.","path":"/api/scenarios/run","timestamp":"2026-04-09T14:04:06.602Z"}
```

- slow_request response:

```
{"id":"cmnrjsusw000343o2rhqowiv1","type":"slow_request","status":"completed","duration":2951}
```

- teapot HTTP: 418

```
{"signal":42,"message":"I'm a teapot"}
```

## Prometheus Metrics Sample

```
# HELP scenario_runs_total Total number of scenario runs by type and status
# TYPE scenario_runs_total counter
scenario_runs_total{type="success",status="completed"} 1
scenario_runs_total{type="validation_error",status="validation_error"} 1
scenario_runs_total{type="system_error",status="error"} 1
scenario_runs_total{type="slow_request",status="completed"} 1
scenario_runs_total{type="teapot",status="teapot"} 1
# HELP scenario_run_duration_seconds Scenario execution duration in seconds
# TYPE scenario_run_duration_seconds histogram
scenario_run_duration_seconds_bucket{le="0.05",type="success"} 1
scenario_run_duration_seconds_bucket{le="0.1",type="success"} 1
scenario_run_duration_seconds_bucket{le="0.25",type="success"} 1
```

## Grafana Dashboard API

```
[{"id":1,"uid":"efikj4im0shkwf","title":"Signal Lab","uri":"db/signal-lab","url":"/dashboards/f/efikj4im0shkwf/signal-lab","slug":"","type":"dash-folder","tags":[],"isStarred":false,"sortMeta":0},{"id":2,"uid":"signal-lab-overview","title":"Signal Lab Dashboard","uri":"db/signal-lab-dashboard","url":"/d/signal-lab-overview/signal-lab-dashboard","slug":"","type":"dash-db","tags":["observability","signal-lab"],"isStarred":false,"folderId":1,"folderUid":"efikj4im0shkwf","folderTitle":"Signal Lab","folderUrl":"/dashboards/f/efikj4im0shkwf/Signal Lab","sortMeta":0}]
```

## Loki Filter Sample

```
{"status":"success","data":{"resultType":"streams","result":[{"stream":{"app":"signal-lab","job":"signal-lab-backend","level":"error","scenarioType":"system_error"},"values":[["1775743446697200759","{\"message\":\"Scenario execution failed\",\"scenarioType\":\"system_error\"}"]]}]}}
```
