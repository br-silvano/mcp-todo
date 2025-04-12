import * as Ajv from "ajv";

import { ICommandHandler } from "./ICommandHandler";
import { MCPMessage } from "../../models/MCPMessage";
import { ToolRegistry } from "../../tools/ToolRegistry";
import { TodoService } from "../../services/TodoService";
import { ExtendedWebSocket } from '../../server/WebSocketServerWrapper';

const ajv = new Ajv.Ajv();

export class UseToolHandler implements ICommandHandler {
  constructor(
    private readonly toolRegistry: ToolRegistry,
    private readonly todoService: TodoService
  ) { }

  public supports(message: MCPMessage): boolean {
    return message.command === "use-tool";
  }

  private send(ws: ExtendedWebSocket, payload: any): void {
    ws.send(JSON.stringify(payload));
  }

  private readonly validators = new Map<string, Ajv.ValidateFunction>();

  private getValidator(schema: any, key: string): Ajv.ValidateFunction {
    if (!this.validators.has(key)) {
      this.validators.set(key, ajv.compile(schema));
    }
    return this.validators.get(key)!;
  }

  public handle(message: MCPMessage, ws: ExtendedWebSocket): void {
    const payload = message.payload;

    // Checa se 'tool' e 'capability' foram informados
    if (!payload?.tool || !payload?.capability) {
      ws.send(JSON.stringify({ error: "Parâmetros 'tool' e 'capability' são obrigatórios." }));
      return;
    }

    // Procura a ferramenta pela qual o comando foi direcionado
    const tool = this.toolRegistry.findByName(payload.tool);
    if (!tool) {
      ws.send(JSON.stringify({ error: `Ferramenta '${payload.tool}' não encontrada.` }));
      return;
    }

    // Procura a capability dentro da ferramenta
    const capability = tool.capabilities?.find(c => c.name === payload.capability);
    if (!capability) {
      ws.send(JSON.stringify({ error: `Capability '${payload.capability}' não encontrada em '${payload.tool}'.` }));
      return;
    }

    // Validação do input usando Ajv, com base no schema definido na capability
    if (!capability.input_schema || typeof capability.input_schema !== 'object') {
      this.send(ws, { error: `Schema de input inválido para a capability '${payload.capability}'` });
      return;
    }

    const validate = this.getValidator(capability.input_schema, `${payload.tool}.${payload.capability}`);
    if (!validate(payload.input)) {
      ws.send(JSON.stringify({ error: "Input inválido", details: validate.errors }));
      return;
    }

    // Execução do comando com base na capability definida
    try {
      const commandMap: Record<string, (input: any) => any> = {
        "create-todo": (input: any) => this.todoService.createTodo(input),
        "get-all-todos": () => this.todoService.getAllTodos(),
        "get-todo-by-id": (input: any) => this.todoService.getTodoById(input),
        "update-todo": (input: any) => this.todoService.updateTodo(input),
        "delete-todo": (input: any) => {
          this.todoService.deleteTodo(input);
          return { message: "Tarefa removida com sucesso." };
        }
      };

      const commandFn = commandMap[capability.command];
      if (!commandFn) {
        this.send(ws, { error: `Comando '${capability.command}' não implementado.` });
        return;
      }

      const result = commandFn(payload.input);
      this.send(ws, { tool: payload.tool, capability: payload.capability, result });
    } catch (err: any) {
      ws.send(JSON.stringify({
        error: "Erro inesperado",
        details: err.message || String(err),
      }));
    }
  }
}
