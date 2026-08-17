import json
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models import Resume, JobMatchAnalysis
from utils.job_matcher import analyze_job_match

match_bp = Blueprint("match", __name__)


@match_bp.route("/analyze", methods=["POST"])
@jwt_required()
def analyze_match():
    user_id = get_jwt_identity()
    data = request.get_json(silent=True) or {}

    resume_id = data.get("resume_id")
    job_description = (data.get("job_description") or "").strip()
    job_title = (data.get("job_title") or "").strip()
    company_name = (data.get("company_name") or "").strip()

    if not resume_id or not job_description:
        return jsonify({"error": "resume_id and job_description are required."}), 400

    if len(job_description) < 50:
        return jsonify({"error": "Job description is too short for meaningful analysis."}), 400

    resume = Resume.query.filter_by(id=resume_id, user_id=user_id).first()
    if not resume:
        return jsonify({"error": "Resume not found."}), 404

    resume_skills = json.loads(resume.skills) if resume.skills else []
    result = analyze_job_match(resume.raw_text or "", resume_skills, job_description)

    analysis = JobMatchAnalysis(
        resume_id=resume.id,
        job_title=job_title,
        company_name=company_name,
        job_description=job_description,
        match_percentage=result["match_percentage"],
        matching_skills=json.dumps(result["matching_skills"]),
        missing_skills=json.dumps(result["missing_skills"]),
        semantic_similarity=result["semantic_similarity"],
    )
    db.session.add(analysis)
    db.session.commit()

    response = analysis.to_dict()
    response["skill_coverage"] = result["skill_coverage"]
    return jsonify(response), 201


@match_bp.route("/history/<int:resume_id>", methods=["GET"])
@jwt_required()
def match_history(resume_id):
    user_id = get_jwt_identity()
    resume = Resume.query.filter_by(id=resume_id, user_id=user_id).first()
    if not resume:
        return jsonify({"error": "Resume not found."}), 404

    analyses = JobMatchAnalysis.query.filter_by(resume_id=resume_id).order_by(
        JobMatchAnalysis.created_at.desc()
    ).all()
    return jsonify([a.to_dict() for a in analyses]), 200
