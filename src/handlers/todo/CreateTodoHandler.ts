import { MCPMessage } from "../../models/MCPMessage";
import { ICommandHandler } from "../tool/ICommandHandler";
import { TodoService } from '../../services/TodoService';
import { ExtendedWebSocket } from '../../server/WebSocketServerWrapper';

export class CreateTodoHandler implements ICommandHandler {
  constructor(
    private readonly todoService: TodoService
  ) { }

  public supports(message: MCPMessage): boolean {
    return message.command === "create-todo";
  }

  public handle(message: MCPMessage, ws: ExtendedWebSocket): void {
    const payload = message.payload;

    try {
      const result = this.todoService.createTodo(payload);
      ws.send(JSON.stringify({ message: "Todo criado com sucesso.", result }));
    } catch (err: any) {
      ws.send(JSON.stringify({ error: err.message }));
    }
  }
}
