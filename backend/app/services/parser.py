import re
from typing import Dict, Any, List
from io import BytesIO
from pypdf import PdfReader
import docx

SECTION_PATTERNS = {
    "summary": [r"summary", r"professional summary", r"about me", r"profile", r"objective"],
    "education": [r"education", r"academic background", r"qualifications", r"academic history"],
    "skills": [r"skills", r"technical skills", r"core competencies", r"technologies", r"skill set"],
    "projects": [r"projects", r"personal projects", r"key projects", r"technical projects", r"portfolio"],
    "experience": [r"experience", r"work experience", r"employment history", r"professional experience", r"internships"],
    "certifications": [r"certifications", r"certificates", r"licenses", r"credentials"],
    "achievements": [r"achievements", r"awards", r"honors", r"accomplishments"],
    "languages": [r"languages", r"language proficiencies"]
}

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts text from PDF bytes using pypdf."""
    reader = PdfReader(BytesIO(file_bytes))
    text_parts = []
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text_parts.append(extracted)
    return "\n".join(text_parts).strip()

def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extracts text from DOCX bytes using python-docx."""
    doc = docx.Document(BytesIO(file_bytes))
    text_parts = []
    for para in doc.paragraphs:
        if para.text.strip():
            text_parts.append(para.text.strip())
    for table in doc.tables:
        for row in table.rows:
            row_texts = [cell.text.strip() for cell in row.cells if cell.text.strip()]
            if row_texts:
                text_parts.append(" | ".join(row_texts))
    return "\n".join(text_parts).strip()

def extract_contact_info(text: str) -> Dict[str, Any]:
    """Extracts emails, phone numbers, links and locations using regex."""
    emails = re.findall(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
    phones = re.findall(r"(?:(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4})", text)
    # Filter valid looking phone numbers
    valid_phones = [p.strip() for p in phones if len(re.sub(r"\D", "", p)) >= 10 and len(re.sub(r"\D", "", p)) <= 15]
    
    linkedin = re.findall(r"(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+", text, re.IGNORECASE)
    github = re.findall(r"(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+", text, re.IGNORECASE)
    
    return {
        "email": emails[0] if emails else None,
        "phone": valid_phones[0] if valid_phones else None,
        "linkedin": linkedin[0] if linkedin else None,
        "github": github[0] if github else None
    }

def segment_resume_sections(text: str) -> Dict[str, str]:
    """Segments the extracted resume text into identifiable sections."""
    lines = text.split("\n")
    sections: Dict[str, List[str]] = {
        "header": [],
        "summary": [],
        "education": [],
        "skills": [],
        "projects": [],
        "experience": [],
        "certifications": [],
        "achievements": [],
        "languages": [],
        "other": []
    }
    
    current_section = "header"
    
    for line in lines:
        cleaned = line.strip()
        if not cleaned:
            continue
            
        lower_line = cleaned.lower()
        # Check if line is a section heading (short line, matches known section keywords)
        matched_section = None
        if len(cleaned) < 35:
            # Strip trailing punctuation or colons
            header_candidate = re.sub(r"[:\-_#=*]+$", "", lower_line).strip()
            for sec_name, patterns in SECTION_PATTERNS.items():
                for pat in patterns:
                    if re.fullmatch(pat, header_candidate):
                        matched_section = sec_name
                        break
                if matched_section:
                    break
                    
        if matched_section:
            current_section = matched_section
        else:
            sections[current_section].append(cleaned)
            
    return {k: "\n".join(v).strip() for k, v in sections.items() if v}
