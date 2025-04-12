import { MCPMessage } from "../../models/MCPMessage";
import { ICommandHandler } from "./ICommandHandler";
import { ToolsService } from "../../services/ToolsService";
import { ExtendedWebSocket } from '../../server/WebSocketServerWrapper';

export class HelpToolHandler implements ICommandHandler {
  constructor(private readonly toolsService: ToolsService) { }

  public supports(message: MCPMessage): boolean {
    return message.command === "help-tool";
  }

  public handle(message: MCPMessage, ws: ExtendedWebSocket): void {
    const toolName = message.payload?.tool;

    if (!toolName) {
      ws.send(JSON.stringify({ error: "Nome da ferramenta não informado." }));
      return;
    }

    const tool = this.toolsService.getAvailableTools().find((t: any) => t.name === toolName);

    if (!tool) {
      ws.send(JSON.stringify({ error: `Ferramenta '${toolName}' não encontrada.` }));
      return;
    }

    ws.send(JSON.stringify({
      response: `Capacidades da ferramenta '${tool.name}':`,
      description: tool.description,
      capabilities: tool.capabilities ?? ["(sem capacidades registradas)"],
      examples: tool.examples ?? {}
    }));
  }
}
