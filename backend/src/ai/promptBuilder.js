// backend/src/ai/promptBuilder.js

export const buildPrompt = ({
    projectIdea,
    techStack = [],
    difficulty = "Intermediate",
}) => {
    const stackDescription = Array.isArray(techStack) && techStack.length > 0 ?
        JSON.stringify(techStack) :
        "Infer the best modern, scalable production technology stack for this project";

    return `
You are BuildForge AI, an elite principal enterprise software architect.

Your task is to transform the following software concept into a COMPLETE, PRODUCTION-READY, DEEPLY DETAILED SOFTWARE ARCHITECTURE BLUEPRINT.

PROJECT CONCEPT:
${projectIdea}

REQUESTED TECH STACK PREFERENCE:
${stackDescription}

DIFFICULTY LEVEL:
${difficulty}

ARCHITECTURAL RIGOR & GENERATION RULES

1. Analyze the project specifically with deep domain knowledge.
2. Provide concrete, technical, implementation-grade details — NEVER use placeholders, "TBD", "N/A", "etc.", "Not Available", or generic one-liners.
3. Every recommendation must explain WHY it is architecturally superior for this specific system.
4. Keep the entire blueprint internally consistent:
   - Database collections/tables must directly back the REST API endpoints.
   - REST API endpoints must power the core features.
   - Folder structure must match the chosen frontend and backend technologies.
   - Security and performance strategies must address the exact data flow and risk profile of this project.
5. All arrays must contain rich, fully-populated objects as specified below.
6. STRICT SCORING RULE - MANDATORY, FAILURE IF VIOLATED:
   - You MUST calculate realistic, stricter, DIFFERENT scores for every different projectIdea.
   - NEVER output 84/81/79/90/84/89/89/91 or 94/95/93/96/92/68/91/95 for all projects. That is FORBIDDEN.
   - Use this strict table:
     * Calculator / Portfolio / Weather / Converter / Landing Page = Overall 52-62, Security 35-48, Performance 60-69, Maintainability 62-71, Scalability 25-38, Complexity 14-27, Innovation 20-32, Business 30-42
     * Todo / Notes / Habit Tracker = Overall 63-70, Security 48-56, Performance 64-71, Maintainability 66-73, Scalability 38-50, Complexity 24-35, Innovation 28-38, Business 42-52
     * AI Resume Screening / ATS / Ranking / Hiring Platform = Overall 74-81, Security 68-76, Performance 70-78, Maintainability 73-80, Scalability 58-68, Complexity 62-72, Innovation 66-76, Business 70-80
     * E-Commerce / Shop / Marketplace = Overall 78-84, Security 72-80, Performance 74-82, Maintainability 76-84, Scalability 68-76, Complexity 70-78, Innovation 60-70, Business 80-86
     * Health / Finance / Real-time Collaboration / EdTech = Overall 72-83 with realistic values, never all 90+
   - Scores must vary by projectIdea length and keywords, so "Calculator" and "Scientific Calculator" are NOT identical.
7. REALISTIC PROJECT OVERVIEW RULE - MANDATORY:
   - projectName MUST be derived from "${projectIdea}" exactly, DO NOT invent random names. If user says "AI Automated Interview Management System", projectName MUST be "AI Automated Interview Management System" or "AI Automated Interview Management System Platform", NOT "HireFlow" or random.
   - projectGoal MUST be specific to "${projectIdea}" with concrete outcomes (e.g., for Resume Screening: "Automate parsing, extract skills, rank against JD, reduce screening time by 70%"). NEVER generic "Build a secure, scalable and user-friendly system...".
   - estimatedDuration MUST be realistic by complexity: Tiny (Calculator) = 3-5 Days, Small (Todo) = 1-2 Weeks, Medium (Resume Screening) = 4-6 Weeks, Large (E-Commerce) = 6-9 Weeks, Complex (Hospital) = 8-12 Weeks.
   - teamSize MUST be realistic: Tiny = 1 Developer, Small = 1-2 Developers, Medium = 2-3 Developers (1 Full-Stack + 1 AI/Backend), Large = 2-4 Developers, etc.
   - scalability and architecture MUST be realistic: Tiny = "Static hosting, no backend scaling", Small = "Single Node.js instance with indexed queries", Medium = "Stateless backend with Redis caching, single container with horizontal path".
   - industry and projectType MUST be detected from "${projectIdea}": Resume/Hire/ATS/Job/Interview -> HRTech & Talent Acquisition / AI-Powered Talent Matching Platform. Hospital/Health -> Healthcare. Shop/Store/Ecommerce -> E-Commerce. Finance/Bank -> FinTech. School/Learn/Course -> EdTech. Attend/Employee/Track -> Workforce Management.

REQUIRED JSON SCHEMA STRUCTURE


You MUST return a single JSON object with EXACTLY the following structure:

{
  "projectName": "Must be derived from '${projectIdea}' - NOT random",
  "tagline": "A concise, impactful value proposition statement for '${projectIdea}'",
  "projectDescription": "A comprehensive, multi-paragraph architectural overview explaining what '${projectIdea}' does, the problem it solves, and its high-level technical paradigm.",
  
  "projectOverview": {
    "problemStatement": "Detailed explanation of the exact real-world pain points for '${projectIdea}'",
    "proposedSolution": "Detailed technical solution for '${projectIdea}'",
    "projectGoal": "MUST be specific to '${projectIdea}' with measurable outcomes - NEVER generic 'Build a secure scalable system'",
    "industry": "Detected from '${projectIdea}' - e.g., HRTech, Healthcare, FinTech, E-Commerce, NOT always Enterprise SaaS",
    "projectType": "Detected from '${projectIdea}' - e.g., AI-Powered Talent Matching Platform for resume/interview projects",
    "difficulty": "${difficulty}",
    "estimatedDuration": "Realistic per complexity of '${projectIdea}' - Tiny 3-5 Days, Small 1-2 Weeks, Medium 4-6 Weeks, Large 6-9 Weeks",
    "teamSize": "Realistic per '${projectIdea}' - Tiny 1 Developer, Small 1-2, Medium 2-3, Large 2-4",
    "scalability": "Realistic for '${projectIdea}' - not always 'Horizontal auto-scaling with Kubernetes'",
    "architecture": "Realistic for '${projectIdea}' - Tiny=Client-Side, Small=Frontend+Simple REST, Medium=Modular Monolith with Controller-Service-Repository"
  },

  "executiveSummary": "Executive summary detailing business purpose for '${projectIdea}', target demographic, core technical workflows, cloud strategy, and expected operational impact.",

  "targetUsers": [
    {
      "title": "Specific User Persona Name for '${projectIdea}'",
      "description": "How they interact with the platform for '${projectIdea}', their key jobs-to-be-done, and permissions."
    },
    {
      "title": "Secondary User Persona for '${projectIdea}'",
      "description": "Their role, administrative functions, or automated consumer behavior for '${projectIdea}'."
    }
  ],

  "businessObjectives": [
    "Concrete, measurable business or technical goal 1 for '${projectIdea}'",
    "Concrete, measurable business or technical goal 2 for '${projectIdea}'",
    "Concrete, measurable business or technical goal 3 for '${projectIdea}'"
  ],

  "features": [
    {
      "id": 1,
      "name": "Specific Core Feature Name for '${projectIdea}'",
      "title": "Specific Core Feature Name for '${projectIdea}'",
      "description": "Comprehensive explanation of feature capability, workflow, and user experience for '${projectIdea}'.",
      "priority": "Critical|High|Medium|Low",
      "complexity": "High|Medium|Low",
      "estimatedTime": "e.g., 5-7 Days",
      "businessImpact": "Tangible business value for '${projectIdea}'",
      "technicalNotes": "Concrete technical implementation details for '${projectIdea}'"
    }
  ],

  "technologyStack": {
    "frontend": [
      { "name": "Technology Name for '${projectIdea}'", "purpose": "Specific role in UI/Client", "whyRecommended": "Why it's the ideal choice for '${projectIdea}'", "productionReady": true }
    ],
    "backend": [
      { "name": "Technology Name", "purpose": "Specific role in API/Services", "whyRecommended": "Why it's the ideal choice", "productionReady": true }
    ],
    "database": [
      { "name": "Technology Name", "purpose": "Data storage & caching", "whyRecommended": "Why it's the ideal choice", "productionReady": true }
    ],
    "authentication": [
      { "name": "Technology Name", "purpose": "Identity & access management", "whyRecommended": "Why it's the ideal choice", "productionReady": true }
    ],
    "ai": [
      { "name": "Technology Name", "purpose": "AI/ML processing & inference", "whyRecommended": "Why it's the ideal choice", "productionReady": true }
    ],
    "storage": [
      { "name": "Technology Name", "purpose": "Object & asset storage", "whyRecommended": "Why it's the ideal choice", "productionReady": true }
    ],
    "deployment": [
      { "name": "Technology Name", "purpose": "Cloud hosting & edge CDN", "whyRecommended": "Why it's the ideal choice", "productionReady": true }
    ],
    "devops": [
      { "name": "Technology Name", "purpose": "CI/CD & container orchestration", "whyRecommended": "Why it's the ideal choice", "productionReady": true }
    ],
    "testing": [
      { "name": "Technology Name", "purpose": "Unit, integration & E2E testing", "whyRecommended": "Why it's the ideal choice", "productionReady": true }
    ],
    "monitoring": [
      { "name": "Technology Name", "purpose": "Telemetry, APM & error logging", "whyRecommended": "Why it's the ideal choice", "productionReady": true }
    ],
    "devTools": [
      { "name": "Technology Name", "purpose": "Development tooling & linting", "whyRecommended": "Why it's the ideal choice", "productionReady": true }
    ]
  },

  "architecture": {
    "type": "Architecture Pattern Name specific to '${projectIdea}'",
    "style": "Architecture Pattern Name",
    "description": "Comprehensive explanation for '${projectIdea}' of how layers interact, separation of concerns, and boundaries.",
    "frontendArchitecture": "State management for '${projectIdea}', component tree design, SSR/SSG strategy, routing, and asset optimization.",
    "backendArchitecture": "Controller-Service-Repository pattern for '${projectIdea}', middleware pipeline, background workers, and RPC/REST design.",
    "databaseArchitecture": "Primary read/write distribution for '${projectIdea}', sharding, caching hierarchy, and transaction boundaries.",
    "authenticationFlow": "Session lifecycle for '${projectIdea}', OAuth2 SSO, JWT refresh/access token rotation, and RBAC authorization.",
    "requestFlow": "Step-by-step lifecycle for '${projectIdea}' from client DNS resolution to CDN, API gateway, rate limiter, service, database, and response.",
    "deploymentArchitecture": "Multi-stage Docker containers for '${projectIdea}', zero-downtime blue/green deployment, VPC networking, and secret management.",
    "scalingStrategy": "Auto-scaling policies for '${projectIdea}', database connection pooling, query caching, and asynchronous fanout.",
    "communication": "Synchronous HTTP/HTTPS REST alongside asynchronous WebSockets / message queues for '${projectIdea}'.",
    "components": [
      {
        "name": "Component / Microservice Name for '${projectIdea}'",
        "responsibility": "Exact domain responsibilities for '${projectIdea}'",
        "technology": "Specific technology / framework",
        "dependencies": ["List", "of", "dependencies"],
        "scalability": "How this component scales under load for '${projectIdea}'",
        "security": "Security controls applied to this component for '${projectIdea}'"
      }
    ],
    "dataFlow": [
      "1. Client initiates TLS 1.3 encrypted HTTPS request for '${projectIdea}' to Cloudflare Edge CDN",
      "2. Edge CDN checks cached static assets and routes API requests to Reverse Proxy / API Gateway for '${projectIdea}'",
      "3. API Gateway verifies rate limit tokens and authenticates JWT Bearer in Authorization header",
      "4. Request passes through validation middleware and routes to appropriate domain Service Controller for '${projectIdea}'",
      "5. Controller queries Redis cache for existing keys before delegating to Database Repository layer for '${projectIdea}'",
      "6. Database executes indexed query with ACID guarantees and returns domain entity model",
      "7. Service layer serializes response DTO and publishes asynchronous audit telemetry to worker queue",
      "8. API Gateway streams compressed JSON response back to client with HTTP 200 and ETag"
    ]
  },

  "databaseDesign": [
    {
      "collection": "Collection / Table Name for '${projectIdea}'",
      "name": "Collection / Table Name for '${projectIdea}'",
      "type": "Document Collection | Relational Table | Time-Series Store",
      "purpose": "What this collection stores and its role in business logic for '${projectIdea}'",
      "description": "Detailed explanation of data lifecycle and retention for '${projectIdea}'",
      "fields": [
        { "name": "field_name", "type": "String|ObjectId|Number|Boolean|Array|Object|Timestamp", "required": true, "description": "Specific field purpose and constraints for '${projectIdea}'" }
      ],
      "indexes": ["field_name_idx (Ascending)", "compound_idx (field1, field2_unique)"],
      "relationships": "One-to-Many with 'OtherCollection' via foreignKey for '${projectIdea}'; Many-to-Many via JoinTable",
      "sampleDocument": {
        "sampleKey": "sampleValue for '${projectIdea}'"
      }
    }
  ],

  "restApis": [
    {
      "name": "Descriptive Endpoint Name for '${projectIdea}'",
      "method": "GET|POST|PUT|PATCH|DELETE",
      "endpoint": "/api/v1/resource-path for '${projectIdea}'",
      "version": "v1",
      "description": "Clear explanation of what the endpoint does for '${projectIdea}'",
      "purpose": "Business logic fulfilled by this endpoint for '${projectIdea}'",
      "authentication": "Required (JWT Bearer Token) | Public | Admin Role Required",
      "authorization": "Role: 'user' | 'admin' | 'tenant-owner'",
      "headers": ["Authorization: Bearer <token>", "Content-Type: application/json"],
      "requestBody": {
        "field1": "string (required) - Description for '${projectIdea}'",
        "field2": "number (optional) - Description"
      },
      "request": {
        "body": { "field1": "example_value for '${projectIdea}'", "field2": 100 }
      },
      "successResponse": {
        "status": 200,
        "body": { "success": true, "data": { "id": "123", "result": "... for '${projectIdea}'" } }
      },
      "response": "{ success: true, data: { ... } }",
      "errorResponses": [
        { "code": 400, "status": "400 Bad Request", "message": "Validation failure on input parameters for '${projectIdea}'", "when": "Missing required fields" },
        { "code": 401, "status": "401 Unauthorized", "message": "Invalid or expired token", "when": "Missing or corrupted authorization header" },
        { "code": 404, "status": "404 Not Found", "message": "Resource with specified identifier does not exist for '${projectIdea}'", "when": "Invalid resource ID provided" }
      ]
    }
  ],

  "folderStructure": {
    "frontend": {
      "src": {
        "components": ["Navbar.jsx", "Sidebar.jsx", "DataGrid.jsx", "StatCard.jsx", "Modal.jsx"],
        "pages": ["Dashboard.jsx", "ProjectDetails.jsx", "Analytics.jsx", "Settings.jsx"],
        "services": ["api.js", "authService.js", "analyticsService.js"],
        "hooks": ["useAuth.js", "useFetch.js", "useDebounce.js"],
        "context": ["AuthContext.jsx", "ThemeContext.jsx"],
        "utils": ["formatters.js", "validators.js", "constants.js"]
      },
      "public": ["favicon.ico", "robots.txt", "logo.svg"]
    },
    "backend": {
      "src": {
        "config": ["database.js", "env.js", "redis.js"],
        "controllers": ["authController.js", "projectController.js", "analyticsController.js"],
        "middleware": ["authMiddleware.js", "rateLimiter.js", "errorHandler.js", "validator.js"],
        "models": ["User.js", "Project.js", "Analytics.js"],
        "routes": ["authRoutes.js", "projectRoutes.js", "analyticsRoutes.js"],
        "services": ["authService.js", "aiService.js", "emailService.js", "exportService.js"],
        "utils": ["tokenHelper.js", "apiResponse.js", "logger.js"]
      }
    }
  },

  "developmentRoadmap": [
    {
      "phase": "Phase 1: Project Architecture, Schema & Auth Infrastructure for '${projectIdea}'",
      "duration": "Weeks 1-2 realistic for '${projectIdea}'",
      "timeline": "Weeks 1-2",
      "goal": "Establish foundational database schemas, API scaffolding, security middleware, and auth flows for '${projectIdea}'.",
      "objectives": [
        "Initialize repo for '${projectIdea}' with TypeScript/ESLint/Prettier configuration",
        "Set up database models for '${projectIdea}', connection pooling, and migration pipelines",
        "Implement JWT authentication for '${projectIdea}' with refresh token rotation and bcrypt credential hashing"
      ],
      "tasks": [
        "Initialize repository structure and containerized Docker development environment for '${projectIdea}'",
        "Implement user registration, login, email verification, and password reset endpoints for '${projectIdea}'",
        "Create database collections/tables for '${projectIdea}' with primary keys, indexes, and foreign constraints",
        "Set up centralized error handling middleware and structured JSON logging for '${projectIdea}'"
      ],
      "deliverable": "Working authentication API for '${projectIdea}', database connectivity, and base routing test suite",
      "deliverables": [
        "Tested Auth REST API for '${projectIdea}' with 100% integration coverage",
        "Initialized database for '${projectIdea}' with seed scripts and migration tooling",
        "Base frontend layout for '${projectIdea}' with protected routes and state hydration"
      ]
    }
  ],

  "testingStrategy": {
    "unitTesting": ["Test suite for '${projectIdea}' auth utilities and token validation", "Test suite for '${projectIdea}' data model schemas and transformers", "Test suite for '${projectIdea}' business calculation and scoring algorithms"],
    "integrationTesting": ["Full lifecycle API integration tests for '${projectIdea}' CRUD workflows", "Database transaction rollback tests for '${projectIdea}' under failure scenarios", "Third-party webhook ingestion and signature validation tests for '${projectIdea}'"],
    "apiTesting": ["Postman / Newman automated regression suites across all endpoints for '${projectIdea}'", "Edge-case parameter fuzzing and payload size boundary checks for '${projectIdea}'"],
    "securityTesting": ["OWASP Top 10 vulnerability scans for '${projectIdea}' (SQLi, NoSQLi, XSS, SSRF)", "Rate limiting and brute force defense validation for '${projectIdea}'", "JWT tampering and privilege escalation tests for '${projectIdea}'"],
    "performanceTesting": ["Load testing with k6 simulating 5,000 concurrent virtual users for '${projectIdea}'", "Database query execution plan profiling with EXPLAIN ANALYZE for '${projectIdea}'", "Sub-100ms P95 latency validation under peak load for '${projectIdea}'"]
  },

  "deploymentStrategy": {
    "frontend": "Vercel / Cloudflare Pages edge network for '${projectIdea}' with automated CI/CD previews and global CDN caching",
    "backend": "Containerized Docker containers hosted on AWS ECS / Render / Kubernetes for '${projectIdea}' with horizontal pod auto-scaling",
    "database": "Managed MongoDB Atlas / AWS Aurora PostgreSQL for '${projectIdea}' with multi-AZ replication and automated daily snapshots",
    "ai": "Dedicated inference worker pool for '${projectIdea}' with Redis request queueing and streaming response pipelines",
    "environmentVariables": ["PORT", "NODE_ENV", "DATABASE_URL", "JWT_SECRET", "REDIS_URL", "AI_API_KEY", "CLIENT_URL"],
    "ciCdPipeline": "GitHub Actions workflow for '${projectIdea}' running linting, automated unit tests, Docker build, and zero-downtime deployment"
  },

  "security": [
    { "title": "End-to-End Transport Layer Security for '${projectIdea}'", "description": "Strict HTTPS enforcement with HSTS headers and TLS 1.3 encryption across all client and internal service communications for '${projectIdea}'." },
    { "title": "Zero-Trust JWT & Session Authentication for '${projectIdea}'", "description": "Stateless HMAC-SHA256 signed bearer tokens with short lifespans (15 mins) paired with secure HttpOnly refresh token cookies for '${projectIdea}'." },
    { "title": "Granular Role-Based Access Control (RBAC) for '${projectIdea}'", "description": "Declarative middleware authorization verifying user roles and tenant ownership on every protected endpoint for '${projectIdea}'." },
    { "title": "Comprehensive Request Validation & Sanitization for '${projectIdea}'", "description": "Schema-enforced input validation using express-validator/Zod with strict HTML escaping to eliminate XSS and injection attacks for '${projectIdea}'." },
    { "title": "Adaptive Sliding-Window Rate Limiting for '${projectIdea}'", "description": "IP and user-based throttling via Redis rate limiters to shield endpoints for '${projectIdea}' from DDoS, credential stuffing, and scraping." },
    { "title": "Encrypted Secrets & Credentials Management for '${projectIdea}'", "description": "Secure vault injection for API keys and database credentials with zero plaintext exposure in source control for '${projectIdea}'." },
    { "title": "Immutable Audit Logging & Telemetry for '${projectIdea}'", "description": "Centralized logging of sensitive administrative events, permission changes, and security exceptions for '${projectIdea}'." },
    { "title": "CORS & HTTP Security Headers for '${projectIdea}'", "description": "Helmet-hardened HTTP headers including Content-Security-Policy, X-Frame-Options: DENY, and restricted CORS origins for '${projectIdea}'." }
  ],

  "performanceOptimization": [
    "Multi-layer caching strategy for '${projectIdea}' utilizing Redis for frequently queried entities and HTTP cache-control for static assets",
    "Comprehensive database index strategy for '${projectIdea}' with compound indexes covering all filtered and sorted query paths",
    "Cursor-based pagination across all list endpoints for '${projectIdea}' to eliminate memory bloat and guarantee constant-time queries",
    "Asynchronous background worker queues for '${projectIdea}' for heavyweight tasks (email dispatch, PDF generation, AI processing)",
    "Gzip / Brotli payload compression on all HTTP responses for '${projectIdea}' reducing network transfer payload by over 70%",
    "Database connection pooling for '${projectIdea}' with auto-reconnect and health-checked keep-alive pingers",
    "Frontend code splitting for '${projectIdea}', dynamic route imports, and WebP image optimization for sub-second First Contentful Paint",
    "Connection keep-alive and HTTP/2 multiplexing for accelerated concurrent API requests for '${projectIdea}'"
  ],

  "bestPractices": [
    "Domain-Driven Design (DDD) for '${projectIdea}' with clean separation of Controllers, Services, Repositories, and DTOs",
    "Strict semantic versioning on all REST API endpoints (/api/v1/...) for '${projectIdea}' with backward compatibility contracts",
    "Consistent, structured API response envelope format for '${projectIdea}': { success, message, data, error, timestamp }",
    "100% automated CI/CD testing gate for '${projectIdea}' enforcing build success before production merge",
    "Infrastructure as Code (IaC) for '${projectIdea}' using Dockerfile and Docker Compose for reproducible local and cloud environments",
    "Comprehensive error handling for '${projectIdea}' with specific HTTP status codes and non-leaking production error messages",
    "Strict type checking and linting standards for '${projectIdea}' enforced via ESLint and Prettier pre-commit hooks",
    "Automated disaster recovery protocol for '${projectIdea}' with daily encrypted database backups and point-in-time recovery"
  ],

  "futureEnhancements": [
    "Vector search integration with embeddings for semantic AI discovery and intelligent auto-suggestions for '${projectIdea}'",
    "Real-time collaborative workspaces with live multi-user cursor sync via WebSockets for '${projectIdea}'",
    "Native mobile application clients for iOS and Android built with React Native / Flutter for '${projectIdea}'",
    "Enterprise SAML 2.0 / Okta SSO integration for seamless corporate identity federation for '${projectIdea}'",
    "Automated multi-region active-active database clustering for zero-downtime global failover for '${projectIdea}'",
    "Custom webhook developer platform allowing third-party services to subscribe to platform lifecycle events for '${projectIdea}'",
    "Advanced AI workflow automation engine with custom trigger-action recipe builders for '${projectIdea}'",
    "Comprehensive audit logging compliance module satisfying SOC2 Type II and GDPR requirements for '${projectIdea}'"
  ],

  "deploymentChecklist": [
    "Configure production environment variables and cryptographic secrets for '${projectIdea}' in cloud dashboard",
    "Provision production database for '${projectIdea}' with automated multi-AZ replication and backup schedules",
    "Establish Redis cache cluster for '${projectIdea}' with persistence and eviction policy configuration",
    "Set up SSL/TLS certificates for '${projectIdea}' with auto-renewal and DNS propagation via Cloudflare",
    "Deploy backend Docker containers for '${projectIdea}' and verify health check endpoints respond with HTTP 200",
    "Deploy frontend SPA for '${projectIdea}' to edge CDN and configure SPA route rewrites for client router",
    "Run automated end-to-end smoke test suite for '${projectIdea}' against staging and production environments",
    "Configure uptime monitors, error alert webhooks (Sentry / Datadog), and on-call notifications for '${projectIdea}'"
  ],

  "risks": [
    {
      "risk": "Third-Party Service & AI Rate Limiting / Latency for '${projectIdea}'",
      "impact": "High — External API downtime or rate limit breaches could stall workflows for '${projectIdea}'.",
      "mitigation": "Implement exponential backoff retries, multi-provider fallback chains, and aggressive local Redis caching for '${projectIdea}'."
    },
    {
      "risk": "Database Bottlenecks Under High Concurrency for '${projectIdea}'",
      "impact": "High — Slow queries could exhaust connection pools and degrade response times for '${projectIdea}'.",
      "mitigation": "Enforce strict compound query indexing, connection pooling, and read-replica offloading for read-heavy operations for '${projectIdea}'."
    },
    {
      "risk": "Unauthorized Data Access & Multi-Tenant Data Leakage for '${projectIdea}'",
      "impact": "Critical — Security breach resulting in compliance penalties and loss of customer trust for '${projectIdea}'.",
      "mitigation": "Enforce tenant-level scoping on all database queries and validate RBAC permissions in centralized middleware for '${projectIdea}'."
    },
    {
      "risk": "Rapid Scope Creep During Initial Implementation for '${projectIdea}'",
      "impact": "Medium — Potential timeline delays and fragmented architectural focus for '${projectIdea}'.",
      "mitigation": "Strictly prioritize Phase 1 & 2 MVP deliverables for '${projectIdea}' before expanding to Phase 3 & 4 advanced capabilities."
    },
    {
      "risk": "Heavyweight Export & Document Generation Resource Spikes for '${projectIdea}'",
      "impact": "Medium — CPU spikes during simultaneous PDF/file exports could degrade API responsiveness for '${projectIdea}'.",
      "mitigation": "Offload document generation to background worker threads using streaming pipelines and worker pools for '${projectIdea}'."
    },
    {
      "risk": "Cold Starts & Microservices Network Latency for '${projectIdea}'",
      "impact": "Low — Slight initial response latency on scale-from-zero serverless containers for '${projectIdea}'.",
      "mitigation": "Maintain warm min-instance pools for '${projectIdea}' on critical services and utilize lightweight Alpine Linux container base images."
    }
  ],

  "projectInsights": {
    "overallScore": 0,
    "securityScore": 0,
    "performanceScore": 0,
    "maintainabilityScore": 0,
    "scalabilityScore": 0,
    "complexityScore": 0,
    "innovationScore": 0,
    "businessPotential": 0
  },

  "projectActions": {
    "canExportPDF": true,
    "canSave": true,
    "canShare": true,
    "canCopy": true
  }
}

CRITICAL FINAL INSTRUCTIONS

- Return ONLY the single valid JSON object for '${projectIdea}' - DO NOT return example or placeholder.
- CRITICAL: projectName MUST contain words from '${projectIdea}' - e.g., if idea is "AI Automated Interview Management System", projectName MUST be "AI Automated Interview Management System Platform", NOT random name.
- CRITICAL: projectOverview.projectGoal MUST be SPECIFIC to '${projectIdea}' - e.g., for Interview System: "Automate interview scheduling, candidate screening, feedback collection, reduce hiring time by 60% with AI scoring and video interview analysis" - NEVER generic "Build a secure, scalable and user-friendly system...".
- CRITICAL: projectOverview.estimatedDuration, teamSize, scalability, architecture MUST be REALISTIC for '${projectIdea}' - use 3-5 Days for calculator, 1-2 Weeks for todo, 4-6 Weeks for Resume/Interview Screening, 6-9 Weeks for E-Commerce.
- CRITICAL: projectOverview.industry and projectType MUST be detected from '${projectIdea}' - Interview/Resume/Hire/ATS/Job -> HRTech & Talent Acquisition + AI-Powered Talent Matching Platform. NOT always Enterprise SaaS + Full-Stack Web App.
- CRITICAL: projectInsights scores MUST be calculated per STRICT SCORING RULE above - NEVER same 84/81/79/90/84/89/89/91 for every project. Calculator = low 50s-60s, Resume Screening = 74-81, E-Commerce = 78-84.
- Do not output markdown backticks (\`\`\`json or \`\`\`).
- Ensure all property names and values are enclosed in valid double quotes.
- Verify that every section is deeply customized to '${projectIdea}' and nothing is generic.
`;
};

export default buildPrompt;