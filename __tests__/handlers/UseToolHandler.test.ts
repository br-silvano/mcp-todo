import { MCPMessage } from "../../src/models/MCPMessage";
import { UseToolHandler } from "../../src/handlers/tool/UseToolHandler";
import { setupHandlers } from "../utils/setupHandlers";
import { fakeRepo } from "../utils/fakeTodoRepository";
import { MockWebSocket } from "../utils/mockWebSocket";
import { ExtendedWebSocket } from "../../src/server/WebSocketServerWrapper";
import { ICommandHandler } from '../../src/handlers/tool';

describe("UseToolHandler", () => {
  let handlers: ICommandHandler[];
  let mockWs: MockWebSocket;

  beforeEach(() => {
    handlers = setupHandlers(fakeRepo);
    mockWs = new MockWebSocket();
  });

  test("deve criar um TODO com a capability create-todo", async () => {
    const message: MCPMessage = {
      command: "use-tool",
      apiKey: "SENHA_SECRETA",
      payload: {
        tool: "TodoManager",
        capability: "create-todo",
        input: {
          title: "Testar ferramenta",
          completed: false,
        }
      }
    };

    const useToolHandler = handlers.find((h) => h.supports(message)) as UseToolHandler;
    useToolHandler.handle(message, mockWs as unknown as ExtendedWebSocket);
    const resposta = JSON.parse(mockWs.sentMessages[0]);

    expect(resposta).toHaveProperty("result");
    expect(resposta.result).toHaveProperty("id");
    expect(resposta.result.title).toBe("Testar ferramenta");
    expect(resposta.result.completed).toBe(false);
  });

  test("deve listar todos os TODOs com a capability get-all-todos", async () => {
    const message: MCPMessage = {
      command: "use-tool",
      apiKey: "SENHA_SECRETA",
      payload: {
        tool: "TodoManager",
        capability: "get-all-todos",
        input: {}
      }
    };

    const useToolHandler = handlers.find((h) => h.supports(message)) as UseToolHandler;
    useToolHandler.handle(message, mockWs as unknown as ExtendedWebSocket);
    const resposta = JSON.parse(mockWs.sentMessages[0]);

    expect(resposta).toHaveProperty("result");
    expect(Array.isArray(resposta.result)).toBe(true);

    const todo = resposta.result.find((t: any) => t.title === "Testar ferramenta");
    expect(todo).toBeDefined();
    expect(todo.completed).toBe(false);
  });

  test("deve buscar um TODO com a capability get-todo-by-id", async () => {
    const message: MCPMessage = {
      command: "use-tool",
      apiKey: "SENHA_SECRETA",
      payload: {
        tool: "TodoManager",
        capability: "get-todo-by-id",
        input: {
          id: 1,
        }
      }
    };

    const useToolHandler = handlers.find((h) => h.supports(message)) as UseToolHandler;
    useToolHandler.handle(message, mockWs as unknown as ExtendedWebSocket);
    const resposta = JSON.parse(mockWs.sentMessages[0]);

    expect(resposta).toHaveProperty("result");
    expect(resposta.result).toHaveProperty("id");
    expect(resposta.result.title).toBe("Testar ferramenta");
    expect(resposta.result.completed).toBe(false);
  });

  test("deve atualizar um TODO com a capability update-todo", async () => {
    const message: MCPMessage = {
      command: "use-tool",
      apiKey: "SENHA_SECRETA",
      payload: {
        tool: "TodoManager",
        capability: "update-todo",
        input: {
          id: 1,
          title: "Estudar arquitetura hexagonal e DDD",
          completed: true
        }
      }
    };

    const useToolHandler = handlers.find((h) => h.supports(message)) as UseToolHandler;
    useToolHandler.handle(message, mockWs as unknown as ExtendedWebSocket);
    const resposta = JSON.parse(mockWs.sentMessages[0]);

    expect(resposta).toHaveProperty("result");
    expect(resposta.result).toHaveProperty("id");
    expect(resposta.result.title).toBe("Estudar arquitetura hexagonal e DDD");
    expect(resposta.result.completed).toBe(true);
  });

  test("deve deletar um TODO com a capability delete-todo", async () => {
    const message: MCPMessage = {
      command: "use-tool",
      apiKey: "SENHA_SECRETA",
      payload: {
        tool: "TodoManager",
        capability: "delete-todo",
        input: {
          id: 1,
        }
      }
    };

    const useToolHandler = handlers.find((h) => h.supports(message)) as UseToolHandler;
    useToolHandler.handle(message, mockWs as unknown as ExtendedWebSocket);
    const resposta = JSON.parse(mockWs.sentMessages[0]);

    expect(resposta).toHaveProperty("result");
    expect(resposta.result).toHaveProperty("message");
    expect(resposta.result.message).toBe("Tarefa removida com sucesso.");
  });

  test("deve retornar erro se tool ou capability não forem informados", async () => {
    const message: MCPMessage = {
      command: "use-tool",
      apiKey: "SENHA_SECRETA",
      payload: {}
    };

    const useToolHandler = handlers.find((h) => h.supports(message)) as UseToolHandler;
    useToolHandler.handle(message, mockWs as unknown as ExtendedWebSocket);

    const resposta = JSON.parse(mockWs.sentMessages[0]);
    expect(resposta).toHaveProperty("error", "Parâmetros 'tool' e 'capability' são obrigatórios.");
  });

  test("deve retornar erro se a ferramenta não for encontrada", async () => {
    const message: MCPMessage = {
      command: "use-tool",
      apiKey: "SENHA_SECRETA",
      payload: {
        tool: "FerramentaInexistente",
        capability: "create-todo",
        input: { title: "Teste", completed: false }
      }
    };

    const useToolHandler = handlers.find((h) => h.supports(message)) as UseToolHandler;
    useToolHandler.handle(message, mockWs as unknown as ExtendedWebSocket);

    const resposta = JSON.parse(mockWs.sentMessages[0]);
    expect(resposta).toHaveProperty("error", "Ferramenta 'FerramentaInexistente' não encontrada.");
  });

  test("deve retornar erro se a capability não for encontrada na ferramenta", async () => {
    const message: MCPMessage = {
      command: "use-tool",
      apiKey: "SENHA_SECRETA",
      payload: {
        tool: "TodoManager",
        capability: "inexistente-capability",
        input: {}
      }
    };

    const useToolHandler = handlers.find((h) => h.supports(message)) as UseToolHandler;
    useToolHandler.handle(message, mockWs as unknown as ExtendedWebSocket);

    const resposta = JSON.parse(mockWs.sentMessages[0]);
    expect(resposta).toHaveProperty("error", "Capability 'inexistente-capability' não encontrada em 'TodoManager'.");
  });

  test("deve retornar erro se input não for válido conforme o schema da capability", async () => {
    const message: MCPMessage = {
      command: "use-tool",
      apiKey: "SENHA_SECRETA",
      payload: {
        tool: "TodoManager",
        capability: "create-todo",
        input: { wrongField: "sem título" }
      }
    };

    const useToolHandler = handlers.find((h) => h.supports(message)) as UseToolHandler;
    useToolHandler.handle(message, mockWs as unknown as ExtendedWebSocket);

    const resposta = JSON.parse(mockWs.sentMessages[0]);
    expect(resposta).toHaveProperty("error", "Input inválido");
    expect(resposta).toHaveProperty("details");
  });

  test("deve capturar erros inesperados durante a execução do comando", async () => {
    const serviceComErro = {
      createTodo: () => { throw new Error("Erro inesperado") }
    };

    const handlersComErro = setupHandlers({ todoService: serviceComErro } as any);
    const useToolHandler = handlersComErro.find((h) => h.supports({
      command: "use-tool",
      apiKey: "SENHA_SECRETA",
      payload: {
        tool: "TodoManager",
        capability: "create-todo",
        input: {
          title: "Testar erro",
          completed: false,
        }
      }
    })) as UseToolHandler;

    const message: MCPMessage = {
      command: "use-tool",
      apiKey: "SENHA_SECRETA",
      payload: {
        tool: "TodoManager",
        capability: "create-todo",
        input: {
          title: "Testar erro",
          completed: false,
        }
      }
    };

    useToolHandler.handle(message, mockWs as unknown as ExtendedWebSocket);

    const resposta = JSON.parse(mockWs.sentMessages[0]);
    expect(resposta).toHaveProperty("error", "Erro inesperado");
    expect(resposta).toHaveProperty("details", "this.repository.create is not a function");
  });
});
