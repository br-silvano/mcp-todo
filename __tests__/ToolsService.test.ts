import { buildToolRegistry } from '../src/tools/toolsConfig';
import { ToolsService } from "../src/services/ToolsService";

describe("ToolsService", () => {
  let toolsService: ToolsService;
  beforeEach(() => {
    const toolRegistry = buildToolRegistry();
    toolsService = new ToolsService(toolRegistry);
  });

  test("deve retornar a lista de ferramentas disponíveis", () => {
    const tools = toolsService.getAvailableTools();
    expect(tools).toEqual([
      {
        name: "TodoManager",
        description: "Gerencia tarefas com operações de CRUD completo.",
        capabilities: expect.arrayContaining([
          expect.objectContaining({
            name: 'create-todo',
            command: 'create-todo',
            description: expect.any(String),
            input_schema: expect.any(Object),
            output_schema: expect.any(Object)
          })
        ]),
        examples: expect.any(Object)
      }
    ]);
  });
});
