1. Update image names in:
   - `infra/k8s/server.yaml` -> `image: cr.yandex/<registry_id>/<server_repository>:<tag>`
   - `infra/k8s/client.yaml` -> `image: cr.yandex/<registry_id>/<client_repository>:<tag>`

2. Set a strong JWT secret in `infra/k8s/app-secret.yaml`.

3. Apply resources:
   - `kubectl apply -k infra/k8s`

4. Check rollout:
   - `kubectl -n dev-ops get pods`
   - `kubectl -n dev-ops get svc`
   - `kubectl -n dev-ops get hpa`

5. Client external IP:
   - `kubectl -n dev-ops get svc client`

Notes:
- HPA for backend is configured at 15% CPU utilization (`infra/k8s/backend-hpa.yaml`).
- For HPA metrics, ensure `metrics-server` is available in the cluster.

Monitoring (Prometheus + Grafana):
- See `infra/k8s/monitoring/README.md`.
- Backend application metrics are scraped via `infra/k8s/monitoring/server-servicemonitor.yaml` (`/actuator/prometheus`).

Load testing (Yandex.Tank):
- See `infra/k8s/loadtest/README.md`.
