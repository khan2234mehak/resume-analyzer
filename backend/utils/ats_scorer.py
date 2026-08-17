import re
from utils.skills_data import RESUME_SECTION_KEYWORDS, ACTION_VERBS


def score_sections_present(text):
    text_lower = text.lower()
    section_scores = {}
    for section, keywords in RESUME_SECTION_KEYWORDS.items():
        found = any(kw in text_lower for kw in keywords)
        section_scores[section] = 100 if found else 0
    return section_scores


def score_contact_info(parsed):
    score = 0
    if parsed.get("email"):
        score += 40
    if parsed.get("phone"):
        score += 30
    if parsed.get("links"):
        score += 30
    return min(score, 100)


def score_length(text):
    word_count = len(text.split())
    if 350 <= word_count <= 900:
        return 100
    if 250 <= word_count < 350 or 900 < word_count <= 1100:
        return 75
    if 150 <= word_count < 250 or 1100 < word_count <= 1400:
        return 50
    return 25


def score_action_verbs(text):
    text_lower = text.lower()
    count = sum(1 for verb in ACTION_VERBS if verb in text_lower)
    # 8+ distinct action verbs used = full marks
    return min(100, round((count / 8) * 100))


def score_skills_presence(skills_found):
    # Reward having a healthy, realistic skill list (not a keyword-stuffed wall)
    n = len(skills_found)
    if n >= 8:
        return 100
    if n >= 5:
        return 75
    if n >= 2:
        return 50
    return 20


def score_bullet_formatting(text):
    bullet_lines = len(re.findall(r"^\s*[•\-\*]", text, flags=re.MULTILINE))
    if bullet_lines >= 6:
        return 100
    if bullet_lines >= 3:
        return 70
    if bullet_lines >= 1:
        return 40
    return 15


def calculate_ats_score(text, parsed):
    section_presence = score_sections_present(text)
    section_avg = sum(section_presence.values()) / len(section_presence)

    contact_score = score_contact_info(parsed)
    length_score = score_length(text)
    verbs_score = score_action_verbs(text)
    skills_score = score_skills_presence(parsed.get("skills", []))
    formatting_score = score_bullet_formatting(text)

    weights = {
        "sections": 0.25,
        "contact_info": 0.15,
        "length": 0.15,
        "action_verbs": 0.15,
        "skills": 0.20,
        "formatting": 0.10,
    }

    overall = (
        section_avg * weights["sections"]
        + contact_score * weights["contact_info"]
        + length_score * weights["length"]
        + verbs_score * weights["action_verbs"]
        + skills_score * weights["skills"]
        + formatting_score * weights["formatting"]
    )

    section_scores = {
        "sections_present": round(section_avg),
        "contact_info": contact_score,
        "resume_length": length_score,
        "action_verbs": verbs_score,
        "skills_presence": skills_score,
        "formatting": formatting_score,
        "section_breakdown": section_presence,
    }

    return round(overall), section_scores


def generate_feedback(section_scores, parsed):
    feedback = []

    if section_scores["contact_info"] < 100:
        missing = []
        if not parsed.get("email"):
            missing.append("email")
        if not parsed.get("phone"):
            missing.append("phone number")
        if not parsed.get("links"):
            missing.append("LinkedIn/GitHub link")
        if missing:
            feedback.append(f"Add missing contact details: {', '.join(missing)}.")

    if section_scores["resume_length"] < 75:
        feedback.append("Adjust resume length — aim for 350-900 words for optimal ATS parsing.")

    if section_scores["action_verbs"] < 75:
        feedback.append("Use more strong action verbs (e.g. built, engineered, optimized) to start bullet points.")

    if section_scores["skills_presence"] < 75:
        feedback.append("List more relevant technical skills explicitly in a dedicated Skills section.")

    if section_scores["formatting"] < 70:
        feedback.append("Use bullet points consistently to describe experience and projects for better ATS parsing.")

    breakdown = section_scores.get("section_breakdown", {})
    missing_sections = [s for s, v in breakdown.items() if v == 0]
    if missing_sections:
        feedback.append(f"Consider adding these sections: {', '.join(missing_sections)}.")

    if not feedback:
        feedback.append("Strong resume overall — well-structured with clear sections and good keyword coverage.")

    return feedback
