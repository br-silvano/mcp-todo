## 1. Diagrama de Componentes

Este diagrama geral destaca a separação de responsabilidades e as interações principais entre os módulos do sistema, considerando as novas pastas e arquivos.

```plantuml
@startuml
!define RECTANGLE class
skinparam componentStyle rectangle

title "Diagrama de Componentes"

package "src" {
  [Config] as Config
  [Models] as Models
  [Services] as Services
  [Handlers] as Handlers
  [Processor] as Processor
  [Server] as Server
  [Repositories] as Repositories
  [Utils] as Utils

  ' Configurações e comunicação com o servidor
  Config --> Server : Configurações (porta, variáveis de ambiente)

  ' Modelos disponíveis para os serviços
  Models --> Services : Tipos e interfaces

  ' Serviços de negócio
  Services --> AuthenticationService : Autenticação
  Services --> ToolsService : Gerenciamento de ferramentas
  Services --> TodoService : Operações de TODOs

  ' Handlers acionam os serviços necessários
  Handlers --> ToolsService : Consulta e execução de ferramentas
  Handlers --> TodoService : Operações CRUD de TODOs

  ' Roteamento e processamento das mensagens MCP
  Processor --> Handlers : Encaminha comandos MCP

  ' Comunicação do servidor com o processador e interface administrativa
  Server--> AuthenticationService : Validação de API key
  Server --> Processor : Encaminha mensagens recebidas
  Server --> "STDIO Interface" : Comandos Administrativos

  ' Repositório para persistência dos dados de TODOs
  Repositories --> TodoService : Acesso e manipulação dos dados
}
@enduml
```

> **Explicação:**
>
> - **Config:** Centraliza as configurações do sistema, como variáveis de ambiente e conexões (por exemplo, com o banco de dados via _db.ts_).
> - **Models:** Define os tipos e interfaces essenciais para a aplicação, como `MCPMessage` e `Tool`.
> - **Services:** Contém a lógica de negócio, agora incluindo o **TodoService** para operações relacionadas aos TODOs, além dos serviços de autenticação e ferramentas.
> - **Handlers:** Responsáveis por interpretar e processar cada comando, com diretórios específicos para _todo_ e _tool_.
> - **Processor:** Roteia as mensagens MCP para os handlers correspondentes.
> - **Server:** Implementa os servidores (WebSocket e STDIO) que fazem a interface com o usuário.
> - **Repositories:** Gerencia a persistência dos dados, como o repositório de TODOs.
> - **Utils:** Fornece funções auxiliares, como logging e utilitários de autenticação.

---

## 2. Diagrama de Componentes – Arquitetura Modular Detalhada

Este diagrama detalha a modularidade e a comunicação interna, evidenciando a aplicação dos princípios de SOLID e Clean Code. São destacados os principais serviços, handlers específicos e a comunicação com o processador e o servidor.

```plantuml
@startuml
title "Diagrama de Componentes – Arquitetura Modular Detalhada"

package "Módulos do Sistema" {
  [Config] <<Configuration>>
  [Models] <<Data Types>>

  [AuthenticationService] <<Service>>
  [ToolsService] <<Service>>
  [TodoService] <<Service>>

  ' Handlers para o domínio TODO
  [CreateTodoHandler] <<Handler>>
  [DeleteTodoHandler] <<Handler>>
  [GetAllTodosHandler] <<Handler>>
  [GetTodoByIdHandler] <<Handler>>
  [UpdateTodoHandler] <<Handler>>

  ' Handlers para o domínio de ferramentas
  [ListToolsHandler] <<Handler>>
  [UseToolHandler] <<Handler>>
  [EchoHandler] <<Handler>>

  [MCPMessageProcessor] <<Processor>>
  [WebSocketServerWrapper] <<Server>>
  [MCPServer] <<Server>>
  [STDIO Interface] <<User Interface>>

  [TodoRepository] <<Repository>>
  [Utils] <<Utility>>

  ' Configuração e comunicação do servidor
  Config --> MCPServer

  ' Modelos influenciam os serviços
  Models --> AuthenticationService
  Models --> ToolsService
  Models --> TodoService

  ' Serviços e seus consumidores
  AuthenticationService --> WebSocketServerWrapper
  ToolsService --> ListToolsHandler
  TodoService --> CreateTodoHandler
  TodoService --> DeleteTodoHandler
  TodoService --> GetAllTodosHandler
  TodoService --> GetTodoByIdHandler
  TodoService --> UpdateTodoHandler

  ' Handlers encaminham mensagens para o processador
  CreateTodoHandler --> MCPMessageProcessor
  DeleteTodoHandler --> MCPMessageProcessor
  GetAllTodosHandler --> MCPMessageProcessor
  GetTodoByIdHandler --> MCPMessageProcessor
  UpdateTodoHandler --> MCPMessageProcessor
  ListToolsHandler --> MCPMessageProcessor
  UseToolHandler --> MCPMessageProcessor
  EchoHandler --> MCPMessageProcessor

  ' Processador direciona para o servidor de comunicação
  MCPMessageProcessor --> WebSocketServerWrapper
  WebSocketServerWrapper --> MCPServer
  MCPServer --> "STDIO Interface"

  ' Acesso ao repositório pelos serviços de TODOs
  TodoRepository --> TodoService

  ' Utilitários em suporte ao sistema
  Utils ..> MCPServer
}
@enduml
```

![alt](./images/Components.png)

> **Explicação:**
>
> - **Serviços:** Além dos serviços de autenticação e de ferramentas, agora temos o **TodoService** que lida com as operações CRUD dos TODOs, utilizando o **TodoRepository** para persistência.
> - **Handlers:** O domínio de TODO possui handlers específicos (criação, atualização, consulta e exclusão) enquanto os de ferramentas englobam os comandos para listar, usar e executar um echo.
> - **Processador & Servidor:** O **MCPMessageProcessor** atua como intermediário, direcionando as mensagens para os handlers corretos, e o fluxo segue para a comunicação via WebSocket e interface STDIO.
> - **Utilitários e Configurações:** São responsáveis por aspectos complementares, garantindo modularidade e coesão na aplicação.
