from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from utils.skills_data import ALL_SKILLS
from utils.parser import extract_skills


def compute_semantic_similarity(resume_text, jd_text):
    """TF-IDF vectorization + cosine similarity between resume and JD.
    This approximates semantic overlap without needing a downloaded
    transformer model, keeping the service fully offline-capable."""
    vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
    try:
        tfidf_matrix = vectorizer.fit_transform([resume_text, jd_text])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    except ValueError:
        similarity = 0.0
    return round(float(similarity) * 100, 2)


def analyze_job_match(resume_text, resume_skills, jd_text):
    jd_skills = set(extract_skills(jd_text))
    resume_skills_set = set(resume_skills)

    matching_skills = sorted(resume_skills_set & jd_skills)
    missing_skills = sorted(jd_skills - resume_skills_set)

    semantic_similarity = compute_semantic_similarity(resume_text, jd_text)

    if jd_skills:
        skill_coverage = (len(matching_skills) / len(jd_skills)) * 100
    else:
        skill_coverage = 0.0

    # Blend keyword coverage (60%) with semantic similarity (40%)
    # Keyword match matters more for ATS-style screening; semantic
    # similarity captures phrasing/context overlap.
    match_percentage = round((skill_coverage * 0.6) + (semantic_similarity * 0.4), 2)
    match_percentage = min(match_percentage, 100.0)

    return {
        "match_percentage": match_percentage,
        "semantic_similarity": semantic_similarity,
        "skill_coverage": round(skill_coverage, 2),
        "matching_skills": matching_skills,
        "missing_skills": missing_skills,
        "total_jd_skills": len(jd_skills),
    }
