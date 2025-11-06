---
title: Configuration
hide_title: true
---

Inline CSS example: <code className="language-css">`p { color: red; }`</code>

import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"

BeDoc offers a flexible, cascading, priority-based configuration system that
adapts to different use cases. It allows developers to configure the tool via

- CLI options
- environment variables
- JSON5 configuration files
- YAML configuration files
- `package.json` entries

with fallback defaults, ensuring seamless integration with diverse workflows.

---

## Supported Configuration Fields

The following configuration fields are supported by BeDoc:

|    **Field**    | **Description**                                 | **Required** |         **Example**         |
| :-------------: | :---------------------------------------------- | :----------: | :-------------------------: |
|   `language`    | Specifies the language parser to use            |     Yes      |       `"javascript"`        |
|    `format`     | Defines the output format                       |     Yes      |        `"markdown"`         |
|     `input`     | Files or directories to include                 |     Yes      |      `["src/**/*.js"]`      |
|    `exclude`    | Files or directories to exclude                 |      No      |   `["src/**/*.test.js"]`    |
|    `output`     | Output directory for generated docs             |      No      |        `"docs/api"`         |
|    `parser`     | Path to a JS module containing a parser action  |      No      | `"./engines/my-parser.js"`  |
|    `printer`    | Path to a JS module containing a printer action |      No      | `"./engines/my-printer.js"` |
|    `config`     | Path to a JSON5/YAML configuration file         |      No      |   `"./bedoc.config.json"`   |
|      `sub`      | Subconfiguration options from config file       |      No      |
|     `mock`      | Enables mock mode for testing modules           |      No      |     `./test/bedoc-mock`     |
|     `hooks`     | Path to a custom hooks module                   |      No      |       `"./hooks.js"`        |
|     `debug`     | Enables debug mode                              |      No      |                             |
|  `debugLevel`   | Sets the verbosity of debug logs (0-4)          |      No      |             `2`             |
|  `hookTimeout`  | Maximum time (ms) for hooks to execute          |      No      |           `5000`            |
| `maxConcurrent` | Maximum concurrent files to process             |      No      |            `500`            |

### **Defaults**

   If no explicit configuration is provided for these fields, BeDoc will use
   the following defaults:

   | **Field**     | **Default** |
   | ------------- | ----------- |
   | `debug`       | `false`     |
   | `debugLevel`  | `0`         |
   | `hookTimeout` | `5000`      |

### File matching

The `input` and `exclude` fields accept one or more values per configuration
item.

**CLI**, **Environment Variables**: Multiple values are expressed as
comma-separated strings.

<Tabs
  defaultValue="cli"
  values={[
    {label: "CLI", value: "cli"},
    {label: "Bash", value: "bash"},
    {label: "Powershell", value: "ps"},
  ]}>
  <TabItem value="cli">
  ```bash
  --input src/**/*.js,src/**/*.ts --exclude src/**/*.test.js
  ```
  </TabItem>
  <TabItem value="bash">
  ```bash
  export BEDOC_INPUT="src/**/*.js,src/**/*.ts"
  export BEDOC_EXCLUDE="src/**/*.test.js"
  ```
  </TabItem>
  <TabItem value="ps">
  ```powershell
  set BEDOC_INPUT=src/**/*.js,src/**/*.ts
  set BEDOC_EXCLUDE=src/**/*.test.js
  ```
  </TabItem>
</Tabs>

**JSON5**, **YAML**: These values are represented as arrays of strings. Such
as in a custom configuration file, or `package.json`.

<Tabs
  defaultValue="json5"
  values={[
    {label: "JSON5 😸", value: "json5"},
    {label: "YAML 😸", value: "yaml"},
    {label: "JSON 🙄", value: "json"},
  ]}>
  <TabItem value="json5">
  ```json
  input: ["src/**/*.js", "src/**/*.ts"]
  exclude: ["src/**/*.test.js"]
  ```
  </TabItem>
  <TabItem value="yaml">
  ```yaml
  input:
    - src/**/*.js
    - src/**/*.ts
  exclude:
    - src/**/*.test.js
  ```
  </TabItem>
  <TabItem value="json">
  ```json
  "input": ["src/**/*.js", "src/**/*.ts"]
  "exclude": ["src/**/*.test.js"]
  ```
  </TabItem>
</Tabs>

### Exclusivity

Some options are mutually exclusive. Specifying a configuration field that
conflicts with another will result in an error.

| **Field**  | **Exclusive of** |
| ---------- | ---------------- |
| `language` | `parser`         |
| `format`   | `printer`        |

`language` and `parser` serve the same goal, with the difference being that
specifying a language will find a matching parser, whereas, specifying a
parser will use that parser directly. The same is true of `format` and
`printer`.

:::info[Mock configuration]

While not exclusive, the [`mock`](#mock-mode) option will simply ignore all
of `language`, `parser`, `format`, and `printer` when present.

:::

### Discovery

BeDoc will automatically discover and load parsers and printers based on the
configuration provided. This allows for seamless integration of custom modules.

Discovery will search in the global `node_modules` directory, as well as the
local project directory. When using the `language` and `format` options, BeDoc will attempt to match parser and printer actions in these locations.

Read more about [Discovery](discovery).

### Mock Mode

When a `mock` path is provided, BeDoc will only use mock parsers and printers
located there for testing. This allows you to test your documentation workflow
without needing to install custom modules. Simply provide the path to the mock
directory and BeDoc will "discover" the mock modules there.

This mode entirely side-steps the discovery process, so no other modules will
be loaded. This is useful for rapid iteration and testing of custom modules.

## Configuration Hierarchy

BeDoc offers a cascading configuration system that prioritises the resolution
of configuration options.

1. **CLI** - Options typed at the CLI will be rendered first, but are also the
   first to be overriden by additional configurations that follow, if present.

   ```bash
   bedoc -l javascript -f markdown -i "src/**/*.js" -o docs
   ```

2. **Environment variables** - Options provided via environment variables
   should be expressed in all capital letters, prefixed by `BEDOC_`.

    <Tabs
      defaultValue="bash"
      values={[
        {label: "Bash", value: "bash"},
        {label: "Powershell", value: "ps"},
      ]}>
      <TabItem value="bash">
      ```bash {3}
      export BEDOC_LANGUAGE=javascript
      export BEDOC_FORMAT=markdown
      export BEDOC_INPUT=src/**/*.js # Use quotes if path has spaces
      export BEDOC_OUTPUT=docs
      export BEDOC_HOOKTIMEOUT=5000
      ```
      </TabItem>
      <TabItem value="ps">
      ```powershell
      set BEDOC_LANGUAGE=javascript
      set BEDOC_FORMAT=markdown
      set BEDOC_INPUT=src/**/*.js
      set BEDOC_OUTPUT=docs
      set BEDOC_HOOKTIMEOUT=5000
      ```
      </TabItem>
    </Tabs>

3. **JSON5/YAML Configuration File** - Configuration file options may be
   expressed in either JSON5 or YAML.

  :::info[On the topic of JSON 👴🏻]

  🙄 Yes, regular JSON is fine, too, and so is JSONC. Since JSON5 is a
  superset, *blahblahblah*, you can totally use all of them, but JSON5 is
  prettier and you should 💯 be using it, boomer.

  :::

  <Tabs
    defaultValue="json5"
    values={[
      {label: "JSON5", value: "json5"},
      {label: "YAML", value: "yaml"},
    ]}>
    <TabItem value="json5">
    ```json
    {
      language: "javascript",
      format: "markdown",
      input: ["src/**/*.js"],
      exclude: ["src/**/*.test.js"],
      output: "docs/api",
      debug: true,
      hookTimeout: 5000,
    }
    ```
    </TabItem>
    <TabItem value="yaml">
    ```yaml
    language: javascript
    format: markdown
    input:
      - src/**/*.js
    exclude:
      - src/**/*.test.js
    output: docs/api
    debug: true
    hooktTimeout: 5000
    ```
    </TabItem>
  </Tabs>

4. **`package.json` Entries** - In your project's package.json file, you may
   also include a `bedoc` object that contains configuration elements.

  ```json
  {
    "name": "my-project",
    "version": "1.0.0",
    "bedoc": {
      "language": "python",
      "format": "html",
      "input": ["src/**/*.py"],
      "output": "docs/html",
      "hookTimeout": 5000
    }
  }
  ```

5. Any [defaults](#defaults) not specifically expressed will be added last.

## Advanced Use Cases

### Mixing Configurations

You can mix and match configuration sources to suit your needs. Configuration
options are resolved and merged in the order of precedence based on the
[configuration hierarchy](#configuration-hierarchy).

- Use `package.json` for default settings.
- Override specific fields with environment variables for CI/CD.
- Fine-tune the behavior for a one-off run using CLI options.

### Dynamic Configurations

Configuration fields like `input` and `output` support glob patterns, enabling
dynamic inclusion or exclusion of files.

### Subconfigurations

Subconfigurations provide the opportunity for a configuration file to have
context-specific configurations, enabling you to support multiple different
projects and subprojects from the same base project. Additionally, akin to
VS Code's `launch.json`, you could express different configurations based
on different conditions or environments.

Everything at the root level of a configuration file is applied first, and
any specified sub-configuration will override or add to the values provided
by the configuration file as a whole.

<Tabs
  defaultValue="json"
  values={[
    {label: "JSON5", value: "json"},
    {label: "YAML", value: "yaml"},
  ]}>
  <TabItem value="json">
  ```json
  {
    debugLevel: 4,
    maxConcurrent: 50,
    language: "lpc",
    format: "markdown",
    input: ["/mnt/d/bestmudever/lib/**/*.c"],
    output: "output/wiki/markdown",
    sub:
    [
      {
        name: "dev",
        variables: {
          env: {
            USER_NAME: "DEV_USER_NAME",
            PASSWORD: "DEV_PASSWORD"
          }
        }
      },
      {
        name: "prod",
        debugLevel: 0,
        maxConcurrent: 5,
        variables: {
          env: {
            USER_NAME: "PROD_USER_NAME",
            PASSWORD: "PROD_PASSWORD"
          }
        }
      }
    ]
  }
  ```
  </TabItem>
  <TabItem value="yaml">
  ```yaml
  debugLevel: 4
  maxConcurrent: 50
  language: lpc
  format: markdown
  input:
    - /mnt/d/bestmudever/lib/**/*.c
  output: output/wiki/markdown
  sub:
    - name: dev
      variables:
        env:
          USER_NAME: DEV_USER_NAME
          PASSWORD: DEV_PASSWORD
    - name: prod
      debugLevel: 0
      maxConcurrent: 5
      variables:
        env:
          USER_NAME: PROD_USER_NAME
          PASSWORD: PROD_PASSWORD
  ```
  </TabItem>
</Tabs>

:::tip[My precioussss configggggggg]

> *One Config to rule them all,*<br />
> *One Config to find them,*<br />
> *One Config to bring them all,*<br />
> *And into **BeDoc** bind them.*

 \- Someone, probably, somewhere.

:::

## Debugging

Enable debug mode to inspect how configurations are resolved and applied, as
well as to get detailed logs. Debug mode offers varied verbosity and can be
set using the `--debug` and `--debugLevel` options.

```bash
bedoc -d -D 4
```

This outputs incredibly verbose and detailed logs, including configuration
sources and values.

### Debug Levels

The `debugLevel` option accepts values from 0 to 4, with increasing verbosity and
detail.

For more information about debug messages, you can review the exposed
[Logger object](/objects/logger) that is available to all actions and
hooks.

| **Level** | **Description**                                                          |
| :-------: | ------------------------------------------------------------------------ |
|     0     | No/critical debug information, not error level, but, should be logged    |
|     1     | Basic debug information, startup, shutdown, etc                          |
|     2     | Intermediate debug information, discovery, starting to get more detailed |
|     3     | Detailed debug information, parsing, processing, etc                     |
|     4     | Very detailed debug information. #NerdMode!                              |

---

By leveraging BeDoc's cascading configuration system, you can fine-tune your
documentation workflows to suit any project or environment.
