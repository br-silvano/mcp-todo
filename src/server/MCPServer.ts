import * as readline from "readline";

import logger from "../utils/logger";
import { WebSocketServerWrapper } from "./WebSocketServerWrapper";

export class MCPServer {
  private readonly rl: readline.Interface;

  constructor(private readonly webSocketServer: WebSocketServerWrapper) {
    this.webSocketServer.initialize();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  public startStdioInterface(): void {
    logger.info("✅ Interface STDIO iniciada. Digite comandos (ex: status, sair):");

    this.rl.on("line", (input: string) => {
      const command = input.trim().toLowerCase();
      logger.info(`📥 Comando recebido via STDIO: ${command}`);
      this.handleCommand(command);
    });
  }

  private handleCommand(command: string): void {
    switch (command) {
      case "status":
        this.showStatus();
        break;
      case "sair":
        this.shutdown();
        break;
      default:
        logger.warn(`⚠️ Comando não reconhecido: ${command}`);
        break;
    }
  }

  private showStatus(): void {
    logger.info("🟢 Servidor WebSocket está rodando normalmente.");
  }

  private shutdown(): void {
    logger.info("🛑 Encerrando aplicação...");
    this.rl.close();
    process.exit(0);
  }
}
