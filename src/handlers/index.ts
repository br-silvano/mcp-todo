import {
  ICommandHandler,
  EchoHandler,
  HelpToolHandler,
  ListToolsHandler,
  DescribeToolHandler,
  UseToolHandler
} from './tool';

import {
  CreateTodoHandler,
  GetAllTodosHandler,
  GetTodoByIdHandler,
  UpdateTodoHandler,
  DeleteTodoHandler
} from './todo';

import { ToolsService } from '../services/ToolsService';
import { TodoService } from '../services/TodoService';
import { ToolRegistry } from '../tools/ToolRegistry';

export const buildHandlers = (
  toolsService: ToolsService,
  todoService: TodoService,
  toolRegistry: ToolRegistry
): ICommandHandler[] => [
    new EchoHandler(),
    new HelpToolHandler(toolsService),
    new ListToolsHandler(toolsService),
    new DescribeToolHandler(toolRegistry),
    new UseToolHandler(toolRegistry, todoService),
    new CreateTodoHandler(todoService),
    new GetAllTodosHandler(todoService),
    new GetTodoByIdHandler(todoService),
    new UpdateTodoHandler(todoService),
    new DeleteTodoHandler(todoService)
  ];
