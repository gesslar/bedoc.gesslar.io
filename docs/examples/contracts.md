---
title: Contracts
sidebar: examplesSidebar
description: Examples of action contracts in both YAML and JSON5.
hide_title: true
---

import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"

<!-- <IIcon icon="line-md:cog-filled-loop" height="48" /> This is a GitHub icon. -->

## YAML

<Tabs
  defaultValue="parser"
  values={[
    {label: 'Parser', value: 'parser'},
    {label: 'Printer', value: 'printer'},
  ]}>
  <TabItem value="parser">
  ```json title="bedoc_parser_lpc.yaml"
# yaml-language-server: $schema=https://bedoc.gesslar.dev/schemas/v1/bedoc.action.json
provides:
  type: object
  properties:
    functions:
      type: array
      items:
        type: object
        properties:
          name:
            type: string
          description:
            type: array
            items:
              type: string
          param:
            type: array
            items:
              type: object
              properties:
                type:
                  type: string
                name:
                  type: string
                content:
                  type: array
                  items:
                    type: string
          return:
            type: object
            properties:
              type:
                type: string
              content:
                type: array
                items:
                  type: string
          example:
            type: array
            items:
              type: string
  ```
  </TabItem>
  <TabItem value="printer">
  ```yaml title="bedoc_parser_wikitext.yaml"
# yaml-language-server: $schema=https://bedoc.gesslar.dev/schemas/v1/bedoc.action.json
accepts:
  type: object
  required:
    - functions
  properties:
    functions:
      type: array
      items:
        type: object
        required:
          - name
        properties:
          name:
            type: string
          description:
            type: array
            items:
              type: string
          param:
            type: array
            items:
              type: object
              required:
                - name
                - type
              properties:
                type:
                  oneOf:
                    - type: string
                    - type: array
                      items:
                        type: string
                name:
                  type: string
                content:
                  type: array
                  items:
                    type: string
          return:
            type: object
            required:
              - type
            properties:
              type:
                oneOf:
                  - type: string
                  - type: array
                    items:
                      type: string
              content:
                type: array
                items:
                  type: string
          example:
            type: array
            items:
              type: string
  ```
  </TabItem>
</Tabs>

## JSON

<Tabs
  defaultValue="parser"
  values={[
    {label: 'Parser', value: 'parser'},
    {label: 'Printer', value: 'printer'},
  ]}>
  <TabItem value="parser">
```json title="bedoc_parser_lpc.json"
{
  $schema: "https://bedoc.gesslar.dev/schemas/v1/bedoc.action.json",
  provides: {
    type: "object",
    properties: {
      functions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: {
              type: "string"
            },
            description: {
              type: "array",
              items: {
                type: "string"
              }
            },
            param: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: {
                    type: "string"
                  },
                  name: {
                    type: "string"
                  },
                  content: {
                    type: "array",
                    items: {
                      type: "string"
                    }
                  }
                }
              }
            },
            return: {
              type: "object",
              properties: {
                type: {
                  type: "string"
                },
                content: {
                  type: "array",
                  items: {
                    type: "string"
                  }
                }
              }
            },
            example: {
              type: "array",
              items: {
                type: "string"
              }
            }
          }
        }
      }
    }
  }
}
```
  </TabItem>
  <TabItem value="printer">
```json title="bedoc_printer_wikitext.json"
{
  $schema: "https://bedoc.gesslar.dev/schemas/v1/bedoc.action.json",
  accepts: {
    type: "object",
    required: [
      functions
    ],
    properties: {
      functions: {
        type: "array",
        items: {
          type: "object",
          required: [
            "name"
          ],
          properties: {
            name: {
              type: "string"
            },
            description: {
              type: "array",
              items: {
                type: "string"
              }
            },
            param: {
              type: "array",
              items: {
                type: "object",
                required: [
                  "name",
                  "type"
                ],
                properties: {
                  type: {
                    oneOf: [
                      {
                        type: "string"
                      },
                      {
                        type: "array",
                        items: {
                          type: "string"
                        }
                      }
                    ]
                  },
                  name: {
                    type: "string"
                  },
                  content: {
                    type: "array",
                    items: {
                      type: "string"
                    }
                  }
                }
              }
            },
            return: {
              type: "object",
              required: [
                "type"
              ],
              properties: {
                type: {
                  oneOf: [
                    {
                      type: "string"
                    },
                    {
                      type: "array",
                      items: {
                        type: "string"
                      }
                    }
                  ]
                },
                content: {
                  type: "array",
                  items: {
                    type: "string"
                  }
                }
              }
            },
            example: {
              type: "array",
              items: {
                type: "string"
              }
            }
          }
        }
      }
    }
  }
}
```
  </TabItem>
</Tabs>
