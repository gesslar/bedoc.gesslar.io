// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer'
// import { remarkSnippet } from "./src/plugins/remark-snippet.js"

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const { vsDark: PrismLight, vsDark: PrismDark } = prismThemes

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'BeDoc',
  tagline: 'Bespoke Documentation',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://bedoc.gesslar.dev/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'gesslar', // Usually your GitHub org/user name.
  projectName: 'BeDocs', // Usually your repo name.
  deploymentBranch: "gh-pages",

  onBrokenLinks: 'throw',
  onBrokenAnchors: "throw",
  onBrokenMarkdownLinks: 'throw',
  onDuplicateRoutes: "throw",

  trailingSlash: false,

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],


  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    'docusaurus-plugin-sass',
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: './sidebars.js',
        },
        theme: {
          customCss: [
            './src/css/custom.scss',
          ]
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/project-management.png',
      scrollToTop: true,
      scrollToTopOptions: {
        zIndex: 100,
      },

      docs: {
        sidebar: {
          hideable: false
        },
      },

      navbar: {
        hideOnScroll: false,
        title: 'BeDoc',
        logo: {
          alt: 'BeDoc logo',
          src: 'img/project-management.png',
        },
        items: [
          { type: "doc", position: "left", docId: "index", label: "Docs", sidebarId: "docs" },
          { type: "docSidebar", position: "left", sidebarId: "examples", label: "Examples" },
          {
            href: "/discord",
            position: "right",
            title: "lol",
            className: "header--svg-link",
            "aria-label": "GitHub repository",
            "data-icon": "discord",
          },
          {
            href: "/testimonials",
            position: "right",
            title: "What are people saying about BeDoc??",
            className: "header--svg-link",
            "aria-label": "What are people saying about BeDoc??",
            "data-icon": "testimonials",
          },
          {
            href: "/attribution",
            position: "right",
            title: "Look at my free stuff!",
            className: "header--svg-link",
            "aria-label": "Free stuff that I got",
            "data-icon": "attribution",
          },
          {
            href: "https://github.com/gesslar/BeDoc",
            title: "GitHub repository",
            position: "right",
            className: "header--svg-link",
            "aria-label": "GitHub repository",
            "data-icon": "github",
          },
        ],
      },

      footer: {
        style: 'dark',
        links: [],
        copyright: `🙅🏻<del>Copyright ©${new Date().getFullYear()}</del>🙅🏻<br /><a href="https://unlicense.org"/>Unlicensed</a> BeDoc. Built with Docusaurus.`,
      },

      prism: {
        additionalLanguages: [
          'powershell',
          'bash',
          'diff',
          'json',
          'yaml',
        ],
        magicComments: [
          {
            className: 'theme-code-block-highlighted-line',
            line: 'highlight-next-line',
            block: { start: 'highlight-start', end: 'highlight-end' },
          },
          {
            className: 'code-block-error-line',
            line: 'This will error',
          },
        ],
        theme: PrismLight,
        darkTheme: PrismDark,
      },

      colorMode: {
        defaultMode: "dark",
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },

      // announcementBar: {
      // id: `announcementBar-v${announcedVersion}`,
      // content: `🎉️ <b><a target="_blank" href="https://docusaurus.io/blog/releases/${announcedVersion}">Docusaurus v${announcedVersion}</a> is out!</b> 🥳️`,
      // },

      titleDelimiter: "~"
    }),
};

export default config;
