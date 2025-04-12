import { Tool } from "../models/Tool";

export class ToolRegistry {
  private readonly tools: Tool[] = [];

  register(tool: Tool) {
    this.tools.push(tool);
  }

  list(): Tool[] {
    return this.tools;
  }

  findByName(name: string): Tool | undefined {
    return this.tools.find(t => t.name === name);
  }
}
