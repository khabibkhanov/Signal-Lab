# Startup DX Reliability Evidence

Timestamp (UTC): 2026-04-09T14:10:22Z

## Compose Configuration Validation

Command:

```bash
docker compose config --quiet && echo CONFIG_OK
```

Output:

```text
CONFIG_OK
```

## Container Health Snapshot

Command:

```bash
docker compose ps
```

Output:

```text
NAME                    IMAGE                     COMMAND                  SERVICE      CREATED             STATUS                    PORTS
signal-lab-backend      signal-lab-backend        "sh -c 'npm run pris…"   backend      5 minutes ago       Up 5 minutes (healthy)    0.0.0.0:3001->3001/tcp, [::]:3001->3001/tcp
signal-lab-frontend     signal-lab-frontend       "sh -c 'npm run dev'"    frontend     5 minutes ago       Up 5 minutes (healthy)    0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp
signal-lab-grafana      grafana/grafana:11.1.4    "/run.sh"                grafana      About an hour ago   Up 37 minutes             0.0.0.0:3100->3000/tcp, [::]:3100->3000/tcp
signal-lab-loki         grafana/loki:2.9.8        "/usr/bin/loki -conf…"   loki         About an hour ago   Up 37 minutes             3100/tcp
signal-lab-postgres     postgres:16-alpine        "docker-entrypoint.s…"   postgres     About an hour ago   Up 37 minutes (healthy)   0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp
signal-lab-prometheus   prom/prometheus:v2.54.1   "/bin/prometheus --c…"   prometheus   About an hour ago   Up 37 minutes             0.0.0.0:9090->9090/tcp, [::]:9090->9090/tcp
signal-lab-promtail     grafana/promtail:2.9.8    "/usr/bin/promtail -…"   promtail     About an hour ago   Up 37 minutes
```

## Endpoint Readiness Checks

Commands:

```bash
curl -s http://localhost:3001/api/health
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/docs
```

Output:

```text
{"status":"ok","timestamp":"2026-04-09T14:10:24.348Z"}
200
200
```

## Conclusion

- Compose configuration is valid.
- Backend and frontend start healthy.
- API health and docs endpoints are reachable.
