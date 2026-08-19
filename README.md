# 🚀 BuildForge AI

> **Next-Generation Enterprise Software Architecture & Full-Stack Blueprint Synthesis Engine**

[![Node.js](https://img.shields.io/badge/Node.js-v20.x-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-v19.x-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-v8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Express](https://img.shields.io/badge/Express-v5.x-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%20%2F%20Groq-4285F4?logo=google&logoColor=white)](https://ai.google.dev)
[![PDFKit](https://img.shields.io/badge/PDF-PDFKit%20Vector%20Engine-E11D48)](https://pdfkit.org)
[![License](https://img.shields.io/badge/License-ISC-indigo)](LICENSE)

---

## 📖 Table of Contents

1. [Executive Overview](#-executive-overview)
2. [Key Architecture Outputs](#-key-architecture-outputs)
3. [Technology Stack](#-technology-stack)
4. [Project Directory Structure](#-project-directory-structure)
5. [Prerequisites](#-prerequisites)
6. [Step-by-Step Installation & Local Setup](#-step-by-step-installation--local-setup)
7. [Environment Variables Configuration](#-environment-variables-configuration)
8. [REST API Documentation](#-rest-api-documentation)
9. [Executive PDF Export Engine](#-executive-pdf-export-engine)
10. [Troubleshooting & FAQs](#-troubleshooting--faqs)

---

## 🎯 Executive Overview

**BuildForge AI** is a production-grade generative platform designed for software engineers, engineering leads, product managers, and startup founders. It transforms any natural language product concept into an end-to-end, enterprise-grade software blueprint in seconds.

Unlike basic text prompts, BuildForge AI utilizes structured normalization pipelines, fallback resilience engines, and multi-tier architectural schemas to synthesize complete, verifiable technical blueprints.

---

## ✨ Key Architecture Outputs

Every synthesized blueprint contains 14+ production-ready technical modules:

| Module | Description |
| :--- | :--- |
| **🎯 Project Foundation** | Executive summary, problem statement, proposed architectural solution, target user personas, and strategic business metrics. |
| **✨ Core Features Matrix** | Granular feature breakdowns with `[CRITICAL]`, `[HIGH]`, and `[MEDIUM]` priority badges, complexity ratings, business impact, and technical notes. |
| **⚡ Technology Stack** | Tier-by-tier tooling breakdown (Frontend, Backend, Database, Authentication, AI Services, Cloud, DevOps, Testing, and Monitoring). |
| **🏗️ System Architecture** | Component topology diagram specifications, responsibility matrices, and step-by-step request lifecycle sequence flows. |
| **🗄️ Database Schemas** | Document collections / SQL tables with field definitions, types, required flags, constraints, compound indexes, and entity relationships. |
| **🌐 REST API Contracts** | HTTP methods (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`), endpoints, authentication tags, request payloads, and response envelopes. |
| **📁 Project Structure** | Multi-level enterprise directory trees for both Client (SPA) and Server (API) with 1-click ASCII copy support. |
| **🚀 Phased Roadmap** | Milestone phases with estimated week durations, concrete development task checklists, and verifiable deliverables. |
| **🔒 Security & Governance** | Zero-Trust JWT authentication, TLS 1.3 encryption, RBAC authorization, at-rest column encryption, and OWASP Top 10 mitigations. |
| **⚡ Performance Protocols** | Multi-tier Redis caching, compound database query indexing, cursor pagination, and asynchronous job queues. |
| **🛠️ Engineering Standards** | Domain-Driven Design (DDD), semantic versioning, uniform API envelopes, automated CI/CD test gates, and IaC containerization. |
| **🔮 Future Roadmap** | AI vector embeddings, real-time WebSocket collaborative workspaces, native mobile apps, and multi-region clustering. |
| **📋 Deployment Checklist** | Pre-flight production checklist covering secrets injection, multi-AZ database setup, SSL/TLS certificates, CDN edge routing, and 24/7 alerts. |
| **🛡️ Risks & Mitigations** | Comprehensive technical and business risk matrix with severity impact levels and concrete mitigation strategies. |

---

## 🛠 Technology Stack

### Frontend Client
- **Framework**: React 19 / Vite 8 Single Page Application (SPA)
- **Styling**: Vanilla CSS with modern Glassmorphism, CSS Custom Properties, and responsive flex/grid layouts
- **Animation**: Framer Motion
- **Icons**: React Icons (FontAwesome, Feather, BoxIcons)
- **Routing**: React Router DOM v7
- **Notifications**: React Hot Toast

### Backend API Server
- **Runtime**: Node.js v20+ (ES Modules)
- **Framework**: Express v5 REST API Gateway
- **AI Synthesis Engines**: Google Generative AI (Gemini 1.5 / 2.0 Pro), Groq SDK (Llama 3), and OpenAI fallback
- **Database**: MongoDB & Mongoose ORM / ODM
- **Document Export**: PDFKit (High-resolution multi-page streaming vector PDF engine)
- **Security & Hardening**: Helmet, CORS, Express-Rate-Limit, HPP, JSON-Repair, Bcryptjs, JWT
- **Email & Communications**: Nodemailer (SMTP / Gmail App Passwords) & Resend SDK

---

## 📁 Project Directory Structure

```plaintext
BuildForge-AI/
├── .env.example                     # Environment variables template
├── package.json                     # Root project configuration
├── backend/                         # Backend API Server (Node.js/Express)
│   ├── package.json                 # Backend dependencies & npm scripts
│   ├── .env                         # Backend environment secrets
│   └── src/
│       ├── server.js                # Server entry point & Express bootstrap
│       ├── ai/
│       │   ├── aiService.js         # Multi-provider AI generation engine
│       │   ├── normalizer.js        # Deep architecture schema normalizer
│       │   ├── promptBuilder.js     # Enterprise architecture prompt templates
│       │   └── validator.js         # Blueprint integrity & structure validator
│       ├── config/
│       │   ├── database.js          # MongoDB database connection logic
│       │   └── env.js               # Centralized environment validator
│       ├── controllers/
│       │   ├── aiController.js      # AI generation route handler
│       │   ├── authController.js    # User authentication & JWT controller
│       │   ├── exportController.js  # Executive PDF & JSON streaming exporter
│       │   └── projectController.js # Blueprint management & CRUD controller
│       ├── middleware/
│       │   ├── authMiddleware.js    # JWT bearer verification middleware
│       │   └── rateLimiter.js       # Sliding-window rate limiting
│       ├── routes/
│       │   ├── aiRoutes.js          # /api/ai endpoints
│       │   ├── authRoutes.js        # /api/auth endpoints
│       │   └── projectRoutes.js     # /api/projects endpoints
│       ├── services/
│       │   └── projectService.js    # In-memory and DB project persistence
│       └── utils/
│           ├── apiResponse.js       # Standardized API response envelopes
│           └── email.js             # OTP verification & notification mailer
│
└── frontend/                        # Frontend Client Application (React/Vite)
    ├── package.json                 # Frontend dependencies & npm scripts
    ├── index.html                   # HTML5 application shell & font imports
    ├── vite.config.js               # Vite bundler configuration
    └── src/
        ├── App.jsx                  # Main application router & route guards
        ├── main.jsx                 # React root DOM mounting
        ├── index.css                # Master design system & utilities
        ├── blueprint/               # Blueprint architecture components
        │   ├── ActionButtons.jsx    # Executive PDF export section
        │   ├── AIInsights.jsx       # Readiness metric scorecard & checklist
        │   ├── APISection.jsx       # REST API contracts & payloads
        │   ├── ArchitectureSection.jsx # System topology & component flow
        │   ├── BlueprintHero.jsx    # Hero summary & project metadata banner
        │   ├── DatabaseSection.jsx  # Schema, field tables & indexes
        │   ├── FeaturesSection.jsx  # Core features & priority badges
        │   ├── FolderSection.jsx    # Multi-level directory tree renderer
        │   ├── OverviewSection.jsx  # Problem, solution, users & goals
        │   ├── RoadmapSection.jsx   # Phased implementation timeline
        │   ├── TechStackSection.jsx # Categorized technology tier cards
        │   └── blueprint.css        # Blueprint styling & print styles
        ├── components/              # Shared application UI components
        │   ├── Footer.jsx           # Global glassmorphic footer
        │   ├── Hero.jsx             # Landing page vision banner
        │   └── Navbar.jsx           # Fixed glassmorphic top navigation bar
        ├── pages/                   # Application pages & route views
        │   ├── Blueprint.jsx        # Interactive software blueprint page
        │   ├── Dashboard.jsx        # Project Idea Builder & configuration
        │   ├── Home.jsx             # Public landing page (Features, About, Contact)
        │   ├── Login.jsx            # User authentication portal
        │   ├── Register.jsx         # New account registration
        │   └── Projects.jsx         # My Saved Projects explorer
        └── services/
            └── api.js               # Axios instance with auth interceptors
```

---

## ⚙️ Prerequisites

Ensure you have the following installed on your machine before running:

1. **Node.js**: `v18.0.0` or higher (Recommended: `v20.x` or `v22.x`)
2. **npm**: `v9.x` or `v10.x`
3. **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017`) or MongoDB Atlas URI *(Optional: In-memory fallback is active if MongoDB is offline)*
4. **AI API Key**: At least one of the following:
   - **Google Gemini API Key**: [Get free at Google AI Studio](https://aistudio.google.com/)
   - **Groq API Key**: [Get free at Groq Cloud](https://console.groq.com/)
   - **OpenAI API Key**: [Get at OpenAI Platform](https://platform.openai.com/)

---

## 🚀 Step-by-Step Installation & Local Setup

### Step 1: Clone or Navigate to the Project

```bash
cd "BuildForge AI"
```

---

### Step 2: Configure Environment Variables

1. Copy `.env.example` to `backend/.env`:
   ```bash
   cp .env.example backend/.env
   ```
2. Open `backend/.env` and insert your API keys and configuration values (refer to the [Environment Variables](#-environment-variables-configuration) section).

---

### Step 3: Install & Start the Backend API Server

Open a terminal window and run:

```bash
cd backend
npm install
npm run dev
```

The backend server will start on: **`http://localhost:5001`**

---

### Step 4: Install & Start the Frontend Client

Open a second terminal window and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend client will start on: **`http://localhost:5173`**

---

### Step 5: Open in Your Browser

Navigate to **`http://localhost:5173`** to begin generating enterprise software blueprints!

---

## 🔐 Environment Variables Configuration

Create a `.env` file in the `backend/` directory with the following variables:

```ini
# ==========================================
# BUILDFORGE AI - SERVER CONFIGURATION
# ==========================================
PORT=5001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_super_secure_jwt_secret_key_at_least_32_chars

# ==========================================
# DATABASE CONFIGURATION
# ==========================================
DATABASE_URL=mongodb://127.0.0.1:27017/buildforgeai
MONGO_URI=mongodb://127.0.0.1:27017/buildforgeai

# ==========================================
# AI GENERATION ENGINE KEYS (AT LEAST ONE)
# ==========================================
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# ==========================================
# EMAIL & NOTIFICATIONS (OPTIONAL)
# ==========================================
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_16_char_app_password
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=BuildForge AI <noreply@buildforge.ai>

# ==========================================
# GOOGLE OAUTH 2.0 (OPTIONAL)
# ==========================================
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback
```

---

## 📡 REST API Documentation

### 1. AI Architecture Engine
- **`POST /api/ai/generate`**
  - **Description**: Synthesizes a complete architectural blueprint from a natural language project idea.
  - **Authentication**: Public or JWT Bearer Token
  - **Request Body**:
    ```json
    {
      "projectIdea": "Adaptive EdTech LMS with Personalized Learning Pathways",
      "difficulty": "Advanced",
      "techStack": ["React", "Node.js", "PostgreSQL", "TailwindCSS"]
    }
    ```
  - **Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "projectName": "Adaptive EdTech LMS",
        "features": [ ... ],
        "technologyStack": { ... },
        "architecture": { ... },
        "databaseDesign": [ ... ],
        "restApis": [ ... ],
        "folderStructure": { ... },
        "developmentRoadmap": [ ... ],
        "security": [ ... ],
        "performanceOptimization": [ ... ],
        "bestPractices": [ ... ],
        "futureEnhancements": [ ... ],
        "deploymentChecklist": [ ... ],
        "risks": [ ... ]
      }
    }
    ```

---

### 2. Document & PDF Exporters
- **`POST /api/projects/export-pdf`**
  - **Description**: Compiles and streams a high-resolution, multi-page vector architectural PDF specification.
  - **Request Body**:
    ```json
    {
      "idea": "Healthcare Patient Portal",
      "project": { ... }
    }
    ```
  - **Response**: Binary `application/pdf` stream (`attachment; filename="Project-Blueprint.pdf"`)

- **`GET /api/projects/export/:id`**
  - **Description**: Exports a saved project blueprint as a multi-page PDF document by Project ID.

- **`GET /api/projects/export-json/:id`**
  - **Description**: Exports the raw structured blueprint as a formatted JSON document.

---

### 3. Authentication & User Profile
- **`POST /api/auth/register`**: Registers a new user account and dispatches verification email.
- **`POST /api/auth/login`**: Authenticates user credentials and returns JWT bearer token pair.
- **`POST /api/auth/verify-otp`**: Verifies 6-digit email OTP for two-factor authentication.
- **`GET /api/auth/me`**: Retrieves authenticated user profile and account details.

---

## 📄 Executive PDF Export Engine

The PDF export engine in `backend/src/controllers/exportController.js` is built with **PDFKit** to ensure vector sharpness, zero blank pages, and clean multi-page document pagination:

1. **Executive Cover Header**: High-contrast dark header banner with metadata grid and executive summary.
2. **Project Foundation & Goals**: Colored problem/solution cards and strategic business metrics.
3. **Core Features**: Numbered capability cards with priority badges (`[CRITICAL]`, `[HIGH]`, `[LOW]`).
4. **Categorized Tech Stack**: Tier-by-tier listing with rationale and architectural justification.
5. **System Topology & Data Flow**: Component responsibilities and numbered lifecycle sequence steps.
6. **Database Specification**: Full table schemas with field names, types, required flags, and indexes.
7. **REST API Contracts**: HTTP method pills (`GET`, `POST`, `PUT`, `DELETE`), endpoint paths, authentication, and payload schemas.
8. **Enterprise Folder Trees**: Indented monospace ASCII folder structures for both Client and Server.
9. **Implementation Roadmap**: Phased milestones with task checklists and key deliverables.
10. **Governance & Standards**: Enterprise security protocols, performance measures, best practices, future roadmap, deployment checklist, and risk mitigation matrix.
11. **Running Headers & Footers**: Automatic page numbering (`Page X of Y`), confidentiality notice, and project title across all pages.

---

## ❓ Troubleshooting & FAQs

### Q1: The backend server fails to start with `EADDRINUSE: port 5001 is already in use`
- **Solution**: Another process is running on port 5001. Terminate the process or change `PORT=5002` in `backend/.env` and update `frontend/src/services/api.js`.

### Q2: Blueprint generation says "AI rate limit exceeded" or falls back
- **Solution**: Verify your `GEMINI_API_KEY` or `GROQ_API_KEY` in `backend/.env`. BuildForge AI includes automated fallback logic that seamlessly routes across Gemini, Groq, and OpenAI.

### Q3: How do I export the blueprint offline?
- **Solution**: Click the **`📄 Export PDF`** button located in the top navigation bar or at the bottom of the blueprint page to download the multi-page specification.

---

## 📄 License

This project is licensed under the **ISC License**. Open-source and enterprise ready. Built with ❤️ for developers worldwide.
