<<<<<<< HEAD
# Clube do Livro - TramaWeb

Este projeto é um site de clube do livro composto por um Frontend em Next.js e um Backend em Node.js.

## Estrutura do Projeto

- `frontend/`: Aplicação web (Next.js 14+)
- `backend/`: API REST (Node.js + Express)

## Pré-requisitos

- Node.js (v18 ou superior)
- MySQL

## Como Rodar o Projeto

### Backend

1. Navegue até a pasta backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o banco de dados no arquivo `.env` (use `.env.example` como base).
4. Inicie o servidor:
   ```bash
   node src/server.js
   ```
   O servidor rodará em `http://localhost:3001`.

### Frontend

1. Navegue até a pasta frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   O servidor rodará em `http://localhost:3000`.

## Solução de Problemas (Windows)

Se você receber um erro dizendo que a "execução de scripts foi desabilitada", execute o seguinte comando no seu PowerShell como **Administrador**:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Escolha `[S] Sim` quando solicitado. Isso permitirá que o `npm` e o `npx` funcionem corretamente.


## Contribuição

Mantenha o código organizado e siga o padrão de commits.
=======
# TramaWeb
>>>>>>> 5d40c09ad5192d1ab85ef6023b0ff3ac7d0c805b
