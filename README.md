# Controle de Gastos Residenciais

Sistema para gerenciamento de gastos residenciais, com cadastro de pessoas, categorias e transações financeiras.

## Tecnologias

- **Back-end:** C# / .NET 9 Web API, Entity Framework Core, SQL Server
- **Front-end:** React 19 + TypeScript (Vite)

## Pré-requisitos

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js 18+](https://nodejs.org/)
- SQL Server (Express ou superior)

## Como executar

### Back-end

```bash
cd backend/ControleGastos.Api
dotnet run
```

> A API sobe em `http://localhost:5005`. O banco `ControleGastos` é criado automaticamente no SQL Server Express local.

Se necessário, ajuste a connection string em `appsettings.json`.

### Front-end

```bash
cd frontend
npm install
npm run dev
```

> Acesse `http://localhost:5173` no navegador.

## Funcionalidades

**Pessoas** — CRUD completo. Ao excluir uma pessoa, todas as suas transações são removidas automaticamente.

**Categorias** — Criação e listagem. Cada categoria tem uma finalidade: despesa, receita ou ambas.

**Transações** — Criação e listagem com regras de negócio:
- Menores de 18 anos só podem registrar despesas
- A categoria deve ser compatível com o tipo da transação
- Valor obrigatoriamente positivo

**Totais** — Consulta de receitas, despesas e saldo por pessoa e por categoria, com total geral ao final.

## Estrutura

```
backend/ControleGastos.Api/
  ├── Controllers/    # Endpoints da API
  ├── Data/           # DbContext (EF Core)
  ├── DTOs/           # Objetos de transferência
  └── Models/         # Entidades

frontend/src/
  ├── pages/          # Componentes de cada tela
  ├── services/       # Chamadas HTTP (axios)
  └── types/          # Interfaces TypeScript
```

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/pessoas` | Listar pessoas |
| POST | `/api/pessoas` | Criar pessoa |
| PUT | `/api/pessoas/{id}` | Editar pessoa |
| DELETE | `/api/pessoas/{id}` | Excluir pessoa (cascade) |
| GET | `/api/categorias` | Listar categorias |
| POST | `/api/categorias` | Criar categoria |
| GET | `/api/transacoes` | Listar transações |
| POST | `/api/transacoes` | Criar transação |
| GET | `/api/totais/por-pessoa` | Totais por pessoa |
| GET | `/api/totais/por-categoria` | Totais por categoria |
