import { ToolsService } from "../../services/ToolsService";
import { ICommandHandler } from "./ICommandHandler";
import { MCPMessage } from "../../models/MCPMessage";
import { ExtendedWebSocket } from '../../server/WebSocketServerWrapper';
import logger from "../../utils/logger";

export class ListToolsHandler implements ICommandHandler {
  constructor(private readonly toolsService: ToolsService) {}

  public supports(message: MCPMessage): boolean {
    return message.command === "list-tools";
  }

  public handle(message: MCPMessage, ws: ExtendedWebSocket): void {
    logger.info("Mensagem recebida:", message);
    const tools = this.toolsService.getAvailableTools();
    ws.send(JSON.stringify({ tools }));
  }
}
