import { MCPMessage } from "../../models/MCPMessage";
import { ICommandHandler } from "../tool/ICommandHandler";
import { TodoService } from '../../services/TodoService';
import { ExtendedWebSocket } from '../../server/WebSocketServerWrapper';

export class UpdateTodoHandler implements ICommandHandler {
  constructor(
    private readonly todoService: TodoService
  ) { }

  public supports(message: MCPMessage): boolean {
    return message.command === "update-todo";
  }

  public handle(message: MCPMessage, ws: ExtendedWebSocket): void {
    try {
      const updated = this.todoService.updateTodo(message.payload);
      if (updated) {
        ws.send(JSON.stringify({ message: "Todo atualizado com sucesso.", result: updated }));
      } else {
        ws.send(JSON.stringify({ error: "Todo não encontrado para atualização." }));
      }
    } catch (err: any) {
      ws.send(JSON.stringify({ error: err.message }));
    }
  }
}
