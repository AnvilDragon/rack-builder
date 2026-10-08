# Rack Builder + HRT Log

Two private home-lab apps in one container, behind one login:

- **Rack Builder** (`/rack/`): home lab rack planner with phased buying steps, order tracking, a budget timeline and a live view of the TrueNAS apps.
- **HRT Log** (`/hrt/`): single-user health journal with daily measurements, shots, labs and trends.

Open the app and create a login on first visit (10+ character password). First-time setup asks for a one-time **setup code**, which the container prints in its log on startup (TrueNAS: Apps > rack-builder > Logs; or set your own with `SETUP_CODE`). This stops anyone else on your network from claiming the login first. Then use the bar at the top to switch apps or sign out. Everything, including the live Docker stats, needs the login. Sessions last 30 days, five bad attempts lock sign-in for 15 minutes, and changing the password signs out other devices.

## Install on TrueNAS

1. **Pull the private image.** Make a GitHub token (classic) with only `read:packages`. In TrueNAS: Apps > Manage Images > Pull Image: name `ghcr.io/anvildragon/rack-builder`, tag `latest`, username `AnvilDragon`, password = the token.
2. **Make a dataset** such as `apps/rack-builder` and give the `apps` user (568) read/write access. Both apps keep their data there (`state.json` for Rack Builder, `hrt.db` for HRT Log).
3. **Apps > Discover Apps > three-dot menu > Install via YAML.** Paste `compose.yaml` and change `/mnt/POOL/apps/rack-builder` to your dataset path.
4. Open `http://<NAS IP>:30251`, or use the app's Web UI button.

## Moving over from the two separate apps

- **Rack Builder**: nothing to do. `state.json` in the same dataset is picked up as is.
- **HRT Log**: stop the old container, copy its `hrt.db` (and `hrt.db-wal` / `hrt.db-shm` if present) into the Rack Builder dataset, and give them to user 568. Your existing HRT login and data carry over. If you start fresh instead, the log starts empty. To pre-load starting data, put your own `hrt-seed.json` (same format as the `state` in an HRT Log JSON export) in the dataset before creating the login. It is read only at first setup and is never part of this repo, so keep personal data out of it.

## Updating

Every push to `main` builds a new image. To update, pull the image again in Apps > Manage Images, then restart the app.

## Live stats

The `socket-proxy` service gives read-only access to container stats, so the NAS apps view shows live CPU, RAM, ZFS cache and per-app usage every second (`LIVE_INTERVAL`). Remove that service and the `DOCKER_HOST_PROXY` line to turn it off.

## Weekly prices

A scheduled Claude task checks part prices every Sunday and saves them to `prices.json` in this repo. The NAS app reads that file every 6 hours.

To turn it on, make a fine-grained GitHub token: Settings > Developer settings > Personal access tokens > Fine-grained tokens > Generate. Repository access: only `rack-builder`. Permissions: Contents, Read-only. Put it in `PRICES_TOKEN` in the app's YAML.

## HRT Log data

The Data tab in HRT Log exports JSON (re-importable), CSV, or a SQLite backup. The backup leaves out the login and sessions. You can also snapshot the dataset.

## Run locally

`node server.js` (Node 22.13 or newer), then http://localhost:8080. Environment: `PORT`, `DATA_DIR` (default `./data`), `COOKIE_SECURE`, `SETUP_CODE`, `DOCKER_HOST_PROXY`, `LIVE_INTERVAL`, `PRICES_TOKEN`, `PRICES_REPO`, `PRICES_EVERY_HOURS`.

## Install on your iPhone

Open `http://<NAS IP>:30251` in **Safari**, sign in, then tap Share > **Add to Home Screen**. It opens full screen like an app, with one icon for both Rack Builder and HRT Log (use the bar at the top to switch). On your home Wi-Fi this works as is. To use it away from home, put it behind an HTTPS reverse proxy or VPN and set `COOKIE_SECURE=1`.

## Privacy and security notes

- Everything is served from your NAS: no third-party fonts, scripts, analytics or trackers (enforced by a strict Content-Security-Policy).
- No personal data belongs in this repo. HRT data lives only in `hrt.db` in your dataset; keep `hrt-seed.json` and exports out of git.
- Treat the dataset like medical records: snapshot or back it up to somewhere private. The JSON export contains your full log.
- Serve it only on your LAN, or behind a VPN or HTTPS reverse proxy. Do not forward the port straight to the internet.
