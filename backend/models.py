from datetime import datetime
from extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    resumes = db.relationship("Resume", backref="owner", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {"id": self.id, "name": self.name, "email": self.email}


class Resume(db.Model):
    __tablename__ = "resumes"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    raw_text = db.Column(db.Text, nullable=True)

    # Parsed fields
    full_name = db.Column(db.String(120))
    email = db.Column(db.String(120))
    phone = db.Column(db.String(50))
    skills = db.Column(db.Text)  # JSON stringified list
    education = db.Column(db.Text)  # JSON stringified list
    experience = db.Column(db.Text)  # JSON stringified list
    links = db.Column(db.Text)  # JSON stringified list

    ats_score = db.Column(db.Integer, default=0)
    section_scores = db.Column(db.Text)  # JSON stringified dict

    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

    analyses = db.relationship("JobMatchAnalysis", backref="resume", lazy=True, cascade="all, delete-orphan")

    def to_dict(self, include_text=False):
        import json
        data = {
            "id": self.id,
            "filename": self.original_filename,
            "full_name": self.full_name,
            "email": self.email,
            "phone": self.phone,
            "skills": json.loads(self.skills) if self.skills else [],
            "education": json.loads(self.education) if self.education else [],
            "experience": json.loads(self.experience) if self.experience else [],
            "links": json.loads(self.links) if self.links else [],
            "ats_score": self.ats_score,
            "section_scores": json.loads(self.section_scores) if self.section_scores else {},
            "uploaded_at": self.uploaded_at.isoformat(),
        }
        if include_text:
            data["raw_text"] = self.raw_text
        return data


class JobMatchAnalysis(db.Model):
    __tablename__ = "job_match_analyses"

    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey("resumes.id"), nullable=False)
    job_title = db.Column(db.String(200))
    company_name = db.Column(db.String(200))
    job_description = db.Column(db.Text)

    match_percentage = db.Column(db.Float)
    matching_skills = db.Column(db.Text)  # JSON list
    missing_skills = db.Column(db.Text)  # JSON list
    semantic_similarity = db.Column(db.Float)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        import json
        return {
            "id": self.id,
            "resume_id": self.resume_id,
            "job_title": self.job_title,
            "company_name": self.company_name,
            "match_percentage": self.match_percentage,
            "matching_skills": json.loads(self.matching_skills) if self.matching_skills else [],
            "missing_skills": json.loads(self.missing_skills) if self.missing_skills else [],
            "semantic_similarity": self.semantic_similarity,
            "created_at": self.created_at.isoformat(),
        }
