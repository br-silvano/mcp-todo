import * as readline from "readline";

import logger from "../utils/logger";
import { WebSocketServerWrapper } from "./WebSocketServerWrapper";

export class MCPServer {
  private readonly rl: readline.Interface;

  constructor(private readonly webSocketServer: WebSocketServerWrapper) {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  start(): void {
    try {
      this.webSocketServer.initialize();
      this.startStdioInterface();
    } catch (error) {
      logger.error("Erro ao iniciar o servidor:", error);
      process.exit(1);
    }
  }

  private startStdioInterface(): void {
    logger.info("✅ Interface STDIO iniciada. Digite comandos (ex: status, sair):");

    this.rl.on("line", (input: string) => {
      const command = input.trim().toLowerCase();
      logger.info(`📥 Comando recebido via STDIO: ${command}`);
      this.handleCommand(command);
    });
  }

  private commandHandlers: { [key: string]: () => void } = {
    status: this.showStatus.bind(this),
    sair: this.shutdown.bind(this),
  };

  private handleCommand(command: string): void {
    const handler = this.commandHandlers[command];
    if (handler) {
      handler();
    } else {
      logger.warn(`⚠️ Comando não reconhecido: ${command}`);
    }
  }

  private showStatus(): void {
    logger.info("🟢 Servidor WebSocket está rodando normalmente.");
  }

  private shutdown(): void {
    logger.info("🛑 Encerrando aplicação...");
    this.rl.close();
    this.webSocketServer.shutdown();
    process.exit(0);
  }
}
