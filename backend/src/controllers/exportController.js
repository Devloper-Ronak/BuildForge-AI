// backend/src/controllers/exportController.js

import PDFDocument from "pdfkit";
import { getUserProjectById } from "../services/projectService.js";
import { errorResponse } from "../utils/apiResponse.js";

/* =========================================================
   CLEAN ASCII SANITIZER (ZERO EMOJI / UNICODE CORRUPTION)
========================================================= */

const sanitizePdfText = (input, fallback = "") => {
    if (input === null || input === undefined) {
        return fallback;
    }

    let str = "";
    if (typeof input === "string") {
        str = input;
    } else if (typeof input === "number" || typeof input === "boolean") {
        str = String(input);
    } else if (Array.isArray(input)) {
        str = input.map((v) => sanitizePdfText(v)).filter(Boolean).join(", ");
    } else if (typeof input === "object") {
        str = input.description || input.summary || input.name || input.title || input.text || "";
    } else {
        str = String(input);
    }

    // Replace common Unicode typographic symbols with clean ASCII
    str = str
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[\u2013\u2014]/g, "-")
        .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, "-")
        .replace(/[\u25B6\u25BA\u27A4]/g, ">")
        .replace(/[\u2713\u2714\u2611]/g, "[OK]")
        .replace(/[\u26A0\u26A1\u2699\u2705\u274C\u2728\u26A0\uFE0F]/g, "")
        // Strip any remaining emojis or non-ASCII characters
        .replace(/[^\x20-\x7E\r\n\t]/g, "")
        .trim();

    return str || fallback;
};

const safeArray = (value) => (Array.isArray(value) ? value : []);
const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

const safeFilename = (name) => {
    return (
        String(name || "BuildForge-Blueprint")
            .replace(/[^a-z0-9-_]+/gi, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 80) || "BuildForge-Blueprint"
    );
};

/* =========================================================
   PAGE CHECK HELPER
========================================================= */

const checkPageSpace = (doc, neededHeight = 80) => {
    if (doc.y + neededHeight > 740) {
        doc.addPage();
        doc.y = 55;
    }
};

/* =========================================================
   RECURSIVE TREE FLATTENER FOR PDF FOLDER STRUCTURE
========================================================= */

const flattenFolderTree = (node, depth = 0) => {
    const lines = [];

    if (Array.isArray(node)) {
        node.forEach((file) => {
            if (typeof file === "string") {
                lines.push({ type: "file", name: file, depth });
            } else if (typeof file === "object" && file !== null) {
                lines.push(...flattenFolderTree(file, depth));
            }
        });
    } else if (typeof node === "object" && node !== null) {
        Object.entries(node).forEach(([key, val]) => {
            if (key === "root" && Array.isArray(val)) {
                val.forEach((file) => {
                    lines.push({ type: "file", name: String(file), depth });
                });
            } else if (Array.isArray(val)) {
                lines.push({ type: "dir", name: key, depth });
                val.forEach((file) => {
                    if (typeof file === "object" && file !== null) {
                        lines.push(...flattenFolderTree(file, depth + 1));
                    } else {
                        lines.push({ type: "file", name: String(file), depth: depth + 1 });
                    }
                });
            } else if (typeof val === "object" && val !== null) {
                lines.push({ type: "dir", name: key, depth });
                lines.push(...flattenFolderTree(val, depth + 1));
            } else {
                lines.push({ type: "file", name: `${key}: ${val}`, depth });
            }
        });
    }

    return lines;
};

/* =========================================================
   STYLING PRIMITIVES
========================================================= */

const drawSectionHeading = (doc, title, badge = "SECTION") => {
    checkPageSpace(doc, 70);
    doc.moveDown(0.5);

    const currentY = doc.y;

    // Small Badge
    doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor("#4f46e5")
        .text(badge.toUpperCase(), 50, currentY, { characterSpacing: 1 });

    doc.moveDown(0.2);

    // Main Section Title
    doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .fillColor("#0f172a")
        .text(title, 50);

    // Accent Underline Rule
    const lineY = doc.y + 4;
    doc
        .strokeColor("#e2e8f0")
        .lineWidth(1)
        .moveTo(50, lineY)
        .lineTo(545, lineY)
        .stroke();

    doc
        .strokeColor("#4f46e5")
        .lineWidth(2.5)
        .moveTo(50, lineY)
        .lineTo(110, lineY)
        .stroke();

    doc.y = lineY + 12;
};

/* =========================================================
   GENERATE FULL ENTERPRISE BLUEPRINT PDF STREAM
========================================================= */

export const generateBlueprintPdfStream = (res, rawBlueprint, idea) => {
    try {
        const blueprint =
            rawBlueprint &&
            typeof rawBlueprint === "object" &&
            rawBlueprint.project &&
            typeof rawBlueprint.project === "object"
                ? rawBlueprint.project
                : rawBlueprint || {};

        const projectName = sanitizePdfText(
            blueprint.projectName || rawBlueprint.projectName || idea,
            "BuildForge Architecture Project"
        );

        const filename = safeFilename(projectName);

        const doc = new PDFDocument({
            size: "A4",
            margins: {
                top: 50,
                bottom: 50,
                left: 50,
                right: 50,
            },
            bufferPages: true,
            info: {
                Title: `${projectName} - Complete Architectural Blueprint`,
                Author: "BuildForge AI",
                Subject: "Enterprise Software Architecture Specification",
                Keywords: "Architecture, REST APIs, Database Design, Roadmap, Folder Structure, Security, BuildForge AI",
            },
        });

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}.pdf"`);
        res.setHeader("Cache-Control", "no-store");

        doc.pipe(res);

        /* =================================================
           1. COVER PAGE
        ================================================= */

        // Header Background Banner
        doc.rect(0, 0, 595, 130).fill("#0f172a");

        // Accent Gradient-like strip
        doc.rect(0, 126, 595, 4).fill("#4f46e5");

        // Header Brand Title
        doc
            .font("Helvetica-Bold")
            .fontSize(22)
            .fillColor("#ffffff")
            .text("BUILDFORGE AI", 50, 42, { characterSpacing: 1.5 });

        doc
            .font("Helvetica")
            .fontSize(9.5)
            .fillColor("#94a3b8")
            .text("ENTERPRISE SOFTWARE ARCHITECTURAL BLUEPRINT", 50, 72, { characterSpacing: 1 });

        doc
            .font("Helvetica")
            .fontSize(8)
            .fillColor("#cbd5e1")
            .text(`Generated: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} | Production-Ready Architecture Specification`, 50, 94);

        // Project Title & Tagline Area
        doc.y = 155;

        doc
            .font("Helvetica-Bold")
            .fontSize(22)
            .fillColor("#0f172a")
            .text(projectName, 50, doc.y, { width: 495, lineGap: 3 });

        if (blueprint.tagline) {
            doc.moveDown(0.2);
            doc
                .font("Helvetica-Oblique")
                .fontSize(10.5)
                .fillColor("#4f46e5")
                .text(sanitizePdfText(blueprint.tagline), { width: 495, lineGap: 2 });
        }

        doc.moveDown(0.6);

        // 4-Card Metadata Grid
        const gridTop = doc.y;
        const colWidth = 240;
        const rowHeight = 44;

        const overview = blueprint.projectOverview || {};
        const metaItems = [
            { label: "DIFFICULTY LEVEL", val: sanitizePdfText(blueprint.difficulty || overview.difficulty, "Intermediate") },
            { label: "ESTIMATED TIMELINE", val: sanitizePdfText(blueprint.estimatedDuration || blueprint.duration || overview.estimatedDuration, "6-8 Weeks") },
            { label: "TEAM ALLOCATION", val: sanitizePdfText(blueprint.estimatedTeamSize || blueprint.teamSize || overview.teamSize, "2-4 Engineers") },
            { label: "INDUSTRY DOMAIN", val: sanitizePdfText(blueprint.industry || overview.industry, "Enterprise SaaS") },
        ];

        metaItems.forEach((item, idx) => {
            const col = idx % 2;
            const row = Math.floor(idx / 2);
            const x = 50 + col * (colWidth + 15);
            const y = gridTop + row * (rowHeight + 10);

            // Card box
            doc
                .roundedRect(x, y, colWidth, rowHeight, 6)
                .fillAndStroke("#f8fafc", "#e2e8f0");

            doc
                .font("Helvetica-Bold")
                .fontSize(7.5)
                .fillColor("#64748b")
                .text(item.label, x + 10, y + 8, { characterSpacing: 0.5 });

            doc
                .font("Helvetica-Bold")
                .fontSize(9.5)
                .fillColor("#0f172a")
                .text(item.val, x + 10, y + 22, { width: colWidth - 20, ellipsis: true });
        });

        doc.y = gridTop + 2 * (rowHeight + 10) + 15;

        // Executive Summary Callout Box
        const execSummary = sanitizePdfText(
            blueprint.executiveSummary || blueprint.projectDescription || blueprint.overview || blueprint.description
        );

        if (execSummary) {
            const boxY = doc.y;
            const boxHeight = 140;

            doc
                .roundedRect(50, boxY, 495, boxHeight, 8)
                .fillAndStroke("#f8fafc", "#e2e8f0");

            // Left colored indicator bar
            doc.roundedRect(50, boxY, 4, boxHeight, 2).fill("#4f46e5");

            doc
                .font("Helvetica-Bold")
                .fontSize(10)
                .fillColor("#0f172a")
                .text("EXECUTIVE ARCHITECTURAL SUMMARY", 65, boxY + 12);

            doc
                .font("Helvetica")
                .fontSize(8.5)
                .fillColor("#334155")
                .text(execSummary, 65, boxY + 28, {
                    width: 465,
                    lineGap: 2,
                    height: boxHeight - 38,
                    ellipsis: true,
                });

            doc.y = boxY + boxHeight + 15;
        }

        // Target Users & Stakeholders (Full List)
        const users = safeArray(blueprint.targetUsers);
        if (users.length > 0) {
            checkPageSpace(doc, 70);
            doc
                .font("Helvetica-Bold")
                .fontSize(9.5)
                .fillColor("#0f172a")
                .text("TARGET AUDIENCE & SYSTEM ACTORS:", 50, doc.y);

            doc.moveDown(0.3);

            users.forEach((u) => {
                checkPageSpace(doc, 18);
                let uTitle = "";
                let uDesc = "";

                if (typeof u === "string") {
                    if (u.includes(":")) {
                        const parts = u.split(":");
                        uTitle = sanitizePdfText(parts[0]);
                        uDesc = sanitizePdfText(parts.slice(1).join(":"));
                    } else {
                        uTitle = sanitizePdfText(u);
                        uDesc = "Interacts with core platform capabilities.";
                    }
                } else if (isObject(u)) {
                    uTitle = sanitizePdfText(u.title || u.name || u.role, "User Persona");
                    uDesc = sanitizePdfText(u.description || u.details || u.summary, "");
                }

                doc
                    .font("Helvetica-Bold")
                    .fontSize(8.5)
                    .fillColor("#4f46e5")
                    .text(`- ${uTitle}: `, 55, doc.y, { continued: !!uDesc })
                    .font("Helvetica")
                    .fillColor("#475569")
                    .text(uDesc, { lineGap: 1.5 });
                doc.moveDown(0.15);
            });
        }

        /* =================================================
           2. PROJECT OVERVIEW & PROBLEM / SOLUTION
        ================================================= */
        doc.addPage();
        drawSectionHeading(doc, "Project Overview & Strategic Goals", "FOUNDATION");

        const probStmt = sanitizePdfText(
            overview.problemStatement || blueprint.problemStatement,
            "Legacy systems and fragmented tooling create severe operational friction and high maintenance costs."
        );

        const propSol = sanitizePdfText(
            overview.proposedSolution || blueprint.proposedSolution || blueprint.solution,
            "An integrated, cloud-native architecture combining scalable APIs, reactive UI, and robust data persistence."
        );

        // Problem Card (Red accent)
        checkPageSpace(doc, 85);
        let currentY = doc.y;
        doc.roundedRect(50, currentY, 495, 70, 6).fillAndStroke("#fef2f2", "#fecaca");
        doc.roundedRect(50, currentY, 4, 70, 2).fill("#ef4444");

        doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#991b1b").text("[PROBLEM STATEMENT]", 64, currentY + 10);
        doc.font("Helvetica").fontSize(8.5).fillColor("#450a0a").text(probStmt, 64, currentY + 24, { width: 465, lineGap: 2 });

        doc.y = currentY + 80;

        // Solution Card (Green accent)
        checkPageSpace(doc, 85);
        currentY = doc.y;
        doc.roundedRect(50, currentY, 495, 70, 6).fillAndStroke("#f0fdf4", "#bbf7d0");
        doc.roundedRect(50, currentY, 4, 70, 2).fill("#16a34a");

        doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#166534").text("[PROPOSED ARCHITECTURAL SOLUTION]", 64, currentY + 10);
        doc.font("Helvetica").fontSize(8.5).fillColor("#052e16").text(propSol, 64, currentY + 24, { width: 465, lineGap: 2 });

        doc.y = currentY + 85;

        // Strategic Business Objectives
        const objectives = safeArray(blueprint.businessObjectives);
        if (objectives.length > 0) {
            checkPageSpace(doc, 65);
            doc.font("Helvetica-Bold").fontSize(10.5).fillColor("#0f172a").text("Strategic Business & Technical Objectives", 50, doc.y);
            doc.moveDown(0.3);

            objectives.forEach((obj) => {
                checkPageSpace(doc, 20);
                let objStr = "";
                if (typeof obj === "string") {
                    objStr = sanitizePdfText(obj);
                } else if (isObject(obj)) {
                    objStr = sanitizePdfText(obj.title || obj.objective || obj.description || obj.name);
                }

                if (objStr) {
                    doc
                        .font("Helvetica")
                        .fontSize(8.5)
                        .fillColor("#334155")
                        .text(`-  ${objStr}`, 55, doc.y, { width: 480, lineGap: 2 });
                    doc.moveDown(0.15);
                }
            });
        }

        /* =================================================
           3. CORE PRODUCT FEATURES (ALL FEATURES)
        ================================================= */
        drawSectionHeading(doc, "Core Architectural & Product Features", "CAPABILITIES");

        const features = safeArray(blueprint.features);
        features.forEach((feat, idx) => {
            checkPageSpace(doc, 85);

            const cardY = doc.y;
            const priority = sanitizePdfText(feat.priority, "High").toUpperCase();
            let pBg = "#e0e7ff";
            let pText = "#3730a3";
            let pBorder = "#c7d2fe";

            if (priority === "CRITICAL") {
                pBg = "#fee2e2";
                pText = "#b91c1c";
                pBorder = "#fca5a5";
            } else if (priority === "HIGH") {
                pBg = "#fef3c7";
                pText = "#b45309";
                pBorder = "#fcd34d";
            } else if (priority === "LOW") {
                pBg = "#dcfce7";
                pText = "#15803d";
                pBorder = "#86efac";
            }

            // Feature Card Box
            doc.roundedRect(50, cardY, 495, 76, 6).fillAndStroke("#f8fafc", "#e2e8f0");

            // Numbered Circle
            doc.circle(68, cardY + 20, 10).fillAndStroke("#4f46e5", "#4f46e5");
            doc.font("Helvetica-Bold").fontSize(8).fillColor("#ffffff").text(String(idx + 1), 64, cardY + 16);

            // Title
            const featTitle = sanitizePdfText(feat.name || feat.title, `Feature ${idx + 1}`);
            doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text(featTitle, 86, cardY + 12, { width: 330 });

            // Priority Pill
            doc.roundedRect(440, cardY + 10, 90, 16, 8).fillAndStroke(pBg, pBorder);
            doc.font("Helvetica-Bold").fontSize(7).fillColor(pText).text(priority, 440, cardY + 14, { width: 90, align: "center" });

            // Description
            doc.font("Helvetica").fontSize(8).fillColor("#475569").text(sanitizePdfText(feat.description), 86, cardY + 28, { width: 440, height: 22, lineGap: 1.5, ellipsis: true });

            // Impact & Technical notes
            doc
                .font("Helvetica-Bold")
                .fontSize(7.5)
                .fillColor("#0f172a")
                .text("Business Impact: ", 86, cardY + 52, { continued: true })
                .font("Helvetica")
                .fillColor("#334155")
                .text(sanitizePdfText(feat.businessImpact, "Improves operational efficiency"), { continued: true, width: 440 })
                .font("Helvetica-Bold")
                .fillColor("#0f172a")
                .text(" | Technical: ", { continued: true })
                .font("Helvetica")
                .fillColor("#334155")
                .text(sanitizePdfText(feat.technicalNotes, "Modular implementation"), { width: 440, ellipsis: true });

            doc.y = cardY + 84;
        });

        /* =================================================
           4. TECHNOLOGY STACK (ALL CATEGORIES)
        ================================================= */
        drawSectionHeading(doc, "Technology Stack & Production Tooling", "TECHNOLOGY");

        const techStack = blueprint.technologyStack || {};
        const techCategories = [
            { label: "Frontend Tier", items: safeArray(techStack.frontend) },
            { label: "Backend & API Tier", items: safeArray(techStack.backend) },
            { label: "Data Persistence & Caching", items: safeArray(techStack.database) },
            { label: "Authentication & Security", items: safeArray(techStack.authentication) },
            { label: "AI & Intelligence Services", items: safeArray(techStack.ai) },
            { label: "Cloud Deployment & Hosting", items: safeArray(techStack.deployment) },
            { label: "DevOps & Containerization", items: safeArray(techStack.devops) },
            { label: "Testing & Quality Assurance", items: safeArray(techStack.testing) },
            { label: "Observability & Monitoring", items: safeArray(techStack.monitoring) },
        ];

        techCategories.forEach((cat) => {
            if (!cat.items || cat.items.length === 0) return;

            checkPageSpace(doc, 45 + cat.items.length * 18);
            doc.moveDown(0.3);

            doc.font("Helvetica-Bold").fontSize(9).fillColor("#4f46e5").text(`[+] ${cat.label.toUpperCase()}`, 50, doc.y);
            doc.moveDown(0.2);

            cat.items.forEach((t) => {
                const tName = sanitizePdfText(isObject(t) ? t.name : String(t));
                const tPurpose = sanitizePdfText(isObject(t) ? t.purpose : "");
                const tWhy = sanitizePdfText(isObject(t) ? t.whyRecommended : "");

                doc
                    .font("Helvetica-Bold")
                    .fontSize(8)
                    .fillColor("#0f172a")
                    .text(`- ${tName}`, 60, doc.y, { continued: !!tPurpose || !!tWhy })
                    .font("Helvetica")
                    .fillColor("#475569")
                    .text(tPurpose ? ` : ${tPurpose}` : "", { continued: !!tWhy })
                    .font("Helvetica-Oblique")
                    .fillColor("#64748b")
                    .text(tWhy ? ` (${tWhy})` : "", { lineGap: 1.5 });
                doc.moveDown(0.15);
            });
        });

        /* =================================================
           5. SYSTEM ARCHITECTURE & DATA FLOW
        ================================================= */
        drawSectionHeading(doc, "System Architecture & Component Topology", "ARCHITECTURE");

        const arch = blueprint.architecture || {};

        if (arch.description) {
            checkPageSpace(doc, 45);
            doc.font("Helvetica").fontSize(8.5).fillColor("#334155").text(sanitizePdfText(arch.description), 50, doc.y, { width: 495, lineGap: 2 });
            doc.moveDown(0.5);
        }

        // Architecture Components
        const components = safeArray(arch.components);
        if (components.length > 0) {
            doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("Core Architectural Components", 50, doc.y);
            doc.moveDown(0.3);

            components.forEach((c) => {
                checkPageSpace(doc, 50);
                const compY = doc.y;

                doc.roundedRect(50, compY, 495, 44, 5).fillAndStroke("#f8fafc", "#e2e8f0");
                doc.roundedRect(50, compY, 3, 44, 1.5).fill("#6366f1");

                doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#0f172a").text(sanitizePdfText(c.name), 62, compY + 7);
                doc.font("Helvetica").fontSize(7.5).fillColor("#475569").text(sanitizePdfText(c.responsibility), 62, compY + 20, { width: 470, lineGap: 1.5, ellipsis: true });

                doc.y = compY + 50;
            });
        }

        // Request Lifecycle Data Flow
        const dataFlowSteps = safeArray(arch.dataFlow);
        if (dataFlowSteps.length > 0) {
            checkPageSpace(doc, 65);
            doc.moveDown(0.3);
            doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("Request Lifecycle & Data Flow Sequence", 50, doc.y);
            doc.moveDown(0.3);

            dataFlowSteps.forEach((step, sIdx) => {
                checkPageSpace(doc, 20);
                doc
                    .font("Helvetica-Bold")
                    .fontSize(8)
                    .fillColor("#4f46e5")
                    .text(`Step ${sIdx + 1}: `, 55, doc.y, { continued: true })
                    .font("Helvetica")
                    .fillColor("#334155")
                    .text(sanitizePdfText(step).replace(/^\d+\.\s*/, ""), { width: 480, lineGap: 1.5 });
                doc.moveDown(0.15);
            });
        }

        /* =================================================
           6. DATABASE SCHEMA & ENTITY DESIGN
        ================================================= */
        drawSectionHeading(doc, "Database Schema & Collection Specifications", "PERSISTENCE");

        const collections = safeArray(blueprint.databaseDesign || blueprint.database);
        collections.forEach((col, cIdx) => {
            checkPageSpace(doc, 100);
            doc.moveDown(0.2);

            const colName = sanitizePdfText(col.collection || col.name || col.title, `Collection_${cIdx + 1}`);
            const colType = sanitizePdfText(col.type, "Document Collection");
            const colPurpose = sanitizePdfText(col.purpose || col.description, "Primary domain datastore entity.");

            // Collection Header Box
            const hY = doc.y;
            doc.roundedRect(50, hY, 495, 22, 4).fillAndStroke("#0f172a", "#0f172a");
            doc.font("Helvetica-Bold").fontSize(9).fillColor("#ffffff").text(`[TABLE/COLLECTION]  ${colName}`, 60, hY + 6, { continued: true });
            doc.font("Helvetica").fontSize(7.5).fillColor("#94a3b8").text(`  [${colType}]`);

            doc.y = hY + 28;

            doc.font("Helvetica-Oblique").fontSize(7.5).fillColor("#475569").text(`Purpose: ${colPurpose}`, 55, doc.y);
            doc.moveDown(0.2);

            // Fields Table Header
            const fields = safeArray(col.fields);
            if (fields.length > 0) {
                const tY = doc.y;
                doc.rect(50, tY, 495, 15).fill("#f1f5f9");
                doc.font("Helvetica-Bold").fontSize(7).fillColor("#475569");
                doc.text("FIELD NAME", 55, tY + 4, { width: 120 });
                doc.text("TYPE", 180, tY + 4, { width: 90 });
                doc.text("REQUIRED", 275, tY + 4, { width: 65 });
                doc.text("DESCRIPTION / CONSTRAINTS", 345, tY + 4, { width: 195 });

                doc.y = tY + 17;

                fields.forEach((f, fIdx) => {
                    checkPageSpace(doc, 16);
                    const rY = doc.y;
                    if (fIdx % 2 === 1) {
                        doc.rect(50, rY, 495, 15).fill("#f8fafc");
                    }

                    doc.font("Helvetica-Bold").fontSize(7).fillColor("#0f172a").text(sanitizePdfText(f.name), 55, rY + 4, { width: 120, ellipsis: true });
                    doc.font("Helvetica").fontSize(7).fillColor("#4f46e5").text(sanitizePdfText(f.type), 180, rY + 4, { width: 90, ellipsis: true });
                    doc.font("Helvetica").fontSize(7).fillColor(f.required ? "#dc2626" : "#64748b").text(f.required ? "YES" : "NO", 275, rY + 4, { width: 65 });
                    doc.font("Helvetica").fontSize(7).fillColor("#475569").text(sanitizePdfText(f.description), 345, rY + 4, { width: 195, height: 11, ellipsis: true });

                    doc.y = rY + 15;
                });
            }

            // Indexes & Relationships
            if (safeArray(col.indexes).length > 0 || col.relationships) {
                doc.moveDown(0.15);
                if (safeArray(col.indexes).length > 0) {
                    doc.font("Helvetica-Bold").fontSize(7).fillColor("#0f172a").text("Indexes: ", 55, doc.y, { continued: true }).font("Helvetica").fillColor("#64748b").text(col.indexes.map((i) => sanitizePdfText(i)).join(", "));
                }
                if (col.relationships) {
                    doc.font("Helvetica-Bold").fontSize(7).fillColor("#0f172a").text("Relationships: ", 55, doc.y, { continued: true }).font("Helvetica").fillColor("#64748b").text(sanitizePdfText(col.relationships));
                }
            }

            doc.moveDown(0.4);
        });

        /* =================================================
           7. REST API SPECIFICATIONS (ALL ENDPOINTS)
        ================================================= */
        drawSectionHeading(doc, "REST API Endpoints & Request/Response Contracts", "APIS");

        const apis = safeArray(blueprint.restApis || blueprint.apis);
        apis.forEach((api) => {
            checkPageSpace(doc, 80);

            const method = sanitizePdfText(api.method, "GET").toUpperCase();
            let mBg = "#dcfce7";
            let mText = "#166534";
            let mBorder = "#86efac";

            if (method === "POST") {
                mBg = "#e0e7ff";
                mText = "#3730a3";
                mBorder = "#c7d2fe";
            } else if (method === "PUT" || method === "PATCH") {
                mBg = "#fef3c7";
                mText = "#92400e";
                mBorder = "#fcd34d";
            } else if (method === "DELETE") {
                mBg = "#fee2e2";
                mText = "#991b1b";
                mBorder = "#fca5a5";
            }

            const apiY = doc.y;
            doc.roundedRect(50, apiY, 495, 74, 5).fillAndStroke("#f8fafc", "#e2e8f0");

            // Method Badge
            doc.roundedRect(58, apiY + 7, 46, 15, 3).fillAndStroke(mBg, mBorder);
            doc.font("Helvetica-Bold").fontSize(7).fillColor(mText).text(method, 58, apiY + 11, { width: 46, align: "center" });

            // Endpoint Path
            const epPath = sanitizePdfText(api.endpoint || api.path, "/api/v1/resource");
            doc.font("Courier-Bold").fontSize(8.5).fillColor("#0f172a").text(epPath, 110, apiY + 11);

            // Auth Tag
            const authStr = sanitizePdfText(api.authentication, "Required");
            doc.font("Helvetica-Bold").fontSize(7).fillColor("#6366f1").text(`Auth: ${authStr}`, 410, apiY + 11, { width: 125, align: "right" });

            // Description
            doc.font("Helvetica").fontSize(7.5).fillColor("#475569").text(sanitizePdfText(api.description || api.purpose), 58, apiY + 28, { width: 475, height: 18, lineGap: 1.5, ellipsis: true });

            // Request / Response Payload details
            const reqSummary = isObject(api.requestBody) ? JSON.stringify(api.requestBody) : sanitizePdfText(api.requestBody, "None");
            const resSummary = isObject(api.successResponse) ? JSON.stringify(api.successResponse) : sanitizePdfText(api.successResponse, "HTTP 200 OK");

            doc
                .font("Helvetica-Bold")
                .fontSize(7)
                .fillColor("#0f172a")
                .text("Payload: ", 58, apiY + 50, { continued: true })
                .font("Courier")
                .fillColor("#334155")
                .text(reqSummary.slice(0, 50), { continued: true })
                .font("Helvetica-Bold")
                .fillColor("#0f172a")
                .text(" | Response: ", { continued: true })
                .font("Courier")
                .fillColor("#16a34a")
                .text(resSummary.slice(0, 50), { ellipsis: true });

            doc.y = apiY + 80;
        });

        /* =================================================
           8. ENTERPRISE PROJECT FOLDER STRUCTURE (100% FULL TREE)
        ================================================= */
        const folderStructure = blueprint.folderStructure || blueprint.folders;
        if (folderStructure && typeof folderStructure === "object") {
            drawSectionHeading(doc, "Enterprise Project Folder Structure", "STRUCTURE");

            const frontendItems = flattenFolderTree(folderStructure.frontend || folderStructure.client || {});
            const backendItems = flattenFolderTree(folderStructure.backend || folderStructure.server || {});

            if (frontendItems.length > 0) {
                checkPageSpace(doc, 45);
                doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#4f46e5").text("[+] FRONTEND ARCHITECTURE TREE (CLIENT SPA)", 50, doc.y);
                doc.moveDown(0.25);

                frontendItems.forEach((item) => {
                    checkPageSpace(doc, 12);
                    const isDir = item.type === "dir";
                    const indent = "   ".repeat(item.depth);
                    const prefix = item.depth === 0 ? (isDir ? "+- [DIR]  " : "|- [FILE] ") : (isDir ? "+- " : "|- ");
                    const suffix = isDir ? "/" : "";

                    doc
                        .font(isDir ? "Courier-Bold" : "Courier")
                        .fontSize(7.5)
                        .fillColor(isDir ? "#1d4ed8" : "#334155")
                        .text(`${indent}${prefix}${sanitizePdfText(item.name)}${suffix}`, 55, doc.y, { width: 485, lineGap: 1 });
                });

                doc.moveDown(0.4);
            }

            if (backendItems.length > 0) {
                checkPageSpace(doc, 45);
                doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#4f46e5").text("[+] BACKEND ARCHITECTURE TREE (API SERVER)", 50, doc.y);
                doc.moveDown(0.25);

                backendItems.forEach((item) => {
                    checkPageSpace(doc, 12);
                    const isDir = item.type === "dir";
                    const indent = "   ".repeat(item.depth);
                    const prefix = item.depth === 0 ? (isDir ? "+- [DIR]  " : "|- [FILE] ") : (isDir ? "+- " : "|- ");
                    const suffix = isDir ? "/" : "";

                    doc
                        .font(isDir ? "Courier-Bold" : "Courier")
                        .fontSize(7.5)
                        .fillColor(isDir ? "#1d4ed8" : "#334155")
                        .text(`${indent}${prefix}${sanitizePdfText(item.name)}${suffix}`, 55, doc.y, { width: 485, lineGap: 1 });
                });

                doc.moveDown(0.5);
            }
        }

        /* =================================================
           9. DEVELOPMENT ROADMAP (ALL PHASES & TASKS)
        ================================================= */
        drawSectionHeading(doc, "Implementation Roadmap & Milestones", "ROADMAP");

        const roadmap = safeArray(blueprint.developmentRoadmap || blueprint.roadmap);
        roadmap.forEach((phase, rIdx) => {
            const tasks = safeArray(phase.tasks);
            const cardHeight = Math.max(75, 52 + Math.min(4, tasks.length) * 11);
            checkPageSpace(doc, cardHeight + 10);

            const rY = doc.y;
            doc.roundedRect(50, rY, 495, cardHeight, 6).fillAndStroke("#f8fafc", "#e2e8f0");
            doc.roundedRect(50, rY, 4, cardHeight, 2).fill("#4f46e5");

            // Timeline Circle
            doc.circle(68, rY + 16, 9).fillAndStroke("#4f46e5", "#4f46e5");
            doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#ffffff").text(String(rIdx + 1), 65, rY + 12);

            // Phase Title & Timeline
            const pTitle = sanitizePdfText(phase.phase || phase.title, `Phase ${rIdx + 1}`);
            const pTime = sanitizePdfText(phase.timeline || phase.duration, `Weeks ${rIdx * 2 + 1}-${rIdx * 2 + 2}`);

            doc.font("Helvetica-Bold").fontSize(9).fillColor("#0f172a").text(pTitle, 84, rY + 10, { width: 330 });
            doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#4f46e5").text(pTime, 420, rY + 10, { width: 115, align: "right" });

            // Goal
            doc.font("Helvetica-Oblique").fontSize(7.5).fillColor("#475569").text(`Goal: ${sanitizePdfText(phase.goal)}`, 84, rY + 24, { width: 445, ellipsis: true });

            // All Tasks
            let taskTop = rY + 38;
            tasks.slice(0, 4).forEach((t) => {
                doc.font("Helvetica").fontSize(7).fillColor("#334155").text(`- ${sanitizePdfText(t)}`, 84, taskTop, { width: 445, ellipsis: true });
                taskTop += 11;
            });

            // Deliverable
            const deliv = sanitizePdfText(phase.deliverable || (Array.isArray(phase.deliverables) ? phase.deliverables[0] : ""));
            if (deliv) {
                doc.font("Helvetica-Bold").fontSize(7).fillColor("#16a34a").text(`Deliverable: ${deliv}`, 84, rY + cardHeight - 14, { width: 445, ellipsis: true });
            }

            doc.y = rY + cardHeight + 8;
        });

        /* =================================================
           10. SECURITY & COMPLIANCE ARCHITECTURE
        ================================================= */
        drawSectionHeading(doc, "Security & Compliance Architecture", "SECURITY");

        const secItems = safeArray(blueprint.security);
        if (secItems.length > 0) {
            secItems.forEach((s) => {
                checkPageSpace(doc, 24);
                let sTitle = "";
                let sDesc = "";

                if (typeof s === "string") {
                    if (s.includes(":")) {
                        const parts = s.split(":");
                        sTitle = sanitizePdfText(parts[0]);
                        sDesc = sanitizePdfText(parts.slice(1).join(":"));
                    } else {
                        sTitle = sanitizePdfText(s);
                    }
                } else if (isObject(s)) {
                    sTitle = sanitizePdfText(s.title || s.name, "Security Control");
                    sDesc = sanitizePdfText(s.description || s.details, "");
                }

                doc
                    .font("Helvetica-Bold")
                    .fontSize(8)
                    .fillColor("#0f172a")
                    .text(`[SECURITY]  ${sTitle}: `, 55, doc.y, { continued: !!sDesc })
                    .font("Helvetica")
                    .fillColor("#475569")
                    .text(sDesc, { lineGap: 1.5 });
                doc.moveDown(0.2);
            });
        }

        /* =================================================
           11. PERFORMANCE & SCALABILITY PROTOCOLS
        ================================================= */
        drawSectionHeading(doc, "Performance & Scalability Protocols", "PERFORMANCE");

        const perfItems = safeArray(blueprint.performanceOptimization);
        if (perfItems.length > 0) {
            perfItems.forEach((p) => {
                checkPageSpace(doc, 20);
                doc
                    .font("Helvetica")
                    .fontSize(8)
                    .fillColor("#334155")
                    .text(`[+]  ${sanitizePdfText(p)}`, 55, doc.y, { width: 480, lineGap: 1.5 });
                doc.moveDown(0.18);
            });
        }

        /* =================================================
           12. ENGINEERING BEST PRACTICES
        ================================================= */
        drawSectionHeading(doc, "Engineering Best Practices", "STANDARDS");

        const bestPractices = safeArray(blueprint.bestPractices);
        if (bestPractices.length > 0) {
            bestPractices.forEach((b) => {
                checkPageSpace(doc, 20);
                doc
                    .font("Helvetica")
                    .fontSize(8)
                    .fillColor("#334155")
                    .text(`[OK]  ${sanitizePdfText(b)}`, 55, doc.y, { width: 480, lineGap: 1.5 });
                doc.moveDown(0.18);
            });
        }

        /* =================================================
           13. FUTURE ENHANCEMENTS & ROADMAP
        ================================================= */
        drawSectionHeading(doc, "Future Enhancements & Roadmap", "FUTURE ROADMAP");

        const futureEnhancements = safeArray(blueprint.futureEnhancements);
        if (futureEnhancements.length > 0) {
            futureEnhancements.forEach((f) => {
                checkPageSpace(doc, 20);
                doc
                    .font("Helvetica")
                    .fontSize(8)
                    .fillColor("#334155")
                    .text(`->  ${sanitizePdfText(f)}`, 55, doc.y, { width: 480, lineGap: 1.5 });
                doc.moveDown(0.18);
            });
        }

        /* =================================================
           14. PRODUCTION DEPLOYMENT CHECKLIST
        ================================================= */
        drawSectionHeading(doc, "Production Deployment Checklist", "DEPLOYMENT");

        const deploymentChecklist = safeArray(blueprint.deploymentChecklist || blueprint.deploymentCheckList);
        if (deploymentChecklist.length > 0) {
            deploymentChecklist.forEach((d) => {
                checkPageSpace(doc, 20);
                doc
                    .font("Helvetica-Bold")
                    .fontSize(8)
                    .fillColor("#16a34a")
                    .text("[OK] ", 55, doc.y, { continued: true })
                    .font("Helvetica")
                    .fillColor("#334155")
                    .text(sanitizePdfText(d), { width: 460, lineGap: 1.5 });
                doc.moveDown(0.18);
            });
        }

        /* =================================================
           15. PROJECT RISKS & MITIGATION MATRIX
        ================================================= */
        drawSectionHeading(doc, "Project Risks & Mitigations", "RISK MATRIX");

        const risks = safeArray(blueprint.risks);
        if (risks.length > 0) {
            risks.forEach((r) => {
                checkPageSpace(doc, 36);
                const rTitle = sanitizePdfText(isObject(r) ? r.risk : String(r));
                const rImpact = sanitizePdfText(isObject(r) ? r.impact : "Medium");
                const rMit = sanitizePdfText(isObject(r) ? r.mitigation : "Engineering best practices");

                doc
                    .font("Helvetica-Bold")
                    .fontSize(8)
                    .fillColor("#dc2626")
                    .text(`[RISK]  ${rTitle}  [Impact: ${rImpact}]`, 55, doc.y);
                doc
                    .font("Helvetica")
                    .fontSize(7.5)
                    .fillColor("#334155")
                    .text(`        Mitigation: ${rMit}`, { width: 480, lineGap: 1.5 });
                doc.moveDown(0.25);
            });
        }



        /* =================================================
           RUNNING HEADERS & FOOTERS ACROSS ALL PAGES (NO BLANK PAGES)
        ================================================= */
        const range = doc.bufferedPageRange();
        const totalPages = range.count;

        for (let i = 0; i < totalPages; i++) {
            doc.switchToPage(i);

            // Temporarily set bottom margin to 0 so footer text NEVER triggers auto-addPage!
            const prevBottomMargin = doc.page.margins.bottom;
            doc.page.margins.bottom = 0;

            // Page 2+ Running Header
            if (i > 0) {
                doc
                    .font("Helvetica")
                    .fontSize(7.5)
                    .fillColor("#94a3b8")
                    .text(`BuildForge AI | Architectural Blueprint: ${projectName}`, 50, 25, { width: 495, lineBreak: false });

                doc
                    .strokeColor("#e2e8f0")
                    .lineWidth(0.5)
                    .moveTo(50, 38)
                    .lineTo(545, 38)
                    .stroke();
            }

            // Running Footer (All pages)
            doc
                .strokeColor("#e2e8f0")
                .lineWidth(0.5)
                .moveTo(50, 795)
                .lineTo(545, 795)
                .stroke();

            doc
                .font("Helvetica")
                .fontSize(7)
                .fillColor("#94a3b8")
                .text(
                    `Confidential & Proprietary | BuildForge AI Architecture Engine | Page ${i + 1} of ${totalPages}`,
                    50,
                    805,
                    { align: "center", width: 495, lineBreak: false }
                );

            doc.page.margins.bottom = prevBottomMargin;
        }

        doc.end();
    } catch (error) {
        console.error("❌ PDF EXPORT ERROR:", error?.stack || error);

        if (!res.headersSent) {
            return errorResponse(res, error?.message || "PDF export failed.", 500);
        }

        res.end();
    }
};

/* =========================================================
   EXPORT DIRECT PDF (FROM REQUEST BODY)
========================================================= */

export const exportDirectPDF = (req, res) => {
    try {
        const { idea, project } = req.body || {};

        if (!project) {
            return errorResponse(res, "Blueprint project data is required for PDF generation.", 400);
        }

        return generateBlueprintPdfStream(res, project, idea);
    } catch (error) {
        console.error("❌ DIRECT PDF EXPORT ERROR:", error);
        return errorResponse(res, "Failed to generate direct PDF export.", 500);
    }
};

/* =========================================================
   EXPORT SAVED PROJECT PDF (BY PROJECT ID)
========================================================= */

export const exportProjectPDF = (req, res) => {
    try {
        const userId = req.user?.id || req.user?.userId || "builder-default";
        const projectId = req.params?.id;

        if (!projectId) {
            return errorResponse(res, "Project ID is required.", 400);
        }

        let savedProject = getUserProjectById(projectId, userId);

        if (!savedProject) {
            savedProject = getUserProjectById(projectId, "builder-default");
        }

        if (!savedProject) {
            return errorResponse(res, "Project not found.", 404);
        }

        const blueprint =
            savedProject.project && typeof savedProject.project === "object"
                ? savedProject.project
                : savedProject;

        return generateBlueprintPdfStream(res, blueprint, savedProject.idea);
    } catch (error) {
        console.error("❌ PDF EXPORT ERROR:", error);
        return errorResponse(res, "PDF export failed.", 500);
    }
};

/* =========================================================
   JSON EXPORT
========================================================= */

export const exportProjectJSON = (req, res) => {
    try {
        const userId = req.user?.id || req.user?.userId || "builder-default";
        const projectId = req.params?.id;

        if (!projectId) {
            return errorResponse(res, "Project ID is required.", 400);
        }

        let project = getUserProjectById(projectId, userId);
        if (!project) {
            project = getUserProjectById(projectId, "builder-default");
        }

        if (!project) {
            return errorResponse(res, "Project not found or access denied.", 404);
        }

        const blueprint = project.project || project;
        const filename = safeFilename(blueprint.projectName || project.idea || "BuildForge-Blueprint");

        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}.json"`);

        return res.send(JSON.stringify(project, null, 2));
    } catch (error) {
        console.error("❌ JSON EXPORT ERROR:", error);
        return errorResponse(res, "JSON export failed.", 500);
    }
};

export default {
    generateBlueprintPdfStream,
    exportDirectPDF,
    exportProjectPDF,
    exportProjectJSON,
};