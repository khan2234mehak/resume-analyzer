import json
from collections import Counter
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import Resume, JobMatchAnalysis

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/stats", methods=["GET"])
@jwt_required()
def get_stats():
    user_id = get_jwt_identity()
    resumes = Resume.query.filter_by(user_id=user_id).order_by(Resume.uploaded_at.asc()).all()

    if not resumes:
        return jsonify({
            "total_resumes": 0,
            "average_ats_score": 0,
            "latest_ats_score": 0,
            "ats_trend": [],
            "match_trend": [],
            "skill_distribution": [],
            "total_analyses": 0,
        }), 200

    ats_trend = [
        {"date": r.uploaded_at.strftime("%Y-%m-%d"), "filename": r.original_filename, "score": r.ats_score}
        for r in resumes
    ]

    all_analyses = []
    for r in resumes:
        all_analyses.extend(r.analyses)
    all_analyses.sort(key=lambda a: a.created_at)

    match_trend = [
        {
            "date": a.created_at.strftime("%Y-%m-%d"),
            "job_title": a.job_title or "Untitled Role",
            "match_percentage": a.match_percentage,
        }
        for a in all_analyses
    ]

    skill_counter = Counter()
    for r in resumes:
        skills = json.loads(r.skills) if r.skills else []
        skill_counter.update(skills)
    skill_distribution = [
        {"skill": skill, "count": count}
        for skill, count in skill_counter.most_common(10)
    ]

    missing_counter = Counter()
    for a in all_analyses:
        missing = json.loads(a.missing_skills) if a.missing_skills else []
        missing_counter.update(missing)
    top_missing_skills = [
        {"skill": skill, "count": count}
        for skill, count in missing_counter.most_common(8)
    ]

    ats_scores = [r.ats_score for r in resumes]

    return jsonify({
        "total_resumes": len(resumes),
        "average_ats_score": round(sum(ats_scores) / len(ats_scores)),
        "latest_ats_score": resumes[-1].ats_score,
        "ats_trend": ats_trend,
        "match_trend": match_trend,
        "skill_distribution": skill_distribution,
        "top_missing_skills": top_missing_skills,
        "total_analyses": len(all_analyses),
    }), 200
