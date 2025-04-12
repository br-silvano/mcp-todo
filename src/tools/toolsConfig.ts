import { ToolRegistry } from './ToolRegistry';

export const buildToolRegistry = (): ToolRegistry => {
  const toolRegistry = new ToolRegistry();

  toolRegistry.register({
    name: "TodoManager",
    description: "Gerencia tarefas com operações de CRUD completo.",
    capabilities: [
      {
        name: "create-todo",
        command: "create-todo",
        description: "Cria uma nova tarefa com título e descrição.",
        input_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            completed: { type: "boolean" } // opcional
          },
          required: ["title"]
        },
        output_schema: {
          type: "object",
          properties: {
            id: { type: "number" },
            title: { type: "string" },
            description: { type: "string" },
            completed: { type: "boolean" }
          },
          required: ["id", "title", "description", "completed"]
        }
      },
      {
        name: "get-todo-by-id",
        command: "get-todo-by-id",
        description: "Busca uma tarefa pelo ID.",
        input_schema: {
          type: "object",
          properties: {
            id: { type: "integer" }
          },
          required: ["id"]
        },
        output_schema: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            description: { type: "string" },
            completed: { type: "boolean" }
          },
          required: ["id", "title", "description", "completed"]
        }
      },
      {
        name: "update-todo",
        command: "update-todo",
        description: "Atualiza uma tarefa existente.",
        input_schema: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            description: { type: "string" },
            completed: { type: "boolean" }
          },
          required: ["id"]
        },
        output_schema: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            description: { type: "string" },
            completed: { type: "boolean" }
          },
          required: ["id", "title", "description", "completed"]
        }
      },
      {
        name: "delete-todo",
        command: "delete-todo",
        description: "Remove uma tarefa pelo ID.",
        input_schema: {
          type: "object",
          properties: {
            id: { type: "number" }
          },
          required: ["id"]
        },
        output_schema: {
          type: "object",
          properties: {
            success: { type: "boolean" }
          },
          required: ["success"]
        }
      },
      {
        name: "get-all-todos",
        command: "get-all-todos",
        description: "Lista todas as tarefas registradas.",
        input_schema: {
          type: "object",
          properties: {}
        },
        output_schema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              title: { type: "string" },
              description: { type: "string" },
              completed: { type: "boolean" }
            },
            required: ["id", "title", "description", "completed"]
          }
        }
      }
    ],
    examples: {
      "create-todo": {
        request: JSON.stringify({
          command: "create-todo",
          payload: {
            title: "Estudar TypeScript",
            description: "Praticar tipos e interfaces avançadas",
            completed: false
          }
        }, null, 2),
        response: JSON.stringify({
          id: 101,
          title: "Estudar TypeScript",
          description: "Praticar tipos e interfaces avançadas",
          completed: false
        }, null, 2)
      },

      "get-todo-by-id": {
        request: JSON.stringify({
          command: "get-todo-by-id",
          payload: {
            id: 101
          }
        }, null, 2),
        response: JSON.stringify({
          id: 101,
          title: "Estudar TypeScript",
          description: "Praticar tipos e interfaces avançadas",
          completed: false
        }, null, 2)
      },

      "update-todo": {
        request: JSON.stringify({
          command: "update-todo",
          payload: {
            id: 101,
            title: "Estudar TypeScript - Atualizado",
            description: "Foco em generics e utility types",
            completed: true
          }
        }, null, 2),
        response: JSON.stringify({
          id: 101,
          title: "Estudar TypeScript - Atualizado",
          description: "Foco em generics e utility types",
          completed: true
        }, null, 2)
      },

      "delete-todo": {
        request: JSON.stringify({
          command: "delete-todo",
          payload: {
            id: 101
          }
        }, null, 2),
        response: JSON.stringify({
          success: true,
          message: "Tarefa removida com sucesso."
        }, null, 2)
      },

      "get-all-todos": {
        request: JSON.stringify({
          command: "get-all-todos",
          payload: {}
        }, null, 2),
        response: JSON.stringify([
          {
            id: 101,
            title: "Estudar TypeScript",
            description: "Praticar tipos e interfaces avançadas",
            completed: false
          },
          {
            id: 102,
            title: "Ler sobre Clean Architecture",
            description: "Estudo do livro do Uncle Bob",
            completed: true
          }
        ], null, 2)
      }
    }
  });

  return toolRegistry;
};
