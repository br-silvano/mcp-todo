import { MCPMessage } from "../../models/MCPMessage";
import { ICommandHandler } from "../tool/ICommandHandler";
import { TodoService } from '../../services/TodoService';
import { ExtendedWebSocket } from '../../server/WebSocketServerWrapper';

export class GetAllTodosHandler implements ICommandHandler {
  constructor(
    private readonly todoService: TodoService
  ) { }

  public supports(message: MCPMessage): boolean {
    return message.command === "get-all-todos";
  }

  public handle(_: MCPMessage, ws: ExtendedWebSocket): void {
    try {
      const todos = this.todoService.getAllTodos();
      ws.send(JSON.stringify({ result: todos }));
    } catch (err: any) {
      ws.send(JSON.stringify({ error: err.message }));
    }
  }
}
