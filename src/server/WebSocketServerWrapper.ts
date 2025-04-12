import { Socket } from 'net';
import { WebSocket, WebSocketServer } from 'ws';

import { MCPMessage } from "../models/MCPMessage";
import { MCPMessageProcessor } from "../processor/MCPMessageProcessor";
import { AuthenticationService } from '../services/AuthenticationService';
import { checkAuthentication } from "../utils/authUtil";
import logger from "../utils/logger";

// Interface estendida para controle de heartbeat
export interface ExtendedWebSocket extends WebSocket {
  _socket: Socket;
  isAlive: boolean;
}

export class WebSocketServerWrapper {
  private readonly wss: WebSocketServer;
  private readonly messageProcessor: MCPMessageProcessor;
  private readonly authService: AuthenticationService;

  private readonly connectionTimeout = 5 * 60 * 1000; // 5 minutos
  private readonly heartbeatInterval = 30 * 1000; // 30 segundos
  private heartbeatIntervalId?: NodeJS.Timeout;
  private readonly blockedIps: Set<string>;

  constructor(
    port: number,
    messageProcessor: MCPMessageProcessor,
    authService: AuthenticationService,
    blockedIps: string[] = []
  ) {
    this.wss = new WebSocketServer({ port });
    this.messageProcessor = messageProcessor;
    this.authService = authService;
    this.blockedIps = new Set(blockedIps ?? []);
  }

  initialize(): void {
    logger.info("🧠 Inicializando o servidor WebSocket...");
    this.setupServer();
    this.startHeartbeat();
  }

  shutdown(): void {
    logger.info("🔌 Encerrando WebSocketServer...");

    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "shutdown", reason: "Servidor encerrando." }));
      }
      client.terminate();
    });

    if (this.heartbeatIntervalId) {
      clearInterval(this.heartbeatIntervalId);
      logger.debug("🫀 Intervalo de heartbeat finalizado.");
    }

    this.wss.close((err) => {
      if (err) {
        logger.error("Erro ao encerrar o servidor WebSocket:", err);
      } else {
        logger.info("✅ Servidor WebSocket encerrado com sucesso.");
      }
    });
  }

  private setupServer(): void {
    this.wss.on('connection', (ws: ExtendedWebSocket, request) => {
      const rawIp = request.socket.remoteAddress;
      const ip = rawIp?.replace('::ffff:', '');

      if (ip && this.blockedIps.has(ip)) {
        logger.warn(`🚫 Conexão rejeitada: IP bloqueado ${ip}`);
        ws.close(1008, '🚫 Acesso não autorizado por IP');
        return;
      }

      const connectionsFromIp = [...this.wss.clients].filter(
        (client) =>
          (client as ExtendedWebSocket)._socket.remoteAddress?.replace('::ffff:', '') === ip
      );

      if (connectionsFromIp.length > 5) {
        logger.warn(`⚠️ IP ${ip} excedeu o limite de conexões simultâneas (${connectionsFromIp.length})`);
        ws.send(JSON.stringify({ error: "🔒 Limite de conexões atingido." }));
        ws.close(1013, '⚠️ Limite de conexões simultâneas excedido.');
        return;
      }

      ws.isAlive = true;
      ws.on('pong', () => {
        ws.isAlive = true;
        logger.debug(`🏓 Pong recebido de ${ip}`);
      });

      logger.info(`✅ Novo cliente conectado: ${ip}`);
      this.handleConnection(ws);
    });

    this.wss.on('listening', () => {
      logger.info(`🚀 Servidor escutando na porta ${this.wss.options.port}`);
    });

    this.wss.on('error', (error) => {
      logger.error('❌ Erro no WebSocketServer:', error);
    });
  }

  private startHeartbeat(): void {
    this.heartbeatIntervalId = setInterval(() => {
      logger.debug('🫀 Executando heartbeat...');

      this.wss.clients.forEach((client) => {
        const ws = client as ExtendedWebSocket;
        const rawIp = ws._socket.remoteAddress;
        const ip = rawIp?.replace('::ffff:', '');

        if (!ws.isAlive) {
          logger.info('⛔ Cliente inativo será encerrado.');
          return ws.terminate();
        }

        ws.isAlive = false;

        logger.debug(`🔄 Enviando ping para o cliente ${ip}`);
        ws.ping(undefined, false, (err) => {
          if (err) {
            logger.warn(`Erro ao enviar ping para ${ip}:`, err);
          } else {
            logger.debug(`Ping enviado para ${ip}`);
          }
        });
      });
    }, this.heartbeatInterval);
  }

  private handleConnection(ws: ExtendedWebSocket): void {
    const connectionStart = Date.now();
    logger.info(`📡 Conexão iniciada em ${new Date(connectionStart).toISOString()}`);

    const timeoutId = setTimeout(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close(1000, 'Conexão encerrada por timeout.');
        logger.info('⏱️ Conexão encerrada após 5 minutos.');
      }
    }, this.connectionTimeout);

    ws.on('message', (data: string) => this.handleMessage(ws, data));

    ws.on('close', (code, reason) => {
      const decodedReason = reason.toString() || '[sem motivo]';
      logger.info(`🔌 Conexão encerrada (code: ${code}, reason: ${decodedReason})`);
      clearTimeout(timeoutId);
    });

    ws.on('error', (error) => {
      logger.error('💥 Erro na conexão com cliente:', error);
      clearTimeout(timeoutId);
    });
  }

  private handleMessage(ws: ExtendedWebSocket, data: string): void {
    logger.info(`📨 Mensagem recebida: ${data}`);

    if (ws.readyState !== WebSocket.OPEN) {
      logger.warn('⚠️ Mensagem recebida com conexão fechada.');
      return;
    }

    let message: MCPMessage;
    try {
      message = JSON.parse(data);
    } catch (error) {
      logger.error('📛 JSON malformado:', error);
      return ws.send(JSON.stringify({ error: "Formato de mensagem inválido." }));
    }

    if (!checkAuthentication(message, this.authService)) {
      logger.warn('🔐 Autenticação falhou: chave de API inválida.');
      return ws.send(JSON.stringify({ error: "Chave de API inválida ou ausente." }));
    }

    logger.debug('🔑 Autenticado com sucesso.');
    try {
      this.messageProcessor.processMessage(message, ws);
      logger.debug('✅ Mensagem processada com sucesso.');
    } catch (error) {
      logger.error('⚙️ Erro no processamento da mensagem:', error);
    }
  }
}
