const projects = {
    "AI Resume Screening": {
        overview: "An AI-powered recruitment intelligence platform that automatically analyzes resumes, evaluates candidates, and ranks applicants based on skills, experience, and job relevanceIt helps recruiters make faster, data - driven hiring decisionswhile improving candidate selection accuracy using AI automation.",
        techStack: [
            "React",
            "Node.js",
            "Express",
            "MongoDB",
            "JWT",
            "Cloudinary",
        ],

        features: [
            "Resume Upload",
            "AI Resume Analysis",
            "Candidate Dashboard",
            "Recruiter Dashboard",
            "Interview Scheduling",
            "Admin Panel",
        ],

        database: [
            "Users",
            "Candidates",
            "Recruiters",
            "Jobs",
            "Applications",
        ],

        apis: [
            "POST /register",
            "POST /login",
            "POST /resume/upload",
            "GET /jobs",
            "GET /applications",
        ],

        folders: [
            "frontend",
            "backend",
            "controllers",
            "models",
            "routes",
            "middleware",
            "config",
            "services",
        ],

        architecture: [
            "React",
            "Express",
            "MongoDB",
            "Cloudinary"
        ],

        roadmap: [
            "Authentication",
            "Resume Upload",
            "AI Integration",
            "Dashboard",
            "Deployment",
        ],

        difficulty: "Intermediate",

        duration: "5-6 Weeks",
    },

    "AI Interview Platform": {
        overview: "Conduct AI-powered mock interviews with coding tests, speech analysis, and detailed performance reports.",

        techStack: [
            "React",
            "Node.js",
            "Express",
            "MongoDB",
            "Socket.io",
            "Gemini API",
        ],

        features: [
            "AI Interview",
            "Coding Challenges",
            "Voice Analysis",
            "Performance Report",
            "Admin Dashboard",
        ],

        database: [
            "Users",
            "Questions",
            "Interviews",
            "Reports",
        ],

        apis: [
            "POST /login",
            "POST /interview/start",
            "GET /report",
            "POST /feedback",
        ],

        folders: [
            "frontend",
            "backend",
            "controllers",
            "routes",
            "models",
            "middleware",
            "services",
        ],

        architecture: [
            "React UI",
            "Express Server",
            "Gemini AI",
            "MongoDB",
        ],

        roadmap: [
            "Authentication",
            "Question Bank",
            "AI Interview",
            "Reports",
            "Deployment",
        ],

        difficulty: "Advanced",

        duration: "6 Weeks",
    },

    "Smart Attendance System": {
        overview: "A face recognition attendance management system for schools and organizations with analytics.",

        techStack: [
            "React",
            "Node.js",
            "Python",
            "OpenCV",
            "MongoDB",
        ],

        features: [
            "Face Recognition",
            "Attendance Dashboard",
            "Student Management",
            "Reports",
            "Notifications",
        ],

        database: [
            "Students",
            "Teachers",
            "Attendance",
            "Classes",
        ],

        apis: [
            "POST /attendance",
            "GET /students",
            "GET /reports",
        ],

        folders: [
            "frontend",
            "backend",
            "python-ai",
            "controllers",
            "models",
            "routes",
        ],

        architecture: [
            "React",
            "Node",
            "Python AI",
            "MongoDB",
        ],

        roadmap: [
            "Authentication",
            "Face Recognition",
            "Attendance",
            "Analytics",
            "Deployment",
        ],

        difficulty: "Advanced",

        duration: "7 Weeks",
    },

    "Startup Funding Tracker": {
        overview: "Track startup investments, funding rounds, investors, and company growth using interactive dashboards.",

        techStack: [
            "React",
            "Express",
            "MongoDB",
            "Chart.js",
        ],

        features: [
            "Funding Dashboard",
            "Investor Management",
            "Analytics",
            "Reports",
        ],

        database: [
            "Users",
            "Startups",
            "Investors",
            "Funding",
        ],

        apis: [
            "POST /funding",
            "GET /investors",
            "GET /analytics",
        ],

        folders: [
            "frontend",
            "backend",
            "controllers",
            "models",
            "routes",
        ],

        architecture: [
            "React",
            "Express",
            "MongoDB",
            "Charts",
        ],

        roadmap: [
            "Authentication",
            "Funding Module",
            "Analytics",
            "Reports",
            "Deployment",
        ],

        difficulty: "Intermediate",

        duration: "4 Weeks",
    },
};

export default projects;