# Resumatic — AI Resume Analyzer & Job Match Engine

A full-stack resume intelligence tool: upload a resume, get an ATS readiness score,
paste a job description, and see exactly how well you match — with a missing-skills
breakdown and an analytics dashboard tracking your progress over time.

## Stack

- **Frontend:** React 19 + Vite, Tailwind CSS v4, React Router, Zustand, Recharts, Framer Motion
- **Backend:** Flask, SQLAlchemy, JWT auth (Flask-JWT-Extended), Flask-Bcrypt
- **Database:** SQLite (zero-config, file-based)
- **AI/NLP:** pdfplumber + python-docx for parsing, regex-based entity extraction,
  scikit-learn TF-IDF + cosine similarity for semantic job-match scoring

This uses classical, fully-offline NLP techniques (TF-IDF, regex, keyword matching)
rather than downloaded transformer models — reliable, fast, explainable in an
interview, and needs no GPU or external API keys.

## Features

- JWT authentication (register/login)
- Resume upload (PDF/DOCX) with drag-and-drop
- Automated parsing: name, email, phone, links, skills, education, experience
- ATS score (0–100) with a 6-factor breakdown: section coverage, contact info,
  length, action verbs, skills presence, formatting — plus actionable feedback
- Job Match Engine: paste a JD, get a match %, matching/missing skills, and
  semantic similarity score
- Dashboard: ATS score trend, top skills across resumes, most common skill gaps
- Match history across all resumes and job descriptions

## Project Structure

```
resume-analyzer/
├── backend/          # Flask API
│   ├── app.py         # App factory + entrypoint
│   ├── config.py
│   ├── extensions.py
│   ├── models.py       # User, Resume, JobMatchAnalysis
│   ├── routes/          # auth, resume, match, dashboard blueprints
│   ├── utils/            # parser, ats_scorer, job_matcher, skills_data
│   └── requirements.txt
└── frontend/          # React app
    ├── src/pages/       # Login, Register, Dashboard, Upload, ResumeList,
    │                     # ResumeDetail, JobMatch, MatchHistory
    ├── src/components/   # Layout, ScoreGauge (signature radial score dial), ProtectedRoute
    ├── src/api/           # axios client with JWT interceptor
    └── src/store/          # zustand auth store
```

## Setup

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Runs on `http://localhost:5010`. SQLite DB (`resume_analyzer.db`) and the
`uploads/` folder are created automatically on first run.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env      # adjust VITE_API_URL if your backend runs elsewhere
npm run dev
```

Runs on `http://localhost:5173`.

## Notes for demoing / interviews

- The ATS scorer is fully rule-based and explainable — every point of the score
  maps to a specific, named check (see `utils/ats_scorer.py`), so you can walk
  through exactly why a resume scored what it did.
- The Job Match Engine blends keyword/skill overlap (60%) with TF-IDF cosine
  similarity (40%) — a defensible, classical approach to semantic matching
  that doesn't depend on any external AI API.
- Max upload size is 5MB; only PDF/DOCX accepted (validated both client and
  server side).
- Passwords are hashed with bcrypt; auth uses JWT bearer tokens (7-day expiry).

## Possible next steps

- Cover letter generator (would reuse the same parsed resume + JD text)
- PDF report export for a given analysis
- Resume version comparison view
