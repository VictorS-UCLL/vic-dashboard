# vic-dashboard

Source code and Dockerfile for my personal portfolio/dashboard, deployed to Kubernetes at [vic420.com](https://vic420.com).

---

## Stack

- **Runtime:** nginx:alpine (non-root, port 8080)
- **Container registry:** ghcr.io/victors-ucll/vic420-portfolio
- **Orchestration:** K3s via [homelab-k3s](https://github.com/VictorS-UCLL/homelab-k3s)
- **Ingress:** Traefik
- **Exposure:** Cloudflare Tunnel (no open ports, no exposed IP)
- **TLS:** Cloudflare Origin Certificate, Full (strict) mode
- **CI/CD:** GitHub Actions → ghcr.io → manual rollout

---

## Repository structure

```
vic-dashboard/
├── .github/
│   └── workflows/
│       └── deploy.yml   # Build and push to ghcr.io
├── Dockerfile           # nginx:alpine, runs as non-root on port 8080
├── nginx.conf           # Custom config, non-root compatible, tmp dirs
└── index.html           # Portfolio content
```

---

## CI/CD workflow

Pushing to `main` or triggering manually via the Actions tab:

1. Builds the Docker image
2. Pushes to `ghcr.io/victors-ucll/vic420-portfolio:latest`

Then on the server, trigger the rollout:

```bash
kubectl rollout restart deployment portfolio
kubectl rollout status deployment portfolio
```

---

## Local development

```bash
# Build the image
docker build -t vic420-portfolio:latest .

# Run locally
docker run -d -p 8080:80 --name portfolio vic420-portfolio:latest

# View in browser
open http://localhost:8080

# Stop
docker rm -f portfolio
```

---

## Manual deploy (server)

If you need to rebuild and push manually without GitHub Actions:

```bash
docker build -t vic420-portfolio:latest .
docker tag vic420-portfolio:latest ghcr.io/victors-ucll/vic420-portfolio:latest
docker push ghcr.io/victors-ucll/vic420-portfolio:latest
kubectl rollout restart deployment portfolio
```

---

## Security

- Container runs as `nginx` user — not root
- Port 8080 inside container (non-privileged port)
- Resource limits: 64Mi RAM, 100m CPU
- `imagePullPolicy: Always` — always pulls latest image on restart
- No secrets or credentials baked into the image
- Traffic encrypted end-to-end via Cloudflare Tunnel + Full (strict) TLS
- Real IP never exposed — Cloudflare Tunnel is outbound only

---

## GitHub Actions secrets required

| Secret | Purpose |
|--------|---------|
| `REGISTRY_TOKEN` | GitHub PAT with `write:packages` scope for ghcr.io push |

---

## Roadmap

- [x] Portfolio placeholder
- [x] Non-root nginx container
- [x] Resource limits
- [x] Live at vic420.com via Cloudflare Tunnel
- [x] HTTPS with Cloudflare Origin Certificate (Full strict)
- [x] GitHub Actions CI/CD pipeline
- [ ] Real portfolio design
- [ ] Automatic rollout on image push
- [ ] Prometheus metrics
