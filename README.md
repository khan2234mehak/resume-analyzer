# Resumatic — AI Resume Analyzer & Job Match Engine

> **An intelligent full-stack resume analysis platform that evaluates ATS readiness, extracts resume information, and measures how well a resume matches a target job description.**

Resumatic helps job seekers understand how their resume performs against ATS-style checks and job requirements. Users can upload a **PDF or DOCX resume**, receive a detailed **ATS score**, view extracted skills and information, and compare their resume against a job description using skill matching and TF-IDF-based similarity.

---

## 🚀 Live Demo

👉 **[Try Resume-analyzer Live](https://resume-analyzer-an8n.onrender.com)**

## ✨ Features

### 📄 Resume Analysis

* Upload resumes in **PDF or DOCX** format
* Automatic resume text extraction
* Extracts:

  * Candidate name
  * Email
  * Phone number
  * LinkedIn
  * GitHub
  * Skills
  * Education
  * Experience

### 🎯 ATS Resume Scoring

Generates an ATS readiness score from **0–100** using six measurable factors:

* Section coverage
* Contact information
* Resume length
* Action verbs
* Skills presence
* Bullet-point formatting

The system also provides **actionable feedback** to help improve the resume.

### 💼 Job Match Engine

Paste a job description and get:

* Overall job match percentage
* Matching skills
* Missing skills
* Skill coverage percentage
* TF-IDF semantic similarity score
* Total skills detected in the job description

The final match score combines:

**60% Skill Coverage + 40% TF-IDF Similarity**

### 📊 Analytics Dashboard

Track resume performance through:

* ATS score trends
* Top skills
* Common skill gaps
* Resume analysis history

### 🔐 Authentication

* User registration and login
* JWT-based authentication
* Password hashing using bcrypt
* Protected application routes
* 7-day JWT token expiry

### ⚡ Additional Features

* Drag-and-drop resume upload
* Maximum upload size of **5 MB**
* PDF/DOCX validation on client and server
* Responsive dashboard interface
* Resume and job-match history
* SQLite database for zero-configuration development

---

## 🧠 How It Works

```text
                    ┌──────────────────┐
                    │   Upload Resume  │
                    │    PDF / DOCX    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Resume Parser   │
                    │ PDF/DOCX → Text  │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │  Entity  │   │  Skills  │   │   ATS    │
        │Extraction│   │Detection │   │ Scoring  │
        └──────────┘   └──────────┘   └────┬─────┘
                                           │
                                           ▼
                                  ┌────────────────┐
                                  │ ATS Score +    │
                                  │ Feedback       │
                                  └────────────────┘

Job Description
       │
       ▼
┌──────────────────────┐
│ Skill Extraction     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Skill Coverage 60%   │
│ TF-IDF Similarity 40%│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Job Match Percentage │
│ + Missing Skills     │
└──────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

| Technology     | Purpose               |
| -------------- | --------------------- |
| React 19       | User interface        |
| Vite           | Frontend build tool   |
| Tailwind CSS 4 | Styling               |
| React Router   | Client-side routing   |
| Zustand        | State management      |
| Axios          | API communication     |
| Recharts       | Analytics and charts  |
| Framer Motion  | UI animations         |
| React Dropzone | Drag-and-drop uploads |

### Backend

| Technology         | Purpose                      |
| ------------------ | ---------------------------- |
| Python             | Core backend language        |
| Flask              | REST API                     |
| Flask-SQLAlchemy   | Database ORM                 |
| Flask-JWT-Extended | Authentication               |
| Flask-Bcrypt       | Password hashing             |
| Flask-CORS         | Cross-origin requests        |
| Werkzeug           | File handling and validation |

### AI / NLP

| Technology       | Purpose                      |
| ---------------- | ---------------------------- |
| pdfplumber       | PDF text extraction          |
| python-docx      | DOCX text extraction         |
| Scikit-learn     | TF-IDF and cosine similarity |
| Regex            | Entity and skill extraction  |
| Keyword Matching | Resume/JD skill analysis     |

### Database

**SQLite**

SQLite keeps the project simple and zero-config for local development. The database is automatically created when the Flask application starts.

---

## 🏗️ Project Architecture

```text
resume-analyzer/
│
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── extensions.py
│   ├── models.py
│   │
│   ├── routes/
│   │   ├── auth.py
│   │   ├── dashboard.py
│   │   ├── match.py
│   │   ├── resume.py
│   │   └── __init__.py
│   │
│   ├── utils/
│   │   ├── ats_scorer.py
│   │   ├── job_matcher.py
│   │   ├── parser.py
│   │   ├── skills_data.py
│   │   └── __init__.py
│   │
│   ├── uploads/
│   │   └── .gitkeep
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/khan2234mehak/resume-analyzer.git
cd resume-analyzer
```

---

## ⚙️ Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the Flask server:

```bash
python app.py
```

Backend will run on:

```text
http://localhost:5010
```

Health check:

```text
http://localhost:5010/api/health
```

---

## 🎨 Frontend Setup

Open a new terminal and navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

Configure the API URL inside `.env` if required.

Start the development server:

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

## 🔑 Environment Variables

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:5010/api
```

> Never commit real secrets or private environment variables to GitHub.

---

## 📈 ATS Scoring Methodology

The ATS score is calculated using six factors:

| Factor              | Weight |
| ------------------- | -----: |
| Section Coverage    |    25% |
| Skills Presence     |    20% |
| Contact Information |    15% |
| Resume Length       |    15% |
| Action Verbs        |    15% |
| Formatting          |    10% |

### Score Formula

```text
ATS Score =
    Section Coverage × 25%
  + Contact Information × 15%
  + Resume Length × 15%
  + Action Verbs × 15%
  + Skills Presence × 20%
  + Formatting × 10%
```

The scoring logic is intentionally **rule-based and explainable**, making it easy to understand why a resume receives a particular score.

---

## 🎯 Job Matching Methodology

The Job Match Engine combines two signals:

```text
Final Match Score =
    Skill Coverage × 60%
  + TF-IDF Similarity × 40%
```

### Skill Coverage

The system extracts skills from both the resume and job description and calculates their overlap.

### TF-IDF Similarity

Scikit-learn's `TfidfVectorizer` converts the resume and job description into numerical representations.

Cosine similarity is then used to measure textual similarity between them.

This approach provides a lightweight and explainable alternative to large transformer-based models.

---

## 🔒 Security

The application includes:

* JWT-based authentication
* Bcrypt password hashing
* Protected routes
* File type validation
* 5 MB maximum upload size
* Server-side upload validation
* Environment variable support for configuration

---

## 💡 Why This Project?

Resumatic was designed to solve a practical job-search problem:

> **"How well does my resume match the job I am applying for?"**

Instead of relying only on a generic resume score, the application provides specific insights into:

* What is already strong
* Which skills are missing
* How closely the resume matches a job description
* How the ATS score changes over time

The system also uses classical NLP techniques that are **fast, offline-capable, explainable, and easy to demonstrate during technical interviews.**

---

## 📌 Current Limitations

This project intentionally uses classical NLP instead of external LLM or transformer APIs.

Current limitations include:

* Skill extraction relies on a predefined skills dictionary
* Resume parsing uses heuristic and regex-based extraction
* TF-IDF similarity measures textual similarity rather than deep semantic understanding
* SQLite is intended primarily for local/simple deployments

---

## 🔮 Future Improvements

Potential future enhancements:

* [ ] AI-powered cover letter generation
* [ ] Resume improvement suggestions using LLMs
* [ ] PDF analysis report export
* [ ] Resume version comparison
* [ ] More advanced semantic embeddings
* [ ] Job recommendation system
* [ ] Multi-language resume support
* [ ] Cloud database integration
* [ ] Production deployment with scalable storage

---

## 🧪 Development Commands

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Backend

```bash
python app.py
```

---

## 👩‍💻 Author

**Mehak Khan**

GitHub:
https://github.com/khan2234mehak

LinkedIn:
https://www.linkedin.com/in/mehak-khan-a08965354

---

## ⭐ Project

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

**Repository:**
https://github.com/khan2234mehak/resume-analyzer

---

## 📄 License

This project is intended for educational, portfolio, and demonstration purposes.
