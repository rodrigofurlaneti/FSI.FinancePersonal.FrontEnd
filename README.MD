# FSI.FinancePersonal.FrontEnd

> 🚀 Projeto: FSI.FinancePersonal.FrontEnd — Front-end SPA para gestão de despesas pessoais


## 🧾 Visão geral

Este repositório contém o cliente (frontend) da aplicação FSI.FinancePersonal. É uma Single Page Application (SPA) feita com React + TypeScript, construída com Vite e usando React Router, React Query e Recharts para visualizações.

Principais features:
- 🔐 Autenticação via AuthContext (login/logout, token em localStorage para dev)
- 📊 Dashboard com gráfico de distribuição (donut)
- 📋 Páginas para listar, criar, editar e remover despesas
- ⚡ Performance: cache de dados com React Query
- 🎨 UI com Bootstrap & Bootstrap Icons


## 🛠️ Stack
- React 19 + TypeScript
- Vite
- React Router v6
- @tanstack/react-query
- Axios
- Recharts
- Bootstrap + Bootstrap Icons


## ⚙️ Scripts (package.json)

```bash
npm install
npm run dev      # rodar em modo desenvolvimento (Vite)
npm run build    # build: tsc -b && vite build
npm run preview  # preview do build
npm run lint     # rodar ESLint
```


## 📁 Estrutura sugerida

```
src/
  pages/
    Login.tsx
    Dashboard.tsx
    ExpensesPage.tsx
  components/
    UsernameInput.tsx
    Charts/
      ExpensesDonut.tsx
    Table/
      ExpensesTable.tsx
  contexts/
    AuthContext.tsx
    AppQueryProvider.tsx
  api/
    api.ts
    authService.ts
    expenseService.ts
  styles/
    login.css
  main.tsx (ou index.tsx)
```


## 🔐 Autenticação
- `AuthContext` provê `login`, `logout`, `token` e `isAuthenticated`.
- Em desenvolvimento, o token é armazenado em `localStorage` (chave `access_token`). Em produção, prefira cookies HttpOnly.
- Use `ProtectedRoute` para proteger rotas privadas (ex.: `/dashboard`).


## 📦 API & Tipos
- O arquivo `src/api/expenseService.ts` exporta tipos (`Expense`, `PagedResult`) e um objeto `ExpenseService` com métodos para CRUD.
- Importante: importe tipos com `import type { Expense } from "../api/expenseService";` para evitar erros ESM em runtime.


## 🧩 Componentes notáveis
- `UsernameInput` — componente pequeno para usuário/e-mail (usa ref para foco). Se usar ref como prop, tipá-la como `React.RefObject<HTMLInputElement | null>` ou use `forwardRef`.
- `ExpensesDonut` — gráfico donut usando Recharts. Evite usar índice como `key` ao renderizar células; prefira uma chave derivada (ex.: `name` ou `${name}-${i}`).


## 🐞 Debug comum
- Tela em branco: abra DevTools (F12) e verifique o primeiro erro vermelho. Erros típicos:
  - `does not provide an export named 'X'` → troque `import { X }` por `import type { X }` se for um tipo;
  - Import/case-sensitive path errado (Linux);
  - Erro de compilação no terminal do Vite.


## ♿ Acessibilidade (A11y)
- Spinner decorativo: use `aria-hidden="true"`. Exponha status para leitores com `<output aria-live="polite" className="visually-hidden">Entrando...</output>`.
- Labels, `form-floating`, `aria-describedby` e foco em inputs.


## ✅ Boas práticas aplicadas
- Use `import type` para imports de tipos.
- Props marcadas `readonly` (`type Props = Readonly<...>`).
- Componentes pequenos e testáveis.


## 🤝 Contribuição
1. Fork the repo
2. Crie branch: `feature/xxx`
3. Faça commit e PR
4. Execute `npm run lint` e `tsc` antes de abrir PR


## 📌 Observações finais
- Nome do projeto: **FSI.FinancePersonal.FrontEnd**
- Se quiser que eu gere também um `CHANGELOG.md`, `CONTRIBUTING.md` ou templates de PR/ISSUE, posso criar.



