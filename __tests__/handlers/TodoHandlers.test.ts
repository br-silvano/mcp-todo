import { MCPMessage } from "../../src/models/MCPMessage";
import { setupHandlers } from "../utils/setupHandlers";
import { fakeRepo } from "../utils/fakeTodoRepository";
import { MockWebSocket } from "../utils/mockWebSocket";
import { ExtendedWebSocket } from "../../src/server/WebSocketServerWrapper";
import { ICommandHandler } from '../../src/handlers/tool';
import { CreateTodoHandler, DeleteTodoHandler, GetAllTodosHandler, GetTodoByIdHandler, UpdateTodoHandler } from '../../src/handlers/todo';

describe("TodoHandlers", () => {
  let handlers: ICommandHandler[];
  let mockWs: MockWebSocket;

  beforeEach(() => {
    handlers = setupHandlers(fakeRepo);
    mockWs = new MockWebSocket();
  });

  test("deve criar um TODO com o command create-todo", async () => {
    const message: MCPMessage = {
      command: "create-todo",
      apiKey: "SENHA_SECRETA",
      payload: {
        title: "Testar ferramenta",
        completed: false,
      }
    };

    const useToolHandler = handlers.find((h) => h.supports(message)) as CreateTodoHandler;
    useToolHandler.handle(message, mockWs as unknown as ExtendedWebSocket);
    const resposta = JSON.parse(mockWs.sentMessages[0]);

    expect(resposta).toHaveProperty("result");
    expect(resposta.result).toHaveProperty("id");
    expect(resposta.result.title).toBe("Testar ferramenta");
    expect(resposta.result.completed).toBe(false);
  });

  test("deve listar todos os TODOs com o command get-all-todos", async () => {
    const message: MCPMessage = {
      command: "get-all-todos",
      apiKey: "SENHA_SECRETA",
      payload: {}
    };

    const useToolHandler = handlers.find((h) => h.supports(message)) as GetAllTodosHandler;
    useToolHandler.handle(message, mockWs as unknown as ExtendedWebSocket);
    const resposta = JSON.parse(mockWs.sentMessages[0]);

    expect(resposta).toHaveProperty("result");
    expect(Array.isArray(resposta.result)).toBe(true);

    const todo = resposta.result.find((t: any) => t.title === "Testar ferramenta");
    expect(todo).toBeDefined();
    expect(todo.completed).toBe(false);
  });

  test("deve buscar um TODO com a command get-todo-by-id", async () => {
    const message: MCPMessage = {
      command: "get-todo-by-id",
      apiKey: "SENHA_SECRETA",
      payload: {
        id: 1,
      }
    };

    const useToolHandler = handlers.find((h) => h.supports(message)) as GetTodoByIdHandler;
    useToolHandler.handle(message, mockWs as unknown as ExtendedWebSocket);
    const resposta = JSON.parse(mockWs.sentMessages[0]);

    expect(resposta).toHaveProperty("result");
    expect(resposta.result).toHaveProperty("id");
    expect(resposta.result.title).toBe("Testar ferramenta");
    expect(resposta.result.completed).toBe(false);
  });

  test("deve atualizar um TODO com o command update-todo", async () => {
    const message: MCPMessage = {
      command: "update-todo",
      apiKey: "SENHA_SECRETA",
      payload: {
        id: 1,
        title: "Estudar arquitetura hexagonal e DDD",
        completed: true
      }
    };

    const useToolHandler = handlers.find((h) => h.supports(message)) as UpdateTodoHandler;
    useToolHandler.handle(message, mockWs as unknown as ExtendedWebSocket);
    const resposta = JSON.parse(mockWs.sentMessages[0]);

    expect(resposta).toHaveProperty("result");
    expect(resposta.result).toHaveProperty("id");
    expect(resposta.result.title).toBe("Estudar arquitetura hexagonal e DDD");
    expect(resposta.result.completed).toBe(true);
  });

  test("deve deletar um TODO com o command delete-todo", async () => {
    const message: MCPMessage = {
      command: "delete-todo",
      apiKey: "SENHA_SECRETA",
      payload: {
        id: 1,
      }
    };

    const useToolHandler = handlers.find((h) => h.supports(message)) as DeleteTodoHandler;
    useToolHandler.handle(message, mockWs as unknown as ExtendedWebSocket);
    const resposta = JSON.parse(mockWs.sentMessages[0]);

    expect(resposta).toHaveProperty("message");
    expect(resposta.message).toBe("Todo deletado com sucesso.");
  });
});
