## 📡 Comunicação WebSocket – API MCP

> **Endpoint WebSocket:** `ws://localhost:8080/mcp`

⚠️ **Certifique-se de que o servidor esteja rodando antes de testar.**

---

### 1. 🧪 `echo` – Teste de conectividade

```javascript
const ws = new WebSocket("ws://localhost:8080/mcp");

ws.onopen = () => {
  ws.send(
    JSON.stringify({
      command: "echo",
      payload: "Teste de conectividade",
      apiKey: "SENHA_SECRETA",
    })
  );
};

ws.onmessage = (event) => {
	console.log("📥 Resposta:", JSON.parse(event.data));
	ws.close();
};

ws.onerror = (error) => console.error("❌ Erro:", error);
ws.onclose = () => console.log("🔒 Conexão encerrada.");
```

---

### 2. 🧰 `list-tools` – Lista ferramentas disponíveis

```javascript
const ws = new WebSocket("ws://localhost:8080/mcp");

ws.onopen = () =>
  ws.send(JSON.stringify({ command: "list-tools", apiKey: "SENHA_SECRETA" }));

ws.onmessage = (event) => {
	console.log("📥 Resposta:", JSON.parse(event.data));
	ws.close();
};

ws.onerror = (error) => console.error("❌ Erro:", error);
ws.onclose = () => console.log("🔒 Conexão encerrada.");
```

---

### 3. ⚙️ `use-tool` – Executa capacidades de uma ferramenta

```javascript
const ws = new WebSocket("ws://localhost:8080/mcp");
const apiKey = "SENHA_SECRETA";
let todoId = null;

ws.onopen = () => {
  ws.send(
    JSON.stringify({
      "command": "use-tool",
      "payload": {
        "tool": "TodoManager",
        "capability": "create-todo",
        "input": {
          "title": "Estudar DDD",
          "completed": false
        }
      },
      "apiKey": "123456"
    })
  );

  ws.onmessage = (event) => {
    const response = JSON.parse(event.data);
    if (response.capability === "create-todo" && response.result?.id) {
      todoId = response.result.id;
      ws.send(
        JSON.stringify({
          command: "use-tool",
          payload: { tool: "TodoManager", capability: "get-all-todos" },
          apiKey,
        })
      );
    }
  };
};

ws.close();
ws.onerror = (error) => console.error("❌ Erro:", error);
ws.onclose = () => console.log("🔒 Conexão encerrada.");
```

---

### 4. ℹ️ `help-tool` – Mostra instruções de uso da ferramenta

```javascript
const ws = new WebSocket("ws://localhost:8080/mcp");

ws.onopen = () =>
  ws.send(
    JSON.stringify({
      "command": "help-tool",
      "payload": {
        "tool": "TodoManager"
      },
      "apiKey": "123456"
    })
  );

ws.onmessage = (event) => {
	console.log("📥 Resposta:", JSON.parse(event.data));
	ws.close();
};

ws.onerror = (error) => console.error("❌ Erro:", error);
ws.onclose = () => console.log("🔒 Conexão encerrada.");
```

**Output exemplo**:
```json
{
	"response": "Capacidades da ferramenta 'TodoManager':",
	"description": "Gerencia tarefas com operações de CRUD completo.",
	"capabilities": [
		{
			"name": "create-todo",
			"command": "create-todo",
			"description": "Cria uma nova tarefa com título e descrição.",
			"input_schema": {
				"type": "object",
				"properties": {
					"title": {
						"type": "string"
					},
					"description": {
						"type": "string"
					},
					"completed": {
						"type": "boolean"
					}
				},
				"required": [
					"title"
				]
			},
			"output_schema": {
				"type": "object",
				"properties": {
					"id": {
						"type": "number"
					},
					"title": {
						"type": "string"
					},
					"description": {
						"type": "string"
					},
					"completed": {
						"type": "boolean"
					}
				},
				"required": [
					"id",
					"title",
					"description",
					"completed"
				]
			}
		},
		{
			"name": "get-todo-by-id",
			"command": "get-todo-by-id",
			"description": "Busca uma tarefa pelo ID.",
			"input_schema": {
				"type": "object",
				"properties": {
					"id": {
						"type": "integer"
					}
				},
				"required": [
					"id"
				]
			},
			"output_schema": {
				"type": "object",
				"properties": {
					"id": {
						"type": "integer"
					},
					"title": {
						"type": "string"
					},
					"description": {
						"type": "string"
					},
					"completed": {
						"type": "boolean"
					}
				},
				"required": [
					"id",
					"title",
					"description",
					"completed"
				]
			}
		},
		{
			"name": "update-todo",
			"command": "update-todo",
			"description": "Atualiza uma tarefa existente.",
			"input_schema": {
				"type": "object",
				"properties": {
					"id": {
						"type": "integer"
					},
					"title": {
						"type": "string"
					},
					"description": {
						"type": "string"
					},
					"completed": {
						"type": "boolean"
					}
				},
				"required": [
					"id"
				]
			},
			"output_schema": {
				"type": "object",
				"properties": {
					"id": {
						"type": "integer"
					},
					"title": {
						"type": "string"
					},
					"description": {
						"type": "string"
					},
					"completed": {
						"type": "boolean"
					}
				},
				"required": [
					"id",
					"title",
					"description",
					"completed"
				]
			}
		},
		{
			"name": "delete-todo",
			"command": "delete-todo",
			"description": "Remove uma tarefa pelo ID.",
			"input_schema": {
				"type": "object",
				"properties": {
					"id": {
						"type": "number"
					}
				},
				"required": [
					"id"
				]
			},
			"output_schema": {
				"type": "object",
				"properties": {
					"success": {
						"type": "boolean"
					},
					"message": {
						"type": "string"
					}
				},
				"required": [
					"success"
				]
			}
		},
		{
			"name": "get-all-todos",
			"command": "get-all-todos",
			"description": "Lista todas as tarefas registradas.",
			"input_schema": {
				"type": "object",
				"properties": {}
			},
			"output_schema": {
				"type": "array",
				"items": {
					"type": "object",
					"properties": {
						"id": {
							"type": "number"
						},
						"title": {
							"type": "string"
						},
						"description": {
							"type": "string"
						},
						"completed": {
							"type": "boolean"
						}
					},
					"required": [
						"id",
						"title",
						"description",
						"completed"
					]
				}
			}
		}
	],
	"examples": {
		"create-todo": {
			"request": "{\n  \"command\": \"create-todo\",\n  \"payload\": {\n    \"title\": \"Estudar TypeScript\",\n    \"description\": \"Praticar tipos e interfaces avançadas\",\n    \"completed\": false\n  }\n}",
			"response": "{\n  \"id\": 101,\n  \"title\": \"Estudar TypeScript\",\n  \"description\": \"Praticar tipos e interfaces avançadas\",\n  \"completed\": false\n}"
		},
		"get-todo-by-id": {
			"request": "{\n  \"command\": \"get-todo-by-id\",\n  \"payload\": {\n    \"id\": 101\n  }\n}",
			"response": "{\n  \"id\": 101,\n  \"title\": \"Estudar TypeScript\",\n  \"description\": \"Praticar tipos e interfaces avançadas\",\n  \"completed\": false\n}"
		},
		"update-todo": {
			"request": "{\n  \"command\": \"update-todo\",\n  \"payload\": {\n    \"id\": 101,\n    \"title\": \"Estudar TypeScript - Atualizado\",\n    \"description\": \"Foco em generics e utility types\",\n    \"completed\": true\n  }\n}",
			"response": "{\n  \"id\": 101,\n  \"title\": \"Estudar TypeScript - Atualizado\",\n  \"description\": \"Foco em generics e utility types\",\n  \"completed\": true\n}"
		},
		"delete-todo": {
			"request": "{\n  \"command\": \"delete-todo\",\n  \"payload\": {\n    \"id\": 101\n  }\n}",
			"response": "{\n  \"success\": true,\n  \"message\": \"Tarefa removida com sucesso.\"\n}"
		},
		"get-all-todos": {
			"request": "{\n  \"command\": \"get-all-todos\",\n  \"payload\": {}\n}",
			"response": "[\n  {\n    \"id\": 101,\n    \"title\": \"Estudar TypeScript\",\n    \"description\": \"Praticar tipos e interfaces avançadas\",\n    \"completed\": false\n  },\n  {\n    \"id\": 102,\n    \"title\": \"Ler sobre Clean Architecture\",\n    \"description\": \"Estudo do livro do Uncle Bob\",\n    \"completed\": true\n  }\n]"
		}
	}
}
```

---

### 5. 📝 `describe-tool` – Exibe metadados técnicos

```javascript
const ws = new WebSocket("ws://localhost:8080/mcp");

ws.onopen = () =>
  ws.send(
    JSON.stringify({
      command: "describe-tool",
      payload: { tool: "TodoManager" },
      apiKey: "SENHA_SECRETA",
    })
  );

ws.onmessage = (event) => {
	console.log("📥 Resposta:", JSON.parse(event.data));
	ws.close();
};

ws.onerror = (error) => console.error("❌ Erro:", error);
ws.onclose = () => console.log("🔒 Conexão encerrada.");
```

---

### 6. ✅ CRUD de TODOs – Criação, leitura, atualização e remoção de tarefas

#### 🆕 Criar TODO

```javascript
const ws = new WebSocket("ws://localhost:8080/mcp");

ws.onopen = () => {
  ws.send(
    JSON.stringify({
      command: "create-todo",
      payload: { title: "Estudar arquitetura", description: "Revisar DDD" },
      apiKey: "SENHA_SECRETA",
    })
  );
};

ws.onmessage = (event) => {
	console.log("📥 Resposta:", JSON.parse(event.data));
	ws.close();
};

ws.onerror = (error) => console.error("❌ Erro:", error);
ws.onclose = () => console.log("🔒 Conexão encerrada.");
```

#### 📄 Listar TODOs

```javascript
const ws = new WebSocket("ws://localhost:8080/mcp");

ws.onopen = () =>
  ws.send(
    JSON.stringify({
      command: "get-all-todos",
      payload: {},
      apiKey: "SENHA_SECRETA",
    })
  );

ws.onmessage = (event) => {
	console.log("📥 Resposta:", JSON.parse(event.data));
	ws.close();
};

ws.onerror = (error) => console.error("❌ Erro:", error);
ws.onclose = () => console.log("🔒 Conexão encerrada.");
```

#### 🔎 Buscar TODO por ID

```javascript
const ws = new WebSocket("ws://localhost:8080/mcp");

ws.onopen = () =>
  ws.send(
    JSON.stringify({
      command: "get-todo-by-id",
      payload: { id: 1 },
      apiKey: "SENHA_SECRETA",
    })
  );

ws.onmessage = (event) => {
	console.log("📥 Resposta:", JSON.parse(event.data));
	ws.close();
};

ws.onerror = (error) => console.error("❌ Erro:", error);
ws.onclose = () => console.log("🔒 Conexão encerrada.");
```

#### ✏️ Atualizar TODO

```javascript
const ws = new WebSocket("ws://localhost:8080/mcp");

ws.onopen = () =>
  ws.send(
    JSON.stringify({
      command: "update-todo",
      payload: { id: 1, title: "Estudar DDD", completed: true },
      apiKey: "SENHA_SECRETA",
    })
  );

ws.onmessage = (event) => {
	console.log("📥 Resposta:", JSON.parse(event.data));
	ws.close();
};

ws.onerror = (error) => console.error("❌ Erro:", error);
ws.onclose = () => console.log("🔒 Conexão encerrada.");
```

#### 🗑️ Deletar TODO

```javascript
const ws = new WebSocket("ws://localhost:8080/mcp");

ws.onopen = () =>
  ws.send(
    JSON.stringify({
      command: "delete-todo",
      payload: { id: 1 },
      apiKey: "SENHA_SECRETA",
    })
  );

ws.onmessage = (event) => {
	console.log("📥 Resposta:", JSON.parse(event.data));
	ws.close();
};

ws.onerror = (error) => console.error("❌ Erro:", error);
ws.onclose = () => console.log("🔒 Conexão encerrada.");
```

---

### Conclusão

Exemplos para testar comandos via WebSocket na API MCP:

- **`echo`**: Testa a conexão.
- **`list-tools`**: Lista as ferramentas.
- **`use-tool`**: Invoca ferramentas específicas (ex., **TodoManager**).
- **`help-tool` / `describe-tool`**: Obtém detalhes da ferramenta **TodoManager**.
- CRUD: Operações em TODOs via WebSocket (criar, listar, buscar, atualizar, deletar).

---

### Ferramentas

[Hoppscotch](https://hoppscotch.io)
