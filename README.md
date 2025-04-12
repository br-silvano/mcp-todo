## 🧱 MCP Boilerplate

[![Build and Test](https://github.com/br-silvano/mcp-todo/actions/workflows/build.yml/badge.svg)](https://github.com/br-silvano/mcp-todo/actions/workflows/build.yml)

Este projeto é um boilerplate base para aplicações Node.js com suporte a TypeScript, ESLint, Husky, Jest, entre outras ferramentas modernas de desenvolvimento.

---

### ▶️ Executar o Projeto

1. **Garantir permissão de execução no hook de commit (Husky):**

```bash
chmod +x .husky/pre-commit
```

> Isso garante que o hook de `pre-commit` seja executado corretamente ao tentar fazer um `git commit`.

2. **Iniciar o servidor de desenvolvimento:**

```bash
npm run dev
```

> Executa o servidor via `ts-node`.

3. **Verificar se o repositório Git está corretamente inicializado:**

```bash
git rev-parse --is-inside-work-tree
```

> Útil para validar que o diretório está dentro de um repositório Git — necessário para o funcionamento de ferramentas como Husky e lint-staged.

---

### 🧪 Executar os Testes

```bash
npm run test
```

> Roda a suíte de testes configurada com Jest.

---

### 📌 Requisitos

Antes de rodar os comandos acima, certifique-se de que possui os seguintes requisitos instalados:

- [Node.js](https://nodejs.org/) v20 ou superior
- [npm](https://www.npmjs.com/) v10 ou superior
- Git

---

### 🛠️ Scripts disponíveis

- `npm run dev`: inicia a aplicação em modo de desenvolvimento com suporte a TypeScript
- `npm run test`: executa os testes com Jest
- `npm run lint`: roda o ESLint para análise de código

---

### 📋 Relatórios e Resultados

- **Build e Testes:** O status do build/test é exibido acima.
- **Artifacts:** Após cada execução, artifacts (build, logs e relatórios) ficam disponíveis na [página de Actions](https://github.com/br-silvano/mcp-todo/actions).
- **Cobertura de Testes:** [![Cobertura de Testes](https://img.shields.io/codecov/c/github/br-silvano/mcp-todo.svg)](https://codecov.io/gh/br-silvano/mcp-todo)
