import { ICommandHandler } from "../handlers/tool";
import { MCPMessage } from "../models/MCPMessage";
import { ExtendedWebSocket } from '../server/WebSocketServerWrapper';

export class MCPMessageProcessor {
  private readonly handlers: ICommandHandler[];

  constructor(handlers: ICommandHandler[]) {
    this.handlers = handlers;
  }

  public processMessage(message: MCPMessage, ws: ExtendedWebSocket): void {
    const handler = this.handlers.find((h) => h.supports(message));
    if (handler) {
      handler.handle(message, ws);
    } else {
      ws.send(JSON.stringify({ error: "Comando desconhecido." }));
    }
  }
}
