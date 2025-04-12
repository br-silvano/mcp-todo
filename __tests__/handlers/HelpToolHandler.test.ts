import { MCPMessage } from "../../src/models/MCPMessage";
import { setupHandlers } from "../utils/setupHandlers";
import { fakeRepo } from "../utils/fakeTodoRepository";
import { MockWebSocket } from "../utils/mockWebSocket";
import { ExtendedWebSocket } from "../../src/server/WebSocketServerWrapper";
import { HelpToolHandler, ICommandHandler } from '../../src/handlers/tool';

describe("HelpToolHandler", () => {
  let handlers: ICommandHandler[];
  let mockWs: MockWebSocket;

  beforeEach(() => {
    handlers = setupHandlers(fakeRepo);
    mockWs = new MockWebSocket();
  });

  test("deve retornar os detalhes (capabilities, descrições e exemplos) da ferramenta TodoManager", () => {
    const message: MCPMessage = {
      command: "help-tool",
      apiKey: "SENHA_SECRETA",
      payload: {
        tool: "TodoManager",
      }
    };

    const helpToolHandler = handlers.find((h) => h.supports(message)) as HelpToolHandler;
    helpToolHandler.handle(message, mockWs as unknown as ExtendedWebSocket);
    const response = JSON.parse(mockWs.sentMessages[0]);

    expect(response).toMatchSnapshot();
  });
});
