export type JSONSchema =
  | {
    type: "object";
    properties: Record<string, JSONSchema>;
    required?: string[];
  }
  | {
    type: "array";
    items: JSONSchema;
  }
  | {
    type: "string" | "number" | "integer" | "boolean";
  };

type ToolExample = {
  request: string;
  response: string;
};

export interface ToolCapability {
  name: string;
  description: string;
  command: string;
  input_schema: JSONSchema;
  output_schema?: JSONSchema;
}

export interface Tool {
  name: string;
  description: string;
  capabilities: ToolCapability[];
  examples?: Record<string, ToolExample>;
}
