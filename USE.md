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

ws.onmessage = (event) => console.log("📥 Resposta:", event.data);
ws.onerror = (error) => console.error("❌ Erro:", error);
ws.onclose = () => console.log("🔒 Conexão encerrada.");
```

---

### 2. 🧰 `list-tools` – Lista ferramentas disponíveis

```javascript
const ws = new WebSocket("ws://localhost:8080/mcp");

ws.onopen = () =>
  ws.send(JSON.stringify({ command: "list-tools", apiKey: "SENHA_SECRETA" }));
ws.onmessage = (event) => console.log("🧾 Ferramentas:", event.data);
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
ws.onerror = (err) => console.error("❌ Erro WebSocket:", err);
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
ws.onmessage = (event) => console.log("📥 Resposta:", event.data);
ws.onerror = (error) => console.error("❌ Erro:", error);
ws.onclose = () => console.log("🔒 Conexão encerrada.");
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
ws.onmessage = (event) => console.log("📥 Resposta:", event.data);
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

ws.onmessage = (event) => console.log("📥 Resposta (criar TODO):", event.data);
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
ws.onmessage = (event) =>
  console.log("📥 Resposta (listar TODOS):", event.data);
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
ws.onmessage = (event) =>
  console.log("📥 Resposta (buscar TODO por ID):", event.data);
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
ws.onmessage = (event) =>
  console.log("📥 Resposta (atualizar TODO):", event.data);
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
ws.onmessage = (event) =>
  console.log("📥 Resposta (deletar TODO):", event.data);
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
