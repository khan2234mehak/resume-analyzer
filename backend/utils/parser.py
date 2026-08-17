import re
import pdfplumber
import docx

from utils.skills_data import ALL_SKILLS


def extract_text_from_pdf(filepath):
    text = []
    with pdfplumber.open(filepath) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text.append(page_text)
    return "\n".join(text)


def extract_text_from_docx(filepath):
    document = docx.Document(filepath)
    return "\n".join(p.text for p in document.paragraphs if p.text.strip())


def extract_text(filepath, extension):
    if extension == "pdf":
        return extract_text_from_pdf(filepath)
    elif extension == "docx":
        return extract_text_from_docx(filepath)
    raise ValueError(f"Unsupported file extension: {extension}")


EMAIL_REGEX = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
PHONE_REGEX = re.compile(r"(?:(?:\+?\d{1,3}[-.\s]?)?\d{10}|\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})")
LINKEDIN_REGEX = re.compile(r"(?:https?://)?(?:www\.)?linkedin\.com/in/[A-Za-z0-9_-]+/?")
GITHUB_REGEX = re.compile(r"(?:https?://)?(?:www\.)?github\.com/[A-Za-z0-9_-]+/?")


def extract_email(text):
    match = EMAIL_REGEX.search(text)
    return match.group(0) if match else None


def extract_phone(text):
    match = PHONE_REGEX.search(text)
    return match.group(0).strip() if match else None


def extract_links(text):
    links = []
    linkedin = LINKEDIN_REGEX.search(text)
    github = GITHUB_REGEX.search(text)
    if linkedin:
        links.append(linkedin.group(0))
    if github:
        links.append(github.group(0))
    return links


def extract_name(text):
    """Heuristic: the first non-empty line that looks like a name
    (2-4 words, no digits, no @ symbol) is usually the candidate's name."""
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    for line in lines[:5]:
        words = line.split()
        if 1 < len(words) <= 4 and not any(char.isdigit() for char in line) and "@" not in line:
            if not any(kw in line.lower() for kw in ["resume", "curriculum", "vitae", "cv"]):
                return line.title()
    return None


def extract_skills(text):
    text_lower = text.lower()
    found = []
    for skill in ALL_SKILLS:
        # word-boundary-ish match, tolerant of punctuation like c++/c#
        pattern = re.escape(skill)
        if re.search(rf"(?<![a-zA-Z0-9]){pattern}(?![a-zA-Z0-9])", text_lower):
            found.append(skill)
    return sorted(set(found))


def extract_education(text):
    edu_keywords = ["bachelor", "master", "b.tech", "m.tech", "bca", "mca", "b.sc",
                     "m.sc", "phd", "diploma", "university", "college", "institute"]
    lines = text.split("\n")
    results = []
    for line in lines:
        line_clean = line.strip()
        if len(line_clean) < 5:
            continue
        if any(kw in line_clean.lower() for kw in edu_keywords):
            results.append(line_clean)
    return results[:6]


def extract_experience(text):
    """Grab lines that look like bullet points or contain action verbs,
    limited to a reasonable count for preview purposes."""
    from utils.skills_data import ACTION_VERBS
    lines = text.split("\n")
    results = []
    for line in lines:
        line_clean = line.strip("•-*  \t").strip()
        if len(line_clean) < 15:
            continue
        first_word = line_clean.split(" ")[0].lower().strip(".,")
        if first_word in ACTION_VERBS:
            results.append(line_clean)
    return results[:10]


def parse_resume(filepath, extension):
    raw_text = extract_text(filepath, extension)
    return {
        "raw_text": raw_text,
        "full_name": extract_name(raw_text),
        "email": extract_email(raw_text),
        "phone": extract_phone(raw_text),
        "links": extract_links(raw_text),
        "skills": extract_skills(raw_text),
        "education": extract_education(raw_text),
        "experience": extract_experience(raw_text),
    }
