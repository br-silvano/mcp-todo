import { MCPMessage } from "../../models/MCPMessage";
import { ICommandHandler } from "../tool/ICommandHandler";
import { TodoService } from '../../services/TodoService';
import { ExtendedWebSocket } from '../../server/WebSocketServerWrapper';

export class GetTodoByIdHandler implements ICommandHandler {
  constructor(
    private readonly todoService: TodoService
  ) { }

  public supports(message: MCPMessage): boolean {
    return message.command === "get-todo-by-id";
  }

  public handle(message: MCPMessage, ws: ExtendedWebSocket): void {
    try {
      const todo = this.todoService.getTodoById(message.payload);
      if (todo) {
        ws.send(JSON.stringify({ result: todo }));
      } else {
        ws.send(JSON.stringify({ error: "Todo não encontrado." }));
      }
    } catch (err: any) {
      ws.send(JSON.stringify({ error: err.message }));
    }
  }
}
