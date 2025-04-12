import { MCPMessage } from "../../src/models/MCPMessage";
import { setupHandlers } from "../utils/setupHandlers";
import { fakeRepo } from "../utils/fakeTodoRepository";
import { MockWebSocket } from "../utils/mockWebSocket";
import { ExtendedWebSocket } from "../../src/server/WebSocketServerWrapper";
import { DescribeToolHandler, ICommandHandler } from '../../src/handlers/tool';

describe("DescribeToolHandler", () => {
  let handlers: ICommandHandler[];
  let mockWs: MockWebSocket;

  beforeEach(() => {
    handlers = setupHandlers(fakeRepo);
    mockWs = new MockWebSocket();
  });

  test("deve retornar a descrição detalhada da ferramenta TodoManager (incluindo capacidades e exemplos)", () => {
    const message: MCPMessage = {
      command: "describe-tool",
      apiKey: "SENHA_SECRETA",
      payload: {
        tool: "TodoManager",
      }
    };

    const helpToolHandler = handlers.find((h) => h.supports(message)) as DescribeToolHandler;
    helpToolHandler.handle(message, mockWs as unknown as ExtendedWebSocket);
    const response = JSON.parse(mockWs.sentMessages[0]);

    expect(response).toMatchSnapshot();
  });
});
