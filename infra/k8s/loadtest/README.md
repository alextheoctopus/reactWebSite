1. Ensure backend is running in namespace `dev-ops`:
   - `kubectl -n dev-ops get deploy server`

2. Apply Yandex.Tank load test manifests:
   - `kubectl apply -k infra/k8s/loadtest`

3. Watch test execution:
   - `kubectl -n dev-ops get pods -l app=yandex-tank-load -w`
   - `kubectl -n dev-ops logs -f job/yandex-tank-load`

4. Watch backend autoscaling:
   - `kubectl -n dev-ops get hpa server-hpa -w`
   - `kubectl -n dev-ops get pods -l app=server -w`

5. Rerun test:
   - `kubectl -n dev-ops delete job yandex-tank-load`
   - `kubectl apply -k infra/k8s/loadtest`

Notes:
- Target endpoint is `/api/auth/login` with POST body from `ammo.txt`.
- Load profile is set in `yandex-tank-configmap.yaml` (`line(20, 300, 5m) const(300, 5m)`).
- If cluster cannot pull image from Docker Hub, mirror `yandex/yandex-tank` to your Yandex Container Registry and update `yandex-tank-job.yaml`.
