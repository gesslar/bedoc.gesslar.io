---
title: Formatters
---

This guide explains how to create custom formatters for BeDoc. Formatters take
the structured object produced by a [parser](/guides/parsers/) and render it
into a specific output format — Markdown, Wikitext, HTML, or anything else.

A formatter is an [action](/guides/actions/): a JavaScript file that
default-exports a class with a `static meta` block and a `setup` pipeline.

## Formatter structure

A BeDoc formatter has three parts:

1. **Meta** — declares the output format, file extension, and contract.
   (_required_)
2. **Contract** — an external [Terms](/guides/contracts/) file describing the
   object the formatter **accepts**. (_required_)
3. **Pipeline** — the steps that render that object into text. (_required_)

Hooks are supported automatically at every named step. (_optional_, _external_)

### Minimal formatter

```js
import { ActionBuilder, ACTIVITY } from "@gesslar/actioneer"

export default class MarkdownFormatter {
  static meta = Object.freeze({
    kind: "formatter",
    format: "markdown",                 // matched against --format markdown
    extension: "md",                    // output files get this extension
    terms: "ref://./bedoc-markdown-formatter.yaml",
  })

  setup = builder => builder
    .do("Format functions", ACTIVITY.SPLIT,
      ctx => ctx,                       // splitter: one item per function
      this.#rejoinFormatted,            // rejoiner: collect rendered functions
      new ActionBuilder()
        .do("Format function", this.#formatFunction),
    )
    .do("Finalize", this.#finalize)

  // Render a single function. `ctx` is one function object from the parser.
  #formatFunction = ctx => {
    const sections = []

    if(ctx.name)
      sections.push(`## ${ctx.name}`)

    if(ctx.description?.length)
      sections.push(ctx.description.map(l => l.trim()).join("\n").trim())

    // attach the rendered sections to the context
    return { ...ctx, formatted: sections }
  }

  // Collect each function's `formatted` array after the SPLIT.
  #rejoinFormatted = (_, settled) => settled.map(e => e.formatted)

  // Join everything into the final document string.
  #finalize = ctx => ctx.flat().join("\n\n")
}
```

The `"Format functions"` step fans out over each function (via
`ACTIVITY.SPLIT`), the sub-pipeline renders each one, the rejoiner gathers the
results, and `"Finalize"` joins them into the single string BeDoc writes to disk
(using `meta.extension` for the filename).

:::tip
The pipeline API (`ActionBuilder`, `ACTIVITY.SPLIT`, `.done()`) comes from
[Actioneer](https://actioneer.gesslar.io/) — see its docs for the full
reference.
:::

## The contract

A formatter declares what input it can render in an external
[Terms](/guides/contracts/) file referenced by `meta.terms`. A formatter's
contract uses `accepts:`:

```yaml
# bedoc-markdown-formatter.yaml
# yaml-language-server: $schema=https://schema.gesslar.dev/bedoc/v1/bedoc-action.json
$schema: https://schema.gesslar.dev/bedoc/v1/bedoc-action.json
accepts:
  type: object
  required:
    - functions
  properties:
    functions:
      type: array
      items:
        type: object
        required: [name]
        properties:
          name: { type: string }
          signature:
            type: object
            properties:
              parameters:
                type: array
                items: { type: string }
          description:
            type: array
            items: { type: string }
```

BeDoc [negotiates](/guides/contracts/) the formatter's `accepts:` against the
parser's `provides:` before running. If they're incompatible, BeDoc stops before
processing a single file.

## Hook support

Every named pipeline step is a hook anchor. Because hooks are **mutation-based**
(a hook's return value is ignored), output-changing hooks attach to a step whose
context they can mutate. For example, converting code fences to Wikitext
`<syntaxhighlight>` is done in `after$formatFunction`, mutating
`result.formatted` — not in `after$finalize`, whose result is an immutable
string. See the [Hooks](/guides/hooks/) guide.

## Example implementations

Real formatters (Markdown and Wikitext) live in the BeDoc repository under
[`examples/node_modules_test`](https://github.com/gesslar/BeDoc/tree/main/examples/node_modules_test).

## Best practices

1. **Match your contract.** Render only what your Terms file `accepts:`, and
   guard optional fields.
2. **Keep steps named and small.** Each named step is a hook point.
3. **Do per-function work under `ACTIVITY.SPLIT`** so it runs concurrently.
4. **Finalize to a single string** — that's what BeDoc writes out.

## Testing your formatter

**Mock mode** — point BeDoc at a directory of mock actions:

```bash
bedoc --mock ./mock_dir -l javascript -f myformat -i "test/*.js" -o test/docs
```

**Direct file** — use your formatter file without packaging it:

```bash
bedoc --formatter ./my-formatter.js -l javascript -i "test/*.js" -o test/docs
# Or the short form
bedoc -P ./my-formatter.js -l javascript -i "test/*.js" -o test/docs
```

:::note
`--formatter`/`-P` is mutually exclusive with `--format`/`-f`: a *format* finds
a matching formatter, while a *formatter* path is used directly.
:::

## Publishing your formatter

Package your formatter following BeDoc's naming and structure conventions, and
list the action file(s) under `bedoc.actions`:

```json
{
  "name": "bedoc-myformat-formatter",
  "version": "1.0.0",
  "type": "module",
  "description": "MyFormat formatter for BeDoc",
  "bedoc": {
    "actions": ["./bedoc-myformat-formatter.js"]
  }
}
```

You can also package multiple actions together:

```json
{
  "name": "bedoc-doc-formatters",
  "version": "1.0.0",
  "type": "module",
  "bedoc": {
    "actions": [
      "./bedoc-markdown-formatter.js",
      "./bedoc-html-formatter.js"
    ]
  }
}
```

This lets BeDoc automatically [discover](/start/discovery/) and load your
formatter when it's installed.
