import { buildToolRegistry } from '../../src/tools/toolsConfig';
import { buildHandlers } from '../../src/handlers';
import { ToolsService } from '../../src/services/ToolsService';
import { TodoService } from '../../src/services/TodoService';
import { TodoRepository } from '../../src/repositories/TodoRepository';
import { ICommandHandler } from '../../src/handlers/tool';

export function setupHandlers(fakeRepo: TodoRepository): ICommandHandler[] {
  const todoService = new TodoService(fakeRepo);
  const toolRegistry = buildToolRegistry();
  const toolsService = new ToolsService(toolRegistry);
  return buildHandlers(toolsService, todoService, toolRegistry);
}
