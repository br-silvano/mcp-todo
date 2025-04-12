import { MCPMessage } from "../src/models/MCPMessage";
import { MCPMessageProcessor } from "../src/processor/MCPMessageProcessor";
import { ExtendedWebSocket } from '../src/server/WebSocketServerWrapper';
import { MockWebSocket } from "./utils/mockWebSocket";
import { ICommandHandler } from '../src/handlers/tool';
import { setupHandlers } from './utils/setupHandlers';
import { fakeRepo } from './utils/fakeTodoRepository';

describe("MCPMessageProcessor", () => {
  let handlers: ICommandHandler[];
  let messageProcessor: MCPMessageProcessor;
  let mockWs: MockWebSocket;

  beforeEach(() => {
    handlers = setupHandlers(fakeRepo);
    messageProcessor = new MCPMessageProcessor(handlers);
    mockWs = new MockWebSocket();
  });

  test("deve processar comando list-tools corretamente", () => {
    const message: MCPMessage = {
      command: "list-tools",
      apiKey: "SENHA_SECRETA"
    };
    messageProcessor.processMessage(message, mockWs as unknown as ExtendedWebSocket);
    const resposta = JSON.parse(mockWs.sentMessages[0]);
    expect(resposta).toHaveProperty("tools");
  });

  test("deve processar comando echo corretamente", () => {
    const payload = "eco teste";
    const message: MCPMessage = {
      command: "echo",
      apiKey: "SENHA_SECRETA",
      payload
    };
    messageProcessor.processMessage(message, mockWs as unknown as ExtendedWebSocket);
    const resposta = JSON.parse(mockWs.sentMessages[0]);
    expect(resposta).toEqual({
      command: "echo",
      payload,
    });
  });

  test("deve responder com erro para comando desconhecido", () => {
    const message: MCPMessage = {
      command: "comando-inexistente",
      apiKey: "SENHA_SECRETA"
    };
    messageProcessor.processMessage(message, mockWs as unknown as ExtendedWebSocket);
    const resposta = JSON.parse(mockWs.sentMessages[0]);
    expect(resposta.error).toBe("Comando desconhecido.");
  });
});
