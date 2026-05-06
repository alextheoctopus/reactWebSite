1. Create namespace and Grafana admin secret:
   - `kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f -`
   - `kubectl apply -f infra/k8s/monitoring/grafana-admin-secret.yaml`

2. Add Helm repo:
   - `helm repo add prometheus-community https://prometheus-community.github.io/helm-charts`
   - `helm repo update`

3. Install or upgrade monitoring stack:
   - `helm upgrade --install kube-prometheus-stack prometheus-community/kube-prometheus-stack --namespace monitoring --values infra/k8s/monitoring/values.yaml`

4. Register backend scraping via ServiceMonitor:
   - `kubectl apply -f infra/k8s/monitoring/server-servicemonitor.yaml`

5. Check status:
   - `kubectl -n monitoring get pods`
   - `kubectl -n monitoring get svc`
   - `kubectl -n dev-ops get servicemonitor server`

6. Get Grafana endpoint:
   - `kubectl -n monitoring get svc kube-prometheus-stack-grafana`

7. Get Grafana credentials:
   - login: `admin`
   - password: value from `infra/k8s/monitoring/grafana-admin-secret.yaml` (`admin-password`)

8. Verify backend metrics from Prometheus:
   - `kubectl -n monitoring port-forward svc/kube-prometheus-stack-prometheus 9090:9090`
   - Open `http://localhost:9090/targets` and ensure target `server` is `UP`.

9. Example PromQL to see application requests and metrics by pod:
   - `sum by (pod, method, status) (rate(http_server_requests_seconds_count{namespace="dev-ops"}[1m]))`
   - `sum by (pod, uri) (rate(http_server_requests_seconds_count{namespace="dev-ops"}[1m]))`
   - `sum by (pod) (rate(jvm_gc_pause_seconds_count{namespace="dev-ops"}[5m]))`
