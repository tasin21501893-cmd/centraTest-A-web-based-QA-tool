# CentraTest - A Web-Based QA Tool

**CentraTest** is an autonomous SDET and intelligent quality assurance platform powered by a **LangGraph State Machine** and **MCP Agent** architecture. It provides automated test generation, live DOM inspection, automatic Page Object Model (POM) and Playwright specification synthesis, pull request impact analysis, and real-time test execution.

---

## 🚀 Key Features

- **Autonomous POM & Spec Synthesis**: Automatically crawl forms and dynamically generate Playwright Page Object Models and test specifications using LangGraph state machine orchestration.
- **Bulk Upload Testing**: Upload Excel (`.xlsx`) test matrices and execute batch automation suites with live streaming execution logs.
- **Manual Test Formulation**: Interactive form to quickly define custom test cases, selectors, action types, and assertion checks.
- **Pull Request Impact Analysis**: Multi-platform PR analysis (GitHub, GitLab, Azure DevOps, Bitbucket) that maps code changes to affected test cases and regression suites.
- **Real-Time Execution Console**: Live terminal output showing step-by-step test execution, failure traces, and retry mechanisms.
- **Interactive Reports**: Built-in Monocart HTML report viewer and Playwright test result dashboards.

---

## 🛠️ Tech Stack

- **Frontend & API**: [Next.js 14](https://nextjs.org/) (App Router), React 18, Tailwind CSS, Lucide React
- **Agentic AI & Orchestration**: [@langchain/langgraph](https://github.com/langchain-ai/langgraphjs), [@langchain/core](https://github.com/langchain-ai/langchainjs)
- **Test Automation Engine**: [Playwright](https://playwright.dev/)
- **Reporting**: Monocart Reporter, Allure Playwright
- **Spreadsheet Processing**: SheetJS (`xlsx`)

---

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.17.0 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tasin21501893-cmd/centraTest-A-web-based-QA-tool.git
   cd centraTest-A-web-based-QA-tool
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install chromium
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Playwright Tests

- Run demo test:
  ```bash
  npm test
  ```
- Run all test suites:
  ```bash
  npm run test:all
  ```
- View Monocart test report:
  ```bash
  npm run report:monocart
  ```

---

## 📂 Project Structure

```text
├── app/                  # Next.js App Router (pages and API routes)
│   ├── api/              # API endpoints for LangGraph agent, PR analysis, reports
│   ├── globals.css       # Global styles and Tailwind configuration
│   ├── layout.jsx        # Root application layout
│   └── page.jsx          # Main dashboard view
├── components/           # UI components (Navbar, BulkUpload, ManualTest, Console, etc.)
├── lib/
│   └── langgraph/        # LangGraph state machine and dynamic POM generator
├── resources/            # Sample Excel test files and data assets
├── support/              # Page Object Models and helper libraries
├── tests/                # Playwright specification suites
├── monocart-results/     # Monocart HTML test reports
└── playwright.config.js  # Playwright test runner configuration
```

---

## 📄 License

This project is proprietary and confidential.
