import { ICommandHandler } from "./ICommandHandler";
import { MCPMessage } from "../../models/MCPMessage";
import { ToolRegistry } from "../../tools/ToolRegistry";
import { ExtendedWebSocket } from '../../server/WebSocketServerWrapper';

export class DescribeToolHandler implements ICommandHandler {
  constructor(private readonly toolRegistry: ToolRegistry) { }

  supports(message: MCPMessage): boolean {
    return message.command === "describe-tool";
  }

  handle(message: MCPMessage, ws: ExtendedWebSocket): void {
    const { tool } = message.payload || {};
    if (!tool) {
      ws.send(JSON.stringify({ error: "Parâmetro 'tool' é obrigatório." }));
      return;
    }

    const found = this.toolRegistry.findByName(tool);
    if (!found) {
      ws.send(JSON.stringify({ error: `Tool '${tool}' não encontrada.` }));
      return;
    }

    ws.send(JSON.stringify({ tool: found }));
  }
}
