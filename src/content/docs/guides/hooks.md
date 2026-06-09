---
title: Hooks
---

Hooks let you inject custom logic into a parser or formatter **without modifying
the action itself**. They run automatically at the named steps of an
[action's](/guides/actions/) pipeline, so you can trim a description, rewrite a
code block, fetch extra data, or upload output — all from a separate file.

:::tip[Built on Actioneer]
BeDoc's hooks are [Actioneer](https://actioneer.gesslar.io/) lifecycle hooks.
See the Actioneer [Lifecycle Hooks
guide](https://actioneer.gesslar.io/guides/hooks/) and [ActionHooks
reference](https://actioneer.gesslar.io/reference/action-hooks/) for the
underlying mechanism.
:::

## How hooks work

Every step in an action's pipeline has a name (e.g. `"Format function"`,
`"Extract tags"`, `"Finalize"`). For each step, BeDoc looks for matching hook
methods and runs them around it:

- **`before$<step>`** runs just before the step.
- **`after$<step>`** runs just after the step.

The `<step>` part is the **camelCase of the step name**: `"Format function"` →
`before$formatFunction` / `after$formatFunction`; `"Extract tags"` →
`after$extractTags`; `"Finalize"` → `after$finalize`.

You don't call hooks — BeDoc invokes them for you. If no hook matches a step,
nothing happens.

### Hooks are mutation-based

:::caution[Return values are ignored]
A hook's return value is **discarded**. Hooks work by **mutating the context
object in place**, not by returning a new value.
:::

The two signatures:

```js
// before$<step>: receives the context heading into the step. Mutate it.
before$formatFunction = ctx => {
  // ctx is the function about to be rendered
}

// after$<step>: receives (ctx, result) — the step's input and its output.
after$formatFunction = (ctx, result) => {
  // mutate `result` (or `ctx`) in place; returning a value does nothing
}
```

Because of this, **a transform must mutate something mutable.** To change a
formatter's output you mutate the array on the result of a per-item step (e.g.
`result.formatted` in `after$formatFunction`) — you cannot do it in
`after$finalize`, whose result is an immutable string.

## A hook file

A hook file exports a `Parse` class, a `Format` class, or both — matching the
action kind it should attach to. BeDoc instantiates them with `new Parse()` /
`new Format()`.

```js
export class Parse {
  // Strip @example tags during parsing — runs after the parser's
  // "Extract tags" step.
  after$extractTags = ctx => {
    delete ctx.tag?.example
  }
}

export class Format {
  // Trim blank lines from each function's description before it is rendered.
  before$formatFunction = ctx => {
    const description = ctx.description

    if(Array.isArray(description)) {
      while(description.length && !description.at(0)?.trim())
        description.shift()

      while(description.length && !description.at(-1)?.trim())
        description.pop()
    }
  }

  // Rewrite Markdown code fences to Wikitext syntaxhighlight, in place,
  // on the rendered sections of each function.
  after$formatFunction = (ctx, result) => {
    if(!Array.isArray(result?.formatted))
      return

    result.formatted = result.formatted.map(section =>
      section.replace(
        /```c\n([\s\S]+?)```/g,
        "<syntaxhighlight lang=\"c\">\n$1</syntaxhighlight>\n",
      ),
    )
  }
}
```

Point BeDoc at it with `--hooks`:

```bash
bedoc -l lpc -f wikitext -i "src/**/*.c" -o docs --hooks ./my-hooks.js
```

## Lifecycle hooks

Beyond per-step hooks, a hook class may define `setup` and `cleanup`, which run
once at the start and end of a run:

```js
export class Format {
  setup = async items => {
    // `items` is the array of things to be processed (e.g. the functions).
    // Use it for one-time preparation.
  }

  cleanup = async items => {
    // One-time teardown after all items are processed.
  }
}
```

:::note[No injected logger]
Hooks are **not** given a logger. `this.log` and `ctx.log` are `undefined`.
:::

## Best practices

1. **Mutate, don't return.** Change the context/result in place; returns are
   ignored.
2. **Pick the right step.** To alter output, hook a step whose context is a
   mutable object you can change (e.g. `after$formatFunction`).
3. **Guard your access.** Optional fields may be absent — use `?.` and array
   checks before mutating.
4. **Keep hooks fast.** They run inside the per-file pipeline; the
   `--hookTimeout` (default `5000`ms) bounds each hook's execution.
5. **Match the kind.** Put parser hooks on `class Parse`, formatter hooks on
   `class Format`.
