# Playwright UI Auth - Automação de Autenticação

Projeto de automação de testes End-to-End (E2E) focado no módulo de autenticação da aplicação web **Serverest**, desenvolvido com **Playwright** e **JavaScript**.

## Objetivo

Garantir a qualidade, integridade e correto funcionamento dos fluxos de autenticação e gestão de sessão de usuários na interface gráfica da aplicação.

## Tecnologias Utilizadas

- **Playwright** (v1.x)
- **Node.js**
- **JavaScript (ES6+)**
- **Git / GitHub**

## Cenários de Teste Automatizados

| ID | Cenário | Descrição / Estratégia Técnica |
| :--- | :--- | :--- |
| **CT01** | Cadastro de Usuário | Valida o cadastro com sucesso gerando massa de dados dinâmica e incremental via arquivo `counter.json`. |
| **CT02** | Login com Sucesso | Valida o login com credenciais válidas. Pré-condição desacoplada via requisição de API (`POST /usuarios`). |
| **CT03** | Login com Falha | Valida a mensagem de erro ao tentar realizar login com credenciais inválidas ou inexistentes. |
| **CT04** | Logout do Sistema | Valida o encerramento de sessão. Utiliza injeção de token JWT em background (`localStorage`) para bypass de autenticação. |

## Gestão do Projeto e Processos Ágeis

O planejamento, especificação e ciclo de vida dos testes foram gerenciados utilizando o **GitHub Projects (Kanban)**:

- **Casos de Teste Imperativos:** Mapeados em formato de *Issues* no GitHub com critérios de aceitação e passos de reprodução.
- **Git Branching Workflow:** Desenvolvimento isolado por funcionalidade através de *Feature Branches* (`feat/CT0x-...`), integrado à `main` via *Pull Requests*.
- **Fluxo Kanban:** Acompanhamento do progresso das tarefas nas colunas `Backlog`, `Ready`, `In progress`, `In review` e `Done`.


## Estrutura do Projeto

```text
├── tests/
│   └── auth.spec.js      # Suíte de testes E2E de Autenticação
├── counter.json          # Persistência de contador incremental de massa
├── playwright.config.js  # Configurações globais do Playwright
├── package.json          # Dependências e scripts do projeto
└── .gitignore            # Arquivos e pastas ignorados pelo Git
```

## Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **NPM**

## Como Executar os Testes

1. **Clonar o repositório:**
   ```bash
   git clone git@github.com:giovanemedeiros/playwright-ui-auth.git
   cd playwright-ui-auth
   ```

2. **Instalar as dependências:**
   ```bash
   npm install
   ```

3. **Executar a suíte de testes completa (Headless):**
   ```bash
   npx playwright test
   ```

4. **Executar em modo sequencial com interface gráfica (Headed):**
   ```bash
   npx playwright test tests/auth.spec.js --workers=1 --project=chromium --headed
   ```

5. **Gerar e abrir o relatório de testes (HTML Report):**
   ```bash
   npx playwright show-report
   ```
