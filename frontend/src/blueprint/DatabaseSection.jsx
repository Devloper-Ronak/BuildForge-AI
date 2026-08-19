import { motion } from "framer-motion";

/* ================= SAFE HELPERS ================= */

const safeText = (value, fallback = "") => {
  if (value == null) return fallback;

  if (typeof value === "string" || typeof value === "number") {
    return String(value).trim() || fallback;
  }

  if (Array.isArray(value)) {
    return value.map(v => safeText(v)).filter(Boolean).join(", ") || fallback;
  }

  if (typeof value === "object") {
    return (
      value.title ||
      value.name ||
      value.collection ||
      value.description ||
      value.summary ||
      fallback
    );
  }

  return fallback;
};

/* ================= NORMALIZER ================= */

function normalizeDatabase(project) {
  if (!project) return [];

  if (Array.isArray(project.databaseDesign))
    return project.databaseDesign;

  if (Array.isArray(project.database))
    return project.database;

  if (Array.isArray(project.database?.collections))
    return project.database.collections;

  if (Array.isArray(project.collections))
    return project.collections;

  return [];
}

export default function DatabaseSection({ project }) {
  if (!project) return null;

  const collections = normalizeDatabase(project);
  if (collections.length === 0) return null;

  return (
    <section className="blueprint-card database-section" id="DatabaseSchema">
      {/* Heading */}
      <div className="section-heading">
        <div className="section-badge">🗄 DATABASE DESIGN</div>
        <h2>AI Generated Database Schema</h2>
        <p>
          A production-ready database schema automatically generated with optimized collections, relationships, indexing strategies, validation rules, and scalable document structures.
        </p>
      </div>

      {/* Collections Grid */}
      <div className="database-grid">
        {collections.map((collection, index) => {
          const colName = safeText(
            collection.collection || collection.name || collection.title,
            `Collection ${index + 1}`
          );
          const colType = safeText(collection.type, "Document Collection");
          const colPurpose = safeText(collection.purpose || collection.description, "Primary domain datastore entity.");
          const fields = Array.isArray(collection.fields) ? collection.fields : [];
          const indexes = Array.isArray(collection.indexes) ? collection.indexes : [];
          const relationships = safeText(collection.relationships);

          return (
            <motion.div
              key={`${colName}-${index}`}
              className="database-pro-card"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="database-top">
                <div className="database-icon">🗂️</div>
                <div className="database-number">{String(index + 1).padStart(2, "0")}</div>
              </div>

              <h3>{colName}</h3>
              <span className="database-type">🗃 {colType}</span>
              <p>{colPurpose}</p>

              {/* Relationships */}
              {relationships && (
                <div className="database-relationship">
                  <strong>🔗 Relationships:</strong>
                  <p>{relationships}</p>
                </div>
              )}

              {/* Fields */}
              {fields.length > 0 && (
                <div className="database-fields">
                  <strong style={{ fontSize: "0.85rem", color: "#a5b4fc", display: "block", marginBottom: "8px" }}>
                    Schema Fields ({fields.length}):
                  </strong>
                  {fields.map((field, i) => (
                    <div key={field.name || i} className="field-item">
                      <div className="field-header">
                        <strong>{safeText(field.name)}</strong>
                        <span style={{ color: "#818cf8" }}>{safeText(field.type)}</span>
                      </div>

                      <p>{safeText(field.description)}</p>

                      {field.required && <div className="required-tag">Required</div>}
                    </div>
                  ))}
                </div>
              )}

              {/* Indexes */}
              {indexes.length > 0 && (
                <div className="database-indexes">
                  <strong>⚡ Query Indexes:</strong>
                  <ul>
                    {indexes.map((indexItem, i) => (
                      <li key={i}>{safeText(indexItem)}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sample Document */}
              {collection.sampleDocument && (
                <div className="database-sample">
                  <strong>📄 Sample JSON Document:</strong>
                  <pre className="database-json">
                    {JSON.stringify(collection.sampleDocument, null, 2)}
                  </pre>
                </div>
              )}

              {/* Footer */}
              <div className="database-footer">{fields.length} Fields Defined</div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}