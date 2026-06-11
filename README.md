# vic-dashboard

Source code for my personal portfolio dashboard — live at [vic420.com](https://vic420.com).

A React single-page app that doubles as a live window into the infrastructure it runs on: real-time cluster metrics and an interactive topology view, both pulled from the Prometheus/Grafana stack running on the same K3s cluster that serves this site.

---

## Stack

- **Framework:** React + Vite (static build, no SSR)
- **Styling:** Tailwind CSS
- **Graph:** React Flow (`@xyflow/react`) for the live cluster topology
- **Icons:** Lucide React
- **Runtime:** nginx:alpine — non-root, port 8080
- **Registry:** ghcr.io/victors-ucll/vic420-portfolio
- **Orchestration:** K3s via [homelab-k3s](https://github.com/VictorS-UCLL/homelab-k3s)
- **Ingress:** Traefik
- **Exposure:** Cloudflare Tunnel (no open ports, no exposed IP)
- **TLS:** Cloudflare Origin Certificate, Full (strict)
- **CI/CD:** GitHub Actions on a self-hosted runner → build → ghcr.io → automatic K3s rollout

---

## Repository structure

```
vic-dashboard/
├── .github/workflows/deploy.yml   # CI/CD: build, push, deploy (self-hosted runner)
├── public/
├── src/
│   ├── components/
│   │   ├── Hero.jsx
│   │   ├── MetricsPanel.jsx        # live CPU/RAM/pods/uptime cards
│   │   ├── Topology.jsx            # React Flow cluster topology viewer
│   │   ├── TopologyNodes.jsx       # group / workload / external node types
│   │   ├── TopologyPanel.jsx       # node detail panel
│   │   ├── topologyLayout.js       # pure layout + edge engine
│   │   ├── Projects.jsx
│   │   ├── ProjectCard.jsx
│   │   ├── Stack.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   ├── icons.jsx
│   │   └── ui.jsx                  # shared primitives (SectionLabel, etc.)
│   ├── hooks/
│   │   ├── useGrafanaMetrics.js    # polls the 4 headline metrics
│   │   └── useTopologyData.js      # polls deployments/statefulsets/pods
│   ├── pages/
│   │   └── Privacy.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── Dockerfile                      # multi-stage build → non-root nginx:alpine
├── nginx.conf.template             # rendered at startup via envsubst
├── tailwind.config.js
├── vite.config.js
└── index.html
```

---

## Live data — how metrics reach the browser

The browser only ever calls the same-origin path `/grafana-api/...`. There is **no Grafana token in the client bundle**.

- **Dev:** the Vite proxy (`vite.config.js`) forwards `/grafana-api` to Grafana and injects the bearer token server-side.
- **Prod:** nginx does the same. `nginx.conf.template` is rendered at container startup via `envsubst`, injecting `GRAFANA_TOKEN` from the environment. The token is supplied at runtime by the K8s secret `grafana-token` — never baked into the image.

PromQL queries hit Grafana's Prometheus datasource proxy (`/api/datasources/proxy/uid/prometheus/...`). All fetches fail soft: on error, metrics show `--` and topology keeps its last-known state.

---

## CI/CD

Pushing to `main` (or a manual `workflow_dispatch`) triggers the pipeline on a **self-hosted runner on the homelab VM**:

1. Build the Docker image
2. Push to `ghcr.io/victors-ucll/vic420-portfolio:latest`
3. `kubectl rollout restart` + `rollout status` — runs locally on the runner, no SSH or exposed API

Because the runner sits on the same machine as K3s, deployment is fully automatic — no manual rollout step.

---

## Local development

```bash
# Install deps
npm install

# Dev server (needs a local .env with GRAFANA_TOKEN for live metrics — gitignored)
npm run dev

# Production build
npm run build && npm run preview
```

`.env` (local only, never committed):
```
GRAFANA_TOKEN=<grafana service-account token>
```

---

## Build & run the container locally

```bash
docker build -t vic420 .
docker run --rm -p 8080:8080 -e GRAFANA_TOKEN=<token> vic420
# http://localhost:8080
```

---

## Security

- nginx runs as the non-root `nginx` user on port 8080
- Grafana token injected at runtime via K8s secret — never in the image or the JS bundle
- Resource limits enforced on the deployment (64Mi RAM, 100m CPU)
- `imagePullPolicy: Always` — rollout always pulls the latest image
- Traffic encrypted end-to-end via Cloudflare Tunnel + Full (strict) TLS
- Real IP never exposed — the tunnel is outbound only
- No cookies, no analytics, no data collection (see `/privacy`)

---

## GitHub Actions secrets

| Secret | Purpose |
|--------|---------|
| `REGISTRY_TOKEN` | GitHub PAT with `write:packages` — ghcr.io push |

The self-hosted runner uses the local kubeconfig at `/home/vic/.kube/config` for deployment, so no cluster credentials are stored as GitHub secrets.

---

## Roadmap

- [x] Live at vic420.com via Cloudflare Tunnel
- [x] HTTPS with Cloudflare Origin Certificate (Full strict)
- [x] Non-root nginx container with resource limits
- [x] React + Vite + Tailwind portfolio
- [x] Live cluster metrics panel (Grafana/Prometheus)
- [x] Interactive cluster topology viewer (React Flow)
- [x] CI/CD with automatic rollout on a self-hosted runner
- [ ] Full visual redesign
- [ ] Management dashboard (auth + backend API)
