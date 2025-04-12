import { join } from 'path';

import { MCPMessageProcessor } from "./processor/MCPMessageProcessor";
import { TodoRepository } from './repositories/TodoRepository';
import { MCPServer } from "./server/MCPServer";
import { WebSocketServerWrapper } from "./server/WebSocketServerWrapper";
import { AuthenticationService } from "./services/AuthenticationService";
import { TodoService } from './services/TodoService';
import { ToolsService } from "./services/ToolsService";
import { DbConnection } from './config/db';
import { buildToolRegistry } from './tools/toolsConfig';
import { buildHandlers } from './handlers';
import { env } from './config/env'

const VALID_API_KEY = env.API_KEY;

const authenticationService = new AuthenticationService(VALID_API_KEY);

const dbPath = join(__dirname, 'todos.db');
const dbConnection = new DbConnection(dbPath);

const todoRepository = new TodoRepository(dbConnection.connection);
const todoService = new TodoService(todoRepository);

const toolRegistry = buildToolRegistry();
const toolsService = new ToolsService(toolRegistry);

const handlers = buildHandlers(toolsService, todoService, toolRegistry);
const messageProcessor = new MCPMessageProcessor(handlers);

const PORT: number = parseInt(env.PORT);

const webSocketServer = new WebSocketServerWrapper(PORT, messageProcessor, authenticationService);

const mcpServer = new MCPServer(webSocketServer);

mcpServer.startStdioInterface();
