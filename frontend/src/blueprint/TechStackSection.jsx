import { motion } from "framer-motion";

const techIcons = {
  React: "⚛️",
  "React 19 / Vite": "⚛️",
  "Next.js": "▲",
  Vue: "💚",
  Angular: "🅰️",
  "TailwindCSS / CSS": "🎨",
  Tailwind: "🎨",
  TailwindCSS: "🎨",
  "Framer Motion": "✨",
  Axios: "📡",

  "Node.js": "🟢",
  "Node.js & Express 5": "🟢",
  Express: "🚀",
  NestJS: "🪺",
  FastAPI: "⚡",
  Python: "🐍",
  Django: "🎸",
  Go: "🐹",
  Rust: "🦀",

  MongoDB: "🍃",
  "MongoDB / PostgreSQL": "🍃",
  PostgreSQL: "🐘",
  MySQL: "🗄️",
  Redis: "⚡",
  Prisma: "🔷",
  Mongoose: "🍃",

  JWT: "🔐",
  "JWT & Bcrypt": "🔐",
  "JWT & OAuth2 SSO": "🛡️",
  OAuth: "🛡️",
  Bcrypt: "🔒",

  "Google Gemini & Groq": "🤖",
  "Gemini & Groq": "🤖",
  Gemini: "🤖",
  OpenAI: "🧠",
  Groq: "⚡",
  LangChain: "🦜",

  Cloudinary: "📦",
  "Cloudinary / AWS S3": "📦",
  "AWS S3": "🪣",
  Firebase: "🔥",

  Docker: "🐳",
  "Docker & Docker Compose": "🐳",
  "Docker & GitHub Actions": "🐳",
  Kubernetes: "☸️",
  "GitHub Actions": "🔄",

  Vercel: "▲",
  "Vercel & Render": "☁️",
  "Vercel / Render": "☁️",
  Render: "🚀",
  AWS: "☁️",
  "AWS ECS": "☁️",

  Jest: "🧪",
  "Jest & Supertest": "🧪",
  Supertest: "🧪",
  Cypress: "✅",
  Playwright: "🎭",

  Prometheus: "📈",
  "Prometheus & Winston": "📈",
  Grafana: "📉",
  Winston: "📝",
  Morgan: "📊",

  TypeScript: "📘",
  ESLint: "🔍",
  "ESLint & Prettier": "✨",
  Prettier: "💅",
  GraphQL: "🕸️",
  WebSocket: "⚡",
};

const normalizeTechStack = (stack) => {
  if (!stack) return {};
  if (Array.isArray(stack)) {
    return { frontend: stack };
  }
  return stack;
};

const getName = (item) => {
  if (typeof item === "string") return item;
  if (typeof item === "object" && item !== null) {
    return item.name || item.title || "Technology";
  }
  return "Technology";
};

const getPurpose = (item) => {
  if (!item || typeof item !== "object") return "Core architectural runtime component";
  return item.purpose || item.description || item.reason || "Core architectural runtime component";
};

const getWhy = (item) => {
  if (!item || typeof item !== "object") return "";
  return item.whyRecommended || "";
};

function TechStackSection({ project }) {
  if (!project) return null;

  const techStack = normalizeTechStack(
    project.technologyStack || project.techStack
  );

  const categories = [
    { title: "Frontend Client Tier", key: "frontend", icon: "💻" },
    { title: "Backend API & Services", key: "backend", icon: "⚙️" },
    { title: "Database & In-Memory Cache", key: "database", icon: "🗄️" },
    { title: "Authentication & Security", key: "authentication", icon: "🛡️" },
    { title: "AI & Intelligence Engines", key: "ai", icon: "🤖" },
    { title: "Storage & Media Assets", key: "storage", icon: "📦" },
    { title: "Cloud Hosting & Edge CDN", key: "deployment", icon: "☁️" },
    { title: "DevOps & CI/CD Pipelines", key: "devops", icon: "🔄" },
    { title: "Testing & Quality Assurance", key: "testing", icon: "🧪" },
    { title: "Monitoring, APM & Logging", key: "monitoring", icon: "📈" },
    { title: "Development Tooling & Linting", key: "devTools", icon: "🛠️" },
  ];

  return (
    <section className="blueprint-card tech-section" id="TechStack">
      <div className="section-heading">
        <div className="section-badge">⚡ TECHNOLOGY STACK</div>
        <h2>AI Recommended Production Stack</h2>
        <p>
          A curated technology stack selected based on your system's architecture, scalability, security, developer velocity, and operational performance. Every technology is production-tested and enterprise-ready.
        </p>
      </div>

      {categories.map((category) => {
        const list = techStack?.[category.key];
        if (!Array.isArray(list) || list.length === 0) return null;

        return (
          <div key={category.key} className="tech-category">
            <h3 className="tech-category-title">
              <span style={{ marginRight: "8px" }}>{category.icon}</span>
              {category.title}
            </h3>

            <div className="tech-stack-grid">
              {list.map((item, index) => {
                const name = getName(item);
                const purpose = getPurpose(item);
                const why = getWhy(item);

                return (
                  <motion.div
                    key={`${name}-${index}`}
                    className="tech-pro-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.03 }}
                  >
                    <div className="tech-card-top">
                      <div className="tech-icon">{techIcons[name] || "⚙️"}</div>
                      <div className="tech-status">Production Ready</div>
                    </div>

                    <h4>{name}</h4>
                    <p className="tech-purpose">{purpose}</p>

                    {why && (
                      <div className="tech-why">
                        <strong>Why Selected:</strong> {why}
                      </div>
                    )}

                    <div className="tech-footer">
                      <span className="tech-chip">⚡ Verified Compatibility</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default TechStackSection;