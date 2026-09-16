# 🤖 AI GitHub Project Analyzer

> **An AI-powered platform that analyzes GitHub repositories and provides actionable insights to improve documentation, repository health, code quality, and project maintainability.**

<p align="center">
  <img src="https://img.shields.io/badge/AI-Powered-blue" alt="AI Powered">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Node.js-Backend-339933" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-Backend-black" alt="Express">
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248" alt="MongoDB">
  <img src="https://img.shields.io/badge/GitHub-API-181717" alt="GitHub API">
</p>

---

## 📌 Overview

**AI GitHub Project Analyzer** is a full-stack web application designed to evaluate the quality and health of GitHub repositories.

Instead of manually reviewing a repository, users can provide a GitHub repository URL and receive a structured analysis containing:

- 📖 README Quality Score
- 🏥 Repository Health Score
- 🤖 AI-powered recommendations
- 📊 Detailed analysis reports
- 📚 Analysis history
- ⭐ Favorite repositories
- ⚖️ Repository comparison
- 👤 User profile and authentication

The goal is to help developers identify weaknesses in their repositories and understand what can be improved.

---

## ✨ Key Features

### 🔍 Repository Analysis

Analyze a GitHub repository using repository metadata, documentation, activity, collaboration signals, and other available GitHub information.

### 📖 README Quality Analysis

Evaluate the README across multiple documentation categories:

- Project Overview
- Installation & Setup
- Usage Documentation
- Technical Documentation
- Contribution Guidance
- Maintenance & Metadata
- Readability & Completeness

### 🏥 Repository Health Analysis

Evaluate repository health using factors such as:

- Repository Activity
- Collaboration Signals
- Repository Organization
- Automation & Quality
- Dependency & Release
- Issue & Maintenance
- Community & Discoverability

### 🤖 AI Recommendations

The AI layer analyzes repository information and generates practical suggestions that developers can use to improve their projects.

### 📊 Interactive Dashboard

View repository analyses, scores, recommendations, and other project information through a centralized dashboard.

### 🕘 Analysis History

Keep track of previously analyzed repositories and revisit their reports.

### ⭐ Favorites

Save important repository analyses for quick access.

### ⚖️ Repository Comparison

Compare multiple repositories and examine their analysis results side-by-side.

### 🔐 Authentication

User authentication and protected application routes help keep user-specific data separated.

---

# 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Repository Data | GitHub API |
| AI | AI/LLM Integration |
| Styling | CSS / Tailwind-based styling |
| Development | Git, GitHub, VS Code, npm |

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │        User         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │      + Vite         │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │  Express / Node.js  │
                    │       Backend       │
                    └───────┬─────┬───────┘
                            │     │
                 ┌──────────┘     └──────────┐
                 ▼                           ▼
        ┌─────────────────┐         ┌─────────────────┐
        │   GitHub API    │         │    AI / LLM     │
        └─────────────────┘         └─────────────────┘
                            │
                            ▼
                    ┌─────────────────┐
                    │     MongoDB      │
                    └─────────────────┘
```

---

# 📂 Project Structure

```text
AI-Github-Project-Analyzer/
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── middleware/
│   ├── services/
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .github/
│   └── workflows/
│
├── README.md
└── package.json
```

---

# 🚀 Getting Started

## Prerequisites

Make sure the following are installed:

- **Node.js**
- **npm**
- **Git**
- **MongoDB / MongoDB Atlas**
- **GitHub account**
- Required AI API access

Check your installation:

```bash
node --version
npm --version
git --version
```

---

# 📥 Installation

## 1. Clone the Repository

```bash
git clone https://github.com/ShubhamJain1276/AI-Github-Project-Analyzer.git
```

## 2. Navigate to the Project

```bash
cd AI-Github-Project-Analyzer
```

## 3. Install Backend Dependencies

```bash
cd backend
npm install
```

## 4. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GITHUB_TOKEN=your_github_token
OPENAI_API_KEY=your_openai_api_key
```

> ⚠️ **Security:** Never commit `.env` files or expose API keys in your frontend code.

Add `.env` to `.gitignore`:

```gitignore
.env
.env.*
```

---

# ▶️ Running the Application

## Start Backend

```bash
cd backend
npm run dev
```

## Start Frontend

Open a second terminal:

```bash
cd frontend
npm run dev
```

Vite will display the local development URL in the terminal.

---

# 🧑‍💻 How to Use

1. Open the application.
2. Create an account or log in.
3. Enter a GitHub repository URL.
4. Start the analysis.
5. Wait for the analysis to complete.
6. Review the repository scores.
7. Read the AI-generated recommendations.
8. Save important analyses to **History** or **Favorites**.
9. Use **Compare** to compare repositories.

---

# 📊 Scoring Methodology

The application generates two primary scores.

## 📖 README Quality Score

| Category | Weight |
|---|---:|
| Project Overview | 20 |
| Setup & Installation | 20 |
| Usage Documentation | 15 |
| Technical Documentation | 15 |
| Contribution Guidance | 10 |
| Maintenance & Metadata | 10 |
| Readability & Completeness | 10 |
| **Total** | **100** |

## 🏥 Repository Health Score

The repository health evaluation considers:

- Repository Activity
- Collaboration Signals
- Repository Organization
- Automation & Quality
- Dependency & Release
- Issue & Maintenance
- Community & Discoverability

The scores are designed to provide a structured view of repository quality and highlight areas that may need improvement.

---

# 🤖 AI Analysis

The AI component processes repository information and generates recommendations based on the analysis.

Examples of recommendations may include:

```text
• Improve README installation instructions
• Add automated tests
• Add CI/CD workflows
• Add contribution guidelines
• Add a project license
• Improve repository organization
• Improve documentation coverage
```

The recommendations are intended to assist developers rather than replace manual code review.

---

# 🔌 API Overview

The backend provides REST APIs for major application functionality.

Typical API areas include:

```text
Authentication
├── Register
├── Login
└── Current User

Analysis
├── Analyze Repository
├── Get Analysis
└── Analysis History

Favorites
├── Add Favorite
├── Remove Favorite
└── Get Favorites

Comparison
└── Compare Repositories
```

Refer to the backend route files for the current implementation and endpoint details.

---

# 🧪 Testing

Automated tests should cover important:

- Backend APIs
- Authentication
- Repository analysis logic
- Frontend components
- API integration

Run the project's configured test command:

```bash
npm test
```

> If tests are not yet configured, add a testing framework and corresponding test scripts before relying on this command.

---

# ⚙️ CI/CD

GitHub Actions can be used to automatically validate changes.

A recommended workflow structure is:

```text
.github/
└── workflows/
    └── ci.yml
```

A CI workflow can perform:

```text
Push / Pull Request
        ↓
Install Dependencies
        ↓
Run Tests
        ↓
Build Application
        ↓
Validation Complete
```

---

# 🔒 Security

The project should follow these security practices:

- Keep secrets inside environment variables.
- Never commit `.env` files.
- Never expose API keys in frontend code.
- Use minimum required GitHub token permissions.
- Validate incoming user data.
- Protect authenticated routes.
- Validate external API responses.
- Keep dependencies updated.

---

# 🤝 Contributing

Contributions are welcome.

### Contribution Workflow

```bash
# Create a branch
git checkout -b feature/your-feature

# Make your changes

# Stage changes
git add .

# Commit
git commit -m "Add your feature"

# Push
git push origin feature/your-feature
```

Then create a Pull Request on GitHub.

For larger contributions, discuss the proposed change before implementation.

---

# 🗺️ Future Improvements

Planned or possible improvements include:

- [ ] Automated code-quality analysis
- [ ] More advanced AI recommendations
- [ ] Comprehensive automated testing
- [ ] GitHub Actions CI/CD
- [ ] Pull Request analysis
- [ ] Issue analytics
- [ ] Improved repository comparison
- [ ] Exportable analysis reports
- [ ] Additional AI model support
- [ ] More detailed repository metrics

---

# 📄 License

This project should include an appropriate open-source license in a `LICENSE` file.

Choose the license based on how you want others to use, modify, and distribute the project.

---

# 👨‍💻 Author

**AI GitHub Project Analyzer**

A full-stack AI-assisted developer tool designed to analyze GitHub repositories and provide actionable improvement recommendations.

---

# 🎯 Project Goal

The main goal of **AI GitHub Project Analyzer** is to make GitHub repository evaluation faster and easier.

Instead of manually checking documentation, repository organization, activity, collaboration, and development practices, the platform brings these signals together into a single analysis report.

> **Analyze → Understand → Improve 🚀**

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

<p align="center">
  Made with ❤️ for developers
</p>
