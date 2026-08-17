# Master skills list used for extraction and job-match gap analysis.
# Organized by category purely for maintainability; matching is case-insensitive
# and flattened at import time.

SKILLS_DB = {
    "programming_languages": [
        "python", "java", "javascript", "typescript", "c++", "c#", "c",
        "go", "golang", "rust", "php", "ruby", "kotlin", "swift", "r",
        "scala", "matlab", "sql", "html", "css", "bash", "shell scripting",
    ],
    "web_frameworks": [
        "react", "react.js", "angular", "vue", "vue.js", "next.js", "node.js",
        "express", "express.js", "django", "flask", "fastapi", "spring boot",
        "asp.net", "laravel", "svelte", "redux", "zustand", "tailwind css",
        "bootstrap", "jquery", "webpack", "vite",
    ],
    "data_science_ml": [
        "machine learning", "deep learning", "data science", "nlp",
        "natural language processing", "computer vision", "scikit-learn",
        "sklearn", "tensorflow", "keras", "pytorch", "pandas", "numpy",
        "matplotlib", "seaborn", "opencv", "xgboost", "lightgbm",
        "hugging face", "transformers", "llm", "generative ai",
        "feature engineering", "model deployment", "mlops", "statistics",
        "regression", "classification", "clustering", "time series",
        "forecasting", "neural networks", "cnn", "rnn", "lstm",
    ],
    "databases": [
        "mysql", "postgresql", "mongodb", "sqlite", "redis", "oracle",
        "firebase", "dynamodb", "cassandra", "elasticsearch", "sql server",
    ],
    "cloud_devops": [
        "aws", "azure", "gcp", "google cloud", "docker", "kubernetes",
        "ci/cd", "jenkins", "git", "github", "gitlab", "terraform",
        "linux", "nginx", "vercel", "netlify", "heroku", "railway",
    ],
    "tools_misc": [
        "power bi", "tableau", "excel", "jira", "postman", "figma",
        "rest api", "graphql", "microservices", "agile", "scrum",
        "jwt", "oauth", "unit testing", "pytest", "selenium",
    ],
    "soft_skills": [
        "communication", "leadership", "teamwork", "problem solving",
        "critical thinking", "time management", "adaptability",
        "collaboration", "presentation", "analytical skills",
    ],
}

# Flattened, lowercase, deduplicated list for fast lookup
ALL_SKILLS = sorted({
    skill.lower()
    for category in SKILLS_DB.values()
    for skill in category
})

ACTION_VERBS = [
    "achieved", "built", "created", "designed", "developed", "engineered",
    "implemented", "improved", "increased", "launched", "led", "managed",
    "optimized", "reduced", "resolved", "spearheaded", "streamlined",
    "automated", "architected", "delivered", "collaborated", "analyzed",
    "deployed", "integrated", "mentored", "initiated", "transformed",
]

RESUME_SECTION_KEYWORDS = {
    "contact": ["email", "phone", "linkedin", "github"],
    "summary": ["summary", "objective", "profile"],
    "experience": ["experience", "work history", "employment", "internship"],
    "education": ["education", "academic", "degree", "university", "college"],
    "skills": ["skills", "technical skills", "technologies"],
    "projects": ["projects", "portfolio"],
    "certifications": ["certification", "certificate", "license"],
}
