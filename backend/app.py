import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

from config import Config
from extensions import db, jwt, bcrypt

FRONTEND_DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "frontend_dist")


def create_app():
    app = Flask(__name__, static_folder=FRONTEND_DIST, static_url_path="")
    app.config.from_object(Config)

    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    CORS(app, resources={r"/api/*": {"origins": "*"}})

    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)

    from routes.auth import auth_bp
    from routes.resume import resume_bp
    from routes.match import match_bp
    from routes.dashboard import dashboard_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(resume_bp, url_prefix="/api/resume")
    app.register_blueprint(match_bp, url_prefix="/api/match")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({"status": "ok", "service": "AI Resume Analyzer API"}), 200

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        full_path = os.path.join(app.static_folder, path)
        if path and os.path.exists(full_path):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, "index.html")

    @app.errorhandler(413)
    def file_too_large(e):
        return jsonify({"error": "File too large. Maximum size is 5MB."}), 413

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Resource not found."}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Internal server error."}), 500

    with app.app_context():
        db.create_all()

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5010, host="0.0.0.0")
