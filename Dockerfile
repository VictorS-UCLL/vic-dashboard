# ---- build stage ----
# The client bundle no longer contains the Grafana token or URL — metrics go
# through the same-origin /grafana-api path — so no VITE_ build-args are needed here.
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- serve stage ----
FROM nginx:1.27-alpine
# gettext = envsubst (template rendering); ca-certificates = TLS to the Grafana upstream.
RUN apk add --no-cache gettext ca-certificates
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/nginx.conf.template

EXPOSE 8080
USER nginx
# Render the nginx config at startup from the GRAFANA_TOKEN env var so the
# token is never baked into the image. Only ${GRAFANA_TOKEN} is substituted;
# nginx's own $variables survive. Point nginx at the rendered /tmp path.
CMD ["/bin/sh", "-c", \
    "envsubst '${GRAFANA_TOKEN}' < /etc/nginx/nginx.conf.template > /tmp/nginx.conf \
     && exec nginx -c /tmp/nginx.conf -g 'daemon off;'"]
