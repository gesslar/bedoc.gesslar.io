---
title: Contracts
hide_title: true
---

import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"

## **Understanding Contracts**

Contracts in BeDoc define the expected structure of input and output data for
**parsers** and **printers**. They ensure that actions are compatible with each
other, preventing mismatches and inconsistencies.

### **Getting Meta with It**

When you create a contract, you're defining a schema that describes the
shape of the data the action will accept. This schema follows the BeDoc
schema (which, yes, follows the JSON schema schema... it's schemas all
the way down).

### **The Lifecycle of a Contract**

1. **Negotiation Phase** → A contract starts as a **declaration of intent**,
   outlining what an action claims it will accept or provide.
2. **Validation Phase** → BeDoc validates the contract to ensure it follows the
   contract schema and that a parser-printer pair agrees on expectations.
3. **Enforcement Phase** → Once validated, the contract **becomes a schema**.
   BeDoc ensures that:
   - A **parser’s output matches its contract** before proceeding.
   - A **printer receives data that aligns with its contract**.
   - The contract remains **binding** for the entire data processing cycle.

### **How Contracts Are Used**

BeDoc actively **enforces contracts at runtime**, ensuring that data remains
consistent throughout processing. If a parser's output does not match its
contract, the process will halt before passing data to the printer. Similarly,
the printer must confirm the input matches its agreed structure before execution.

### **Key Contract Elements**

- **accepts** → Defines what structure an action **can process**.
- **provides** → Defines what structure an action **outputs**.
- **A contract must specify either `accepts` or `provides`, but never both.**

### **Minimal Parser Contract Example**

<Tabs defaultValue="yaml" values={[{label: 'YAML', value: 'yaml'}, {label: 'JSON5', value: 'json5'}]}>
  <TabItem value="yaml">

```json
provides:
  type: object
```

  </TabItem>
  <TabItem value="json5">

```json
{
  "provides": {
    "type": "object"
  }
}
```

  </TabItem>
</Tabs>

### **Minimal Printer Contract Example**

<Tabs defaultValue="yaml" values={[{label: 'YAML', value: 'yaml'}, {label: 'JSON5', value: 'json5'}]}>
  <TabItem value="yaml">

```json
accepts:
  type: object
```

  </TabItem>
  <TabItem value="json5">

```json
{
  "accepts": {
    "type": "object"
  }
}
```

  </TabItem>
</Tabs>

For complete contract examples, see the **Examples** section.
