---
title: Parsers
hide_title: true
---

<!-- Import Start -->

import {Required,Optional,External} from "@site/src/components/Badge"

<!-- End Import -->


This guide explains how to create custom parsers for BeDoc. Parsers are
responsible for analyzing source code and extracting documentation information,
producing a structured output that can be consumed and transformed by printers.

## Parser Structure

A BeDoc parser consists of four parts:

1. **Meta Information**: Defines the language. <Required />
2. **Contract**: Specifies the parser interface. <Required />
3. **Parser Object**: Implements the parsing logic. <Required />
4. **Hooks**: Supports [hook points](/actions/hooks) for custom logic.
   <Optional />
   <External />

A parser action is contained in a JavaScript action file.

Here's the minimal structure for a BeDoc parser:

### Parser

```javascript
{
  // Define meta information
  meta = {
    action: "parse",                // required
    language: "lpcdocs",            // required
    shape: "Chez is yum look 🧀"    // you can leave helpful notes
  },

  /**
   * This is the setup function, called in advance of running the job.
   *
   * @param {object} setup An object containing utility objects exposed by BeDoc
   * @param {object} setup.log A logging utility provided by BeDoc
   */
  setup(setup) {
    ({ log: this.log } = setup)
  },

  /**
   * This is the action to print structured object to text.
   *
   * @param {object} module Data coming in from the printer
   * @param {string} module.file The file object representing the file
   *  being currently being processed
   * @param {object[]} module.moduleContent A string containing the
   *  information read from the file.
   * @returns {Promise<object>} An object containing the structured data
   *  (probably).
   */
  async run(module) {
    // Parse the content and return a response
    const {file: {module: moduleName}, moduleContent} = module

    // WHEEEEEEEE CHEEEEEEEEEEEZZZZZZZZ
    const yay = () => Math.round(Math.random(2)) ? "!" : "?"

    const cheezzez = []
    for(let x = 0; x < Math.floor(Math.random(10)*100)+10; x++) {
      cheezzez.push(
        `I can hazzz: ${this.meta.shape}${yay()}`
      )
    }

    const result = {
      nomnom: cheezzez
    }

    return {
      status: "success",                  // Required
      result,                             // Required
    }
  }
}
```

### Contract

```javascript
`
provides:
  root:
    dataType: object
    contains:
      nomnom:
        dataType: string[]
`
```

## Hook Support

Parsers automatically support [hooks](hooks), allowing users to modify the
content during parsing process. The following hooks are available:

- `module_start`: Before parsing begins
- `section_start`: At the beginning of a new section over which the parser is
  iterating.
- `enter` and `exit`: When entering and exiting specific parts of a section
  that are being parsed (ex. description, parameters, returns, function
  signature).
- `section_end`: At the end of a section.
- `module_end`: After parsing completes

## Example Implementation

You can see examples of parser implementations on [GitHub](https://github.com/gesslar/BeDoc/tree/main/examples/node_modules_test).

## Best Practices

1. **Error Handling**: Be sure to catch and properly report errors from async
   operations.
2. **Async Support**: Make your parser async to handle large files efficiently
   and support async hooks.
3. **Validation**: Validate input parameters and document structure before
   processing.
4. **State Management**: Keep track of parser state (e.g., inside comment
   block, current function) clearly and reset it appropriately.

## Testing Your Parser

BeDoc provides multiple ways to test your parsers:

1. **Mock Mode**: Test using a local mock environment:
   ```bash
   bedoc --mock ./mock_dir -l mylang -f markdown -i test/*.ml -o test/docs
   ```

2. **Direct File Usage**: Test your parser file directly without installation:

   ```bash
   bedoc --parser ./my-parser.js --format markdown -i test/*.ml -o test/docs

   # Or use the short form
   bedoc -p ./my-parser.js -f markdown -i test/*.ml -o test/docs
   ```

These options let you test your parser without packaging or installing it.
The direct file usage is particularly helpful during initial development
and debugging.

## Publishing Your Parser

When ready to publish, package your parser following BeDoc's naming and
structure conventions:

```json
{
  "name": "bedoc-mylang-parser",  // bedoc-<language>-parser-<anything_else>
  "version": "1.0.0",
  "type": "module",
  "description": "MyLang parser for BeDoc",
  "bedoc": {
    "actions": [
      "./bedoc-mylang-parser.js"
    ]
  }
}
```

This structure allows BeDoc to automatically discover and load your parser when
installed.
