# Rack Builder

Home lab rack planner: phased buying steps with order tracking, budget timeline, and a live view of the TrueNAS apps.

## Install on TrueNAS

1. **Pull the private image.** Make a GitHub token (classic) with only `read:packages`. In TrueNAS: Apps > Manage Images > Pull Image: name `ghcr.io/anvildragon/rack-builder`, tag `latest`, username `AnvilDragon`, password = the token.
2. **Make a dataset** such as `apps/rack-builder` and give the `apps` user (568) read/write access. Your data lives there in `state.json`.
3. **Apps > Discover Apps > three-dot menu > Install via YAML.** Paste `compose.yaml` and change `/mnt/POOL/apps/rack-builder` to your dataset path.
4. Open `http://<NAS IP>:30251`, or use the app's Web UI button.

## Updating

Every push to `main` builds a new image. To update, pull the image again in Apps > Manage Images, then restart the app.

## Live stats

The `socket-proxy` service gives read-only access to container stats, so the NAS apps view shows live CPU, RAM, ZFS cache and per-app usage every 10 seconds. Remove that service and the `DOCKER_HOST_PROXY` line to turn it off.
