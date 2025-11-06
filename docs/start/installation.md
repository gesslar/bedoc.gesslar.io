---
title: Installation
hide_title: true
---

import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"

Installation of BeDoc is straightforward and can be done via npm or yarn. The
tool was built and tested on Node.js v23.5.0.

## Installation

BeDoc may be run as a standalone tool or as part of a project.

### Standalone

Installing BeDoc globally enables you to run it from the command line as well
as use it in your projects.

<Tabs
defaultValue="npm"
values={[
{label: "NPM", value: "npm"},
{label: "Yarn", value: "yarn"},
]}>
<TabItem value="npm">
```bash
npm i -g @gesslar/bedoc
```
</TabItem>
<TabItem value="yarn">
```bash
yarn global add @gesslar/bedoc
```
</TabItem>
</Tabs>

### Project

If you prefer to keep BeDoc local to your project, you can install it as a
development dependency.

<Tabs
defaultValue="npm"
values={[
{label: "NPM", value: "npm"},
{label: "Yarn", value: "yarn"},
]}>
<TabItem value="npm">
```bash
npm i -D @gesslar/bedoc
```
</TabItem>
<TabItem value="yarn">
```bash
yarn add --dev @gesslar/bedoc
```
</TabItem>
</Tabs>

## Verifying Your Installation

After installation, you can confirm that BeDoc is available by running:

<Tabs defaultValue="global" values={[{label: 'Global Install', value: 'global'}, {label: 'Local Install', value: 'local'}]}>
  <TabItem value="global">

```sh
bedoc --version
```

  </TabItem>
  <TabItem value="local">

```sh
npx bedoc --version
```

  </TabItem>
</Tabs>

To see available options, run:

<Tabs defaultValue="global" values={[{label: 'Global Install', value: 'global'}, {label: 'Local Install', value: 'local'}]}>
  <TabItem value="global">

```sh
bedoc --help
```

  </TabItem>
  <TabItem value="local">

```sh
npx bedoc --help
```

  </TabItem>
</Tabs>

## Next Steps

After installation, you can start generating documentation with BeDoc. Check
out the [Configuration Guide](configuration) to learn how to configure the
tool via CLI options, environment variables, JSON files, and more, as well
as how to incorporate BeDoc into your project workflow.
