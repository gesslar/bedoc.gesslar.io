---
title: Parsers
---

This guide explains how to create custom parsers for BeDoc. Parsers read source
files and extract documentation into a structured object that a
[formatter](/guides/formatters/) can render.

A parser is an [action](/guides/actions/): a JavaScript file that
default-exports a class with a `static meta` block and a `setup` pipeline.

## Parser structure

A BeDoc parser has three parts:

1. **Meta** — declares the language it reads and points at its contract.
   (_required_)
2. **Contract** — an external [Terms](/guides/contracts/) file describing the
   object the parser **provides**. (_required_)
3. **Pipeline** — the steps that turn raw text into that object. (_required_)

Hooks are supported automatically at every named step. (_optional_, _external_)

### Minimal parser

```js
import { ActionBuilder, ACTIVITY } from "@gesslar/actioneer"

export default class LuaParser {
  static meta = Object.freeze({
    kind: "parser",
    input: "lua",                       // matched against --language lua
    terms: "ref://./bedoc-lua-parser.yaml",
  })

  // `setup` configures the pipeline. Step names become hook anchor points.
  setup = builder => builder
    .do("Extract blocks", this.#extractBlocks)
    .do("Process functions", ACTIVITY.SPLIT,
      ctx => ctx,                       // splitter: hand each block onward
      ctx => ctx,                       // rejoiner: collect the results
      new ActionBuilder()
        .do("Extract signature", this.#extractSignature)
        .do("Extract description", this.#extractDescription)
        .do("Extract tags", this.#extractTags),
    )
    .done(this.#finally)

  // The first step receives the raw file content as `ctx`.
  #extractBlocks = ctx => {
    const blocks = []
    for(const line of ctx.split(/\r?\n/)) {
      // …find doc blocks, push structured chunks…
    }
    return blocks
  }

  #extractSignature = ctx => ctx
  #extractDescription = ctx => ctx
  #extractTags = ctx => ctx

  // The final step returns the object promised by the contract.
  #finally = ctx => ({ functions: ctx })
}
```

The first pipeline step receives the file's text as its context. Each step
returns the context passed to the next. The `.done()` step returns the
structured result — the shape your contract **provides**.

:::tip
The pipeline API (`ActionBuilder`, `ACTIVITY.SPLIT`, `.done()`) comes from
[Actioneer](https://actioneer.gesslar.io/) — see its docs for the full
reference.
:::

## The contract

A parser declares what it produces in an external [Terms](/guides/contracts/)
file referenced by `meta.terms` (`ref://` is resolved relative to the action
file). A parser's contract uses `provides:`:

```yaml
# bedoc-lua-parser.yaml
# yaml-language-server: $schema=https://schema.gesslar.dev/bedoc/v1/bedoc-action.json
$schema: https://schema.gesslar.dev/bedoc/v1/bedoc-action.json
provides:
  type: object
  required:
    - functions
  properties:
    functions:
      type: array
      items:
        type: object
        required: [name, signature]
        properties:
          name: { type: string }
          signature:
            type: object
            properties:
              name: { type: string }
              parameters:
                type: array
                items: { type: string }
          description:
            type: array
            items: { type: string }
```

See the [Contracts](/guides/contracts/) guide for the full structure.

## Hook support

Every named pipeline step is a hook anchor. A user can wrap a step named
`"Extract tags"` with `before$extractTags` / `after$extractTags` handlers (the
hook name is the camelCase of the step name) to mutate the context as it flows
through. See the [Hooks](/guides/hooks/) guide.

## Example implementations

Real parsers (LPC and Lua) live in the BeDoc repository under
[`examples/node_modules_test`](https://github.com/gesslar/BeDoc/tree/main/examples/node_modules_test).

## Best practices

1. **Keep steps small and named.** Each named step is a hook point and a unit
   of testability.
2. **Honour your contract.** The object you `.done()` with must match what your
   Terms file `provides:`.
3. **Use `ACTIVITY.SPLIT` for per-item work** (e.g. per-function) so it runs
   concurrently.
4. **Reset state deliberately** if your steps carry parsing state.

## Testing your parser

**Mock mode** — point BeDoc at a directory of mock actions:

```bash
bedoc --mock ./mock_dir -l mylang -f markdown -i "test/*.ml" -o test/docs
```

**Direct file** — use your parser file without packaging it:

```bash
bedoc --parser ./my-parser.js --format markdown -i "test/*.ml" -o test/docs
# Or the short form
bedoc -p ./my-parser.js -f markdown -i "test/*.ml" -o test/docs
```

:::note
`--parser`/`-p` is mutually exclusive with `--language`/`-l`: a *language*
finds a matching parser, while a *parser* path is used directly.
:::

## Publishing your parser

Package your parser following BeDoc's naming and structure conventions, and list
the action file(s) under `bedoc.actions`:

```json
{
  "name": "bedoc-mylang-parser",
  "version": "1.0.0",
  "type": "module",
  "description": "MyLang parser for BeDoc",
  "bedoc": {
    "actions": ["./bedoc-mylang-parser.js"]
  }
}
```

This lets BeDoc automatically [discover](/start/discovery/) and load your parser
when it's installed.
