import { MCPMessage } from "../../src/models/MCPMessage";
import { MockWebSocket } from "../utils/mockWebSocket";
import { ExtendedWebSocket } from "../../src/server/WebSocketServerWrapper";
import { EchoHandler } from '../../src/handlers/tool';

describe("EchoHandler", () => {
  let echoHandler: EchoHandler;
  let mockWs: MockWebSocket;

  beforeEach(() => {
    echoHandler = new EchoHandler();
    mockWs = new MockWebSocket();
  });

  test("deve suportar comando echo", () => {
    const message: MCPMessage = {
      command: "echo",
      apiKey: "SENHA_SECRETA"
    };
    expect(echoHandler.supports(message)).toBe(true);
  });

  test("deve retornar o mesmo payload enviado", () => {
    const payload = "Teste WebSocket";
    const message: MCPMessage = {
      command: "echo",
      apiKey: "SENHA_SECRETA",
      payload,
    };
    echoHandler.handle(message, mockWs as unknown as ExtendedWebSocket);
    const response = JSON.parse(mockWs.sentMessages[0]);

    expect(response).toEqual({
      command: "echo",
      payload,
    });
  });
});
