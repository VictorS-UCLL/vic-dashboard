export const FEATURED = {
  name: 'vic420 homelab',
  status: 'live',
  description:
    'Self-hosted production infrastructure built from scratch. Proxmox hypervisor, K3s cluster, Cloudflare Tunnel, full observability stack — and it serves the page you are reading.',
  tags: ['proxmox', 'k3s', 'docker', 'traefik', 'cloudflare', 'prometheus', 'grafana'],
  repo: 'github.com/VictorS-UCLL/homelab-k3s',
  href: 'https://github.com/VictorS-UCLL/homelab-k3s',
  // Rendered as the serving pipeline, ending at this very page.
  pipeline: ['internet', 'cloudflare', 'traefik', 'portfolio'],
}

export const PROJECTS = [
  {
    name: 'RAV3D',
    variant: 'rav3d',
    status: 'progress',
    description:
      'Underground 3D printing brand for the Belgian rave scene. NFC keychains, smoking accessories, limited drops.',
    tags: ['3d printing', 'branding', 'e-commerce', 'bambu lab'],
    href: null, // Instagram link — add when the page is public.
    linkLabel: 'instagram — soon',
  },
  {
    name: 'Emilio Archive',
    variant: 'archive',
    status: 'progress',
    description:
      'Digital archive and portfolio for Belgian graffiti artist Emilio. Underground archive aesthetic.',
    tags: ['web design', 'frontend', 'creative'],
    href: null, // add URL when live
    linkLabel: 'url coming soon',
  },
]
