import { ToolRegistry } from "../tools/ToolRegistry";
import { Tool } from "../models/Tool";

export class ToolsService {
  constructor(private readonly registry: ToolRegistry) { }

  public getAvailableTools(): Tool[] {
    return this.registry.list();
  }
}
