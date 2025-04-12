import { MCPMessage } from "../../models/MCPMessage";
import { ICommandHandler } from "../tool/ICommandHandler";
import { TodoService } from '../../services/TodoService';
import { ExtendedWebSocket } from '../../server/WebSocketServerWrapper';

export class DeleteTodoHandler implements ICommandHandler {
  constructor(
    private readonly todoService: TodoService
  ) { }

  public supports(message: MCPMessage): boolean {
    return message.command === "delete-todo";
  }

  public handle(message: MCPMessage, ws: ExtendedWebSocket): void {
    try {
      const deleted = this.todoService.deleteTodo(message.payload);
      if (deleted) {
        ws.send(JSON.stringify({ message: "Todo deletado com sucesso." }));
      } else {
        ws.send(JSON.stringify({ error: "Todo não encontrado para deletar." }));
      }
    } catch (err: any) {
      ws.send(JSON.stringify({ error: err.message }));
    }
  }
}
