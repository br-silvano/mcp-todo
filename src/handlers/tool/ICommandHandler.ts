import { MCPMessage } from "../../models/MCPMessage";
import { ExtendedWebSocket } from '../../server/WebSocketServerWrapper';

export interface ICommandHandler {
  supports(message: MCPMessage): boolean;
  handle(message: MCPMessage, ws: ExtendedWebSocket): void;
}
