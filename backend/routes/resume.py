import os
import json
import uuid
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename

from extensions import db
from models import Resume
from utils.parser import parse_resume
from utils.ats_scorer import calculate_ats_score, generate_feedback

resume_bp = Blueprint("resume", __name__)


def allowed_file(filename):
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    return ext in current_app.config["ALLOWED_EXTENSIONS"], ext


@resume_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload_resume():
    user_id = get_jwt_identity()

    if "file" not in request.files:
        return jsonify({"error": "No file part in the request."}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected."}), 400

    is_allowed, ext = allowed_file(file.filename)
    if not is_allowed:
        return jsonify({"error": "Only PDF and DOCX files are supported."}), 400

    original_filename = secure_filename(file.filename)
    stored_filename = f"{uuid.uuid4().hex}.{ext}"
    upload_folder = current_app.config["UPLOAD_FOLDER"]
    os.makedirs(upload_folder, exist_ok=True)
    filepath = os.path.join(upload_folder, stored_filename)
    file.save(filepath)

    try:
        parsed = parse_resume(filepath, ext)
    except Exception as e:
        os.remove(filepath)
        return jsonify({"error": f"Failed to parse resume: {str(e)}"}), 422

    ats_score, section_scores = calculate_ats_score(parsed["raw_text"], parsed)
    feedback = generate_feedback(section_scores, parsed)
    section_scores["feedback"] = feedback

    resume = Resume(
        user_id=user_id,
        filename=stored_filename,
        original_filename=original_filename,
        raw_text=parsed["raw_text"],
        full_name=parsed["full_name"],
        email=parsed["email"],
        phone=parsed["phone"],
        skills=json.dumps(parsed["skills"]),
        education=json.dumps(parsed["education"]),
        experience=json.dumps(parsed["experience"]),
        links=json.dumps(parsed["links"]),
        ats_score=ats_score,
        section_scores=json.dumps(section_scores),
    )
    db.session.add(resume)
    db.session.commit()

    return jsonify(resume.to_dict()), 201


@resume_bp.route("/list", methods=["GET"])
@jwt_required()
def list_resumes():
    user_id = get_jwt_identity()
    resumes = Resume.query.filter_by(user_id=user_id).order_by(Resume.uploaded_at.desc()).all()
    return jsonify([r.to_dict() for r in resumes]), 200


@resume_bp.route("/<int:resume_id>", methods=["GET"])
@jwt_required()
def get_resume(resume_id):
    user_id = get_jwt_identity()
    resume = Resume.query.filter_by(id=resume_id, user_id=user_id).first()
    if not resume:
        return jsonify({"error": "Resume not found."}), 404
    return jsonify(resume.to_dict(include_text=True)), 200


@resume_bp.route("/<int:resume_id>", methods=["DELETE"])
@jwt_required()
def delete_resume(resume_id):
    user_id = get_jwt_identity()
    resume = Resume.query.filter_by(id=resume_id, user_id=user_id).first()
    if not resume:
        return jsonify({"error": "Resume not found."}), 404

    filepath = os.path.join(current_app.config["UPLOAD_FOLDER"], resume.filename)
    if os.path.exists(filepath):
        os.remove(filepath)

    db.session.delete(resume)
    db.session.commit()
    return jsonify({"message": "Resume deleted successfully."}), 200
