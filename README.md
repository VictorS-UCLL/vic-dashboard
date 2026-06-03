# vic-dashboard

Source code and Dockerfile for my personal portfolio/dashboard, deployed to Kubernetes at [vic420.com](https://vic420.com).

---

## Stack

- **Runtime:** nginx:alpine
- **Container registry:** ghcr.io/victors-ucll/vic420-portfolio
- **Deployment:** K3s via [homelab-k3s](https://github.com/VictorS-UCLL/homelab-k3s)
- **Exposure:** Cloudflare Tunnel

---

## Repository structure

```
vic-dashboard/
├── Dockerfile       # nginx:alpine, runs as non-root on port 8080
├── nginx.conf       # Custom config, non-root compatible
└── index.html       # Portfolio content
```

---

## Local development

```bash
# Build the image
docker build -t vic420-portfolio:latest .

# Run locally
docker run -d -p 8080:80 --name portfolio vic420-portfolio:latest

# Open in browser
open http://localhost:8080

# Stop
docker rm -f portfolio
```

---

## Deployment

Build and push to GitHub Container Registry:

```bash
docker build -t vic420-portfolio:latest .
docker tag vic420-portfolio:latest ghcr.io/victors-ucll/vic420-portfolio:latest
docker push ghcr.io/victors-ucll/vic420-portfolio:latest
```

Then trigger a rolling restart in K3s:

```bash
kubectl rollout restart deployment portfolio
```

---

## Security

- Container runs as `nginx` user, not root
- Port 8080 inside container (non-privileged)
- Resource limits: 64Mi RAM, 100m CPU
- No secrets or credentials in the image

---

## Roadmap

- [x] Basic portfolio placeholder
- [x] Non-root container
- [x] Resource limits
- [x] Live at vic420.com via Cloudflare Tunnel
- [ ] Real portfolio design
- [ ] GitHub Actions CI/CD pipeline
- [ ] HTTPS via cert-manager
