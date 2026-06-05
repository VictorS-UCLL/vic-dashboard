import ProjectCard, { FeaturedCard } from './ProjectCard'
import { SectionLabel } from './ui'

const PROJECTS = [
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
    variant: 'standard',
    status: 'progress',
    description:
      'Digital archive and portfolio for Belgian graffiti artist Emilio. Underground archive aesthetic.',
    tags: ['web design', 'frontend', 'creative'],
    href: null, // add URL when live
    linkLabel: 'url coming soon',
  },
  { variant: 'planned' },
]

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20">
      <SectionLabel>projects</SectionLabel>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FeaturedCard />
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.name ?? `planned-${i}`} project={p} />
        ))}
      </div>
    </section>
  )
}
