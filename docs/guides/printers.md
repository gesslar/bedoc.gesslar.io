---
title: Printers
hide_title: true
---

This guide explains how to create custom printers for BeDoc. Printers are
responsible for transforming parsed documentation into specific output formats
like Markdown, HTML, or any other format you need.

## Printer Structure

A BeDoc printer consists of two main parts:

1. **Meta Information**: Defines the format and file extension. (_required_)
2. **Contract**: Specifies the printer interface. (_required_)
3. **Parser Object**: Implements the printer logic. (_required_)
4. **Hooks**: Supports [hook points](/actions/hooks) for custom logic. (_optional_, _external_)

A printer action is contained in a JavaScript action file.

Here's the minimal structure for a BeDoc printer:

### Printer

```javascript
{
  // Define meta information
  meta = {
    action: "print",          // required
    format: "wikitext",       // required
    documentExtension: ".md"  // You can add anything else your
                              // action needs, if you want to. 🤷🏻
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
   * @param {object[]} module.moduleContent An array of objects containing
   *  function definitions prepared by the parser.
   * @returns {Promise<object>} The result of the print operations.
   */
  async run(module) {
    // Print the content and return a response
    const {file: {module: moduleName}, moduleContent} = module

    // You know what? No.
    const finalOutput =
      `${module.toUpperCase()} has to have the worst grammar ever. ` +
      `I refuse to print it.`

    return {
      status: "success",                                    // Required
      message: "File printed successfully. 😏",             // Optional
      destFile: `${moduleName}${this.documentExtension}`,   // Required
      destContent: finalOutput,                             // Required
    }
  }
}
```

## Response Format

The printer's `run` method must return a response object with the following
structure:

### Success

To convey success and further information about the job, return a success
object.

```javascript
// Success response
{
  status: "success",
  destFile: string,    // Output filename (e.g., "module.md")
  content: string,     // Formatted documentation content
}
```

### Warning

To return no content, except a warning, you may return a warning object.

```javascript
// Warning response
{
  status: "warning",
  warning: string,      // War
}
```

### Error

At the time of this writing, an error response is not required. You may
simply `throw()`, and BeDoc will `catch()` it and report it.

## Core Utilities

The printer has access to certain of BeDoc's core utilities through
object propagated during the `setup()` function.

- [**Logging**](/objects/logger) functions (debug, info, warn, error)

## Hook Support

Printers automatically support [hooks](hooks), allowing users to modify the
printing process. Hook points include:

- `start`: Before printing begins
- `section_load`: When a documentation section is loaded
- `enter`: When entering a section
- `exit`: When exiting a section
- `end`: After printing completes

## Example Implementation

You can see examples of printer implementations on [GitHub](https://github.com/gesslar/BeDoc/tree/main/examples/node_modules_test).

## Best Practices

1. **Error Handling**: Always return appropriate error responses with detailed
   messages.

2. **Async Support**: Make your printer async to handle large documents
   efficiently and support async hooks.

3. **Validation**: Validate input content structure before processing.

4. **Content Structure**: Keep your output well-organized and consistent with
   the format's conventions.

## Testing Your Printer

BeDoc provides multiple ways to test your printers:

1. **Mock Mode**: Test using a local mock environment:

   ```bash
   bedoc --mock ./mock_dir -l javascript -f myformat -i test/*.js -o test/docs
   ```

2. **Direct File Usage**: Test your printer file directly without installing:

   ```bash
   bedoc --printer ./my-printer.js -l javascript -i test/*.js -o test/docs
   # Or use the short form
   bedoc -P ./my-printer.js -l javascript -i test/*.js -o test/docs
   ```

These options allow you to rapidly iterate on your printer implementation
without needing to package and install it first.

## Publishing Your Printer

When ready to publish, package your printer following BeDoc's naming and
structure conventions:

```json
{
  "name": "bedoc-myformat-printer",
  "version": "1.0.0",
  "type": "module",
  "description": "MyFormat printer for BeDoc",
  "bedoc": {
    "actions": [
      "./bedoc-myformat-printer.js"
    ]
  }
}
```

You can also package multiple printers together:

```json
{
  "name": "bedoc-doc-printers",
  "version": "1.0.0",
  "type": "module",
  "description": "Documentation printers for BeDoc",
  "bedoc": {
    "actions": [
      "./bedoc-markdown-printer.js",
      "./bedoc-html-printer.js"
    ]
  }
}
```

This structure allows BeDoc to automatically discover and load your printer
when installed.
