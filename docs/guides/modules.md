---
title: Modules
hide_title: true
---

<!-- Import Start -->

import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"

<!-- End Import -->

A module is any JavaScript file that contains one or more, or a combination
of printers and parsers and exports two arrays.

1. An **array of objects** providing each action's meta information
   implementation.
2. An **array of strings** defining the contract terms for each action, or
   references to external files that contain such contracts.

:::info

Each array must be of the same size and in the same order, with each action in
the first array corresponding to the contract in the second.

:::

In this way, one may have one or more action implementations, each with its own
contract, such that one might be able to provide any number of actions (parsers
and printers) within the same file. Making this incredibly portable.

## Actions

The first array is an array of objects that define the [actions](actions). Each object
has properties and methods that BeDoc calls, if present.

### Mandatory elements

#### Properties

- **`meta`** - The meta object within an action describes information about
  the object. It has two required properties.

  - *`action`* - Must be one of
    - `parse` for parsers
    - `print` for printers

  - *`language`* - For parsers, this identifies the language handled by this
    action
  - *`format`* - For printers, this identifies the output format for this
    action


<Tabs
  defaultValue="parser"
  values={[
    {label: 'Parser', value: 'parser'},
    {label: 'Printer', value: 'printer'},
  ]}>
  <TabItem value="parser">
```js
{
  meta: {
    action: "parse",
    language: "lua",
  }
}
```
  </TabItem>
  <TabItem value="printer">
```js
{
  meta: {
    action: "print",
    format: "wikitext",
  }
}
```
  </TabItem>
</Tabs>

#### Methods

- **`run({file,moduleContent})`** - The `run()` method is the interface to
  the action that is called by BeDoc to initiate it. When called, BeDoc will
  pass an object containing a [FileMap](/objects/file_and_dir) of the current
  file being processed and the content to be processed.

  ```javascript
  {
    async run({file, moduleContent}) {}
  }
  ```

  In the case of a parser, the `moduleContent` will be the plain text from
  the file that was read.

  In the case of a printer, it will be a structured object that has been
  produced by the parser.

### Optional elements

Optionally, there are additional methods that may be specified in your action
that BeDoc will call if present.

#### Methods

- `setup({log})` - This method will be called before the `run()`, providing
  an opportunity to perform some setup functions, such as caching the passed
  instance of the [Logger](/objects/logger) class in your action.

  ```javascript
  {
    async setup({log}) {
      this.log = log
      this.log.info(`Ready to ${this.meta} some ${this.language || this.format}!`)
    }
  }
  ```

- `cleanup()` - This method will be called as BeDoc is shutting down, providing
  an opportunity to do some finalisation or cleanup, if such a need exists.

  ```javascript
  {
    async cleanup() {
      this.log.info(`Bye bye. 😿`)
    }
  }
  ```

:::info

Each `setup()` and `cleanup()` for each action will occur once per
BeDoc lifecycle. Unlike `run()`, which gets called for every module
it processes, these methods only occur at the beginning and the end
of the entire run.

:::

## Contracts

The second array is one of strings that define the contract terms for each
action, in the same order as the first array. These are expressed as YAML or
JSON5 strings, providing the declaration of expectation for input, in the case
of printers and the promise of output, in the case of parsers.

Read the [Contracts Guide](contracts) to learn how to create contracts
for BeDoc.
