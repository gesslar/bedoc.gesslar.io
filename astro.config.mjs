import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

export default defineConfig({
  site: 'https://bedoc.gesslar.io',
  integrations: [
    starlight({
      title: 'BeDoc',
      logo: {
        src: './src/assets/project-management.png',
      },
      favicon: '/img/favicon.svg',
      customCss: [
        './src/styles/custom.css',
      ],
      social: [
        { icon: 'discord', label: 'Discord', href: '/discord/' },
        { icon: 'heart', label: 'Testimonials', href: '/testimonials/' },
        { icon: 'star', label: 'Attributions', href: '/attribution/' },
        { icon: 'github', label: 'GitHub', href: 'https://github.com/gesslar/BeDoc' },
      ],
      sidebar: [
        {
          label: 'Your Journey Begins Here',
          items: [
            { label: 'Installation', slug: 'start/installation' },
            { label: 'Configuration', slug: 'start/configuration' },
            { label: 'Discovery', slug: 'start/discovery' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'Actions', slug: 'guides/actions' },
            { label: 'Parsers', slug: 'guides/parsers' },
            { label: 'Formatters', slug: 'guides/formatters' },
            { label: 'Contracts', slug: 'guides/contracts' },
            { label: 'Hooks', slug: 'guides/hooks' },
          ],
        },
        {
          label: 'Examples',
          items: [
            { label: 'Overview', slug: 'examples/examples' },
            { label: 'Contracts', slug: 'examples/contracts' },
          ],
        },
      ],
    }),
  ],
})
