import { MCPMessage } from "../../models/MCPMessage";
import { ICommandHandler } from "./ICommandHandler";
import { ExtendedWebSocket } from '../../server/WebSocketServerWrapper';

export class EchoHandler implements ICommandHandler {
  public supports(message: MCPMessage): boolean {
    return message.command === "echo";
  }

  public handle(message: MCPMessage, ws: ExtendedWebSocket): void {
    ws.send(JSON.stringify({
      command: "echo",
      payload: message.payload
    }));
  }
}
