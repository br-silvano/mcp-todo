import { WebSocketServer, WebSocket } from 'ws';

import logger from "../utils/logger";
import { MCPMessage } from "../models/MCPMessage";
import { MCPMessageProcessor } from "../processor/MCPMessageProcessor";
import { AuthenticationService } from '../services/AuthenticationService';
import { checkAuthentication } from "../utils/authUtil";

// Extendemos a interface para incluir uma propriedade de controle para o heartbeat.
export interface ExtendedWebSocket extends WebSocket {
  isAlive: boolean;
}

export class WebSocketServerWrapper {
  private readonly wss: WebSocketServer;
  private readonly messageProcessor: MCPMessageProcessor;
  private readonly authService: AuthenticationService
  // Define o tempo máximo da conexão (5 minutos)
  private readonly connectionTimeout = 5 * 60 * 1000;
  // Intervalo de heartbeat (30 segundos)
  private readonly heartbeatInterval = 30000;

  constructor(
    port: number,
    messageProcessor: MCPMessageProcessor,
    authService: AuthenticationService
  ) {
    this.wss = new WebSocketServer({ port });
    this.messageProcessor = messageProcessor;
    this.authService = authService;
  }

  initialize(): void {
    logger.info('Inicializando o servidor WebSocket...');
    this.setupServer();
    this.startHeartbeat();
  }

  private setupServer(): void {
    this.wss.on('connection', (ws: ExtendedWebSocket, request) => {
      // Inicializa o estado de heartbeat para cada cliente.
      ws.isAlive = true;
      ws.on('pong', () => {
        ws.isAlive = true;
        logger.debug(`Recebido pong do cliente ${request.socket.remoteAddress}`);
      });
      logger.info(`Novo cliente conectado a partir de ${request.socket.remoteAddress}`);
      this.handleConnection(ws);
    });

    this.wss.on('listening', () => {
      logger.info(`Servidor WebSocket escutando na porta ${this.wss.options.port}`);
    });

    this.wss.on('error', (error) => {
      logger.error('Erro no servidor WebSocket:', error);
    });
  }

  // Implementa um mecanismo de heartbeat para monitorar conexões ativas.
  private startHeartbeat(): void {
    setInterval(() => {
      logger.debug('Executando heartbeat para clientes conectados...');
      this.wss.clients.forEach((ws) => {
        const extWs = ws as ExtendedWebSocket;
        if (!extWs.isAlive) {
          logger.info('Finalizando cliente sem resposta (heartbeat falho)');
          return extWs.terminate();
        }
        extWs.isAlive = false;
        extWs.ping();
        logger.debug('Ping enviado para um cliente.');
      });
    }, this.heartbeatInterval);
  }

  private handleConnection(ws: ExtendedWebSocket): void {
    const connectionTime = new Date();
    logger.info(`Conexão estabelecida em ${connectionTime.toISOString()}`);
    // Agendamento para fechamento da conexão após 5 minutos.
    const timeoutId = setTimeout(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close(1000, 'Conexão encerrada após 5 minutos.');
        logger.info('Conexão encerrada por expiração do tempo.');
      }
    }, this.connectionTimeout);

    ws.on('message', (data: string) => {
      logger.info(`Mensagem recebida em ${new Date().toISOString()}: ${data}`);
      try {
        if (ws.readyState === WebSocket.OPEN) {
          logger.debug(`Processando mensagem: ${data}`);
          let message: MCPMessage;
          try {
            message = JSON.parse(data);
          } catch (error) {
            logger.error('Erro ao fazer parsing da mensagem (formato inválido):', error);
            ws.send(JSON.stringify({ error: "Formato de mensagem inválido." }));
            return;
          }
          // Valida autenticação: verifica se o payload contém uma apiKey válida
          if (!checkAuthentication(message, this.authService)) {
            logger.warn('Falha na autenticação: Chave de API inválida ou ausente.');
            ws.send(JSON.stringify({
              error: "Chave de API inválida ou ausente."
            }));
            return;
          } else {
            logger.debug('Autenticação realizada com sucesso.');
          }
          // Processamento da mensagem pelo messageProcessor
          this.messageProcessor.processMessage(message, ws);
          logger.debug('Mensagem processada com sucesso pelo MCPMessageProcessor.');
        } else {
          logger.warn('Tentativa de processamento com conexão fechada.');
        }
      } catch (error) {
        logger.error('Erro ao processar mensagem:', error);
      }
    });

    ws.on('close', (code, reason) => {
      logger.info(`Conexão fechada (código: ${code}, motivo: ${reason.toString()})`);
      logger.info('Encerrando timeout e liberando recursos da conexão.');
      clearTimeout(timeoutId);
    });

    ws.on('error', (error) => {
      logger.error('Erro na conexão com o cliente:', error);
      clearTimeout(timeoutId);
    });
  }
}
