import json
import os
import secrets
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException, Header
from fastapi.responses import FileResponse, HTMLResponse
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles


BASE_DIR = Path(__file__).resolve().parents[1]
FRONTEND_DIR = BASE_DIR / "frontend"
DIST_DIR = FRONTEND_DIR / "dist"
STATIC_DIR = DIST_DIR if DIST_DIR.exists() else FRONTEND_DIR
COLLEGE_DATA_FILE = BASE_DIR / "backend" / "college_data.json"
ADMIN_USERNAME = os.getenv("COLLEGE_ADMIN_USERNAME", "principal")
ADMIN_PASSWORD = os.getenv("COLLEGE_ADMIN_PASSWORD", "rampuria-principal")
ACTIVE_TOKENS: set[str] = set()

app = FastAPI(
    title="S. B. J. S. Rampuria Jain College",
    description="A redesigned college website.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


COLLEGE = {
    "name": "S. B. J. S. Rampuria Jain College",
    "tagline": "Nurturing Leaders, Empowering Futures",
    "kicker": "Where Knowledge meets innovation",
    "established": "1934",
    "location": "Dauji Road, Bikaner, Rajasthan",
    "phone": "+91 9214241043",
    "email": "bjsrjaincollege@gmail.com",
    "summary": (
        "Established in 1934 as one of Bikaner's oldest institutions of higher learning, "
        "SBJS Rampuria Jain College carries a legacy of quality education, ethical values, "
        "and contemporary professional learning."
    ),
    "about": [
        "The Institute of Management Studies, offering AICTE-approved MBA programs since 1984, combines academic rigor with practical insights for India's dynamic business landscape.",
        "Students learn through live projects, industry interactions, case studies, seminars, workshops, cultural events, and a campus environment focused on holistic growth.",
        "The college blends Jain heritage, Rajasthan's entrepreneurial spirit, digital learning resources, and a large alumni network to prepare confident graduates.",
    ],
    "highlights": [
        "AICTE-approved MBA since 1984",
        "Strong alumni base of professionals and entrepreneurs",
        "State-of-the-art infrastructure and digital learning resources",
        "Experiential learning with industry relevance",
        "Values rooted in Jain heritage and public service",
    ],
    "stats": [
        {"value": "50,000+", "label": "Undergraduate and graduate enrollments"},
        {"value": "150+", "label": "Dedicated staff serving students and society"},
        {"value": "40,000+", "label": "SBJSR Jain College alumni worldwide"},
        {"value": "60,000+", "label": "Books, e-books, journals, and dailies"},
    ],
    "courses": [
        {
            "title": "Business Administration, MBA",
            "type": "Postgraduate",
            "description": "A management program focused on leadership, enterprise, analytics, and industry practice.",
            "duration": "2 years",
            "fees": "25k/year",
            "route": "/mba",
            "syllabus_pdf": "assets/syllabus/mba.pdf",
            "focus": "Leadership, finance, marketing, strategy, entrepreneurship, and management analytics.",
            "why_choose": [
                "Built for students who want to move into management, corporate leadership, startups, banking, consulting, or family business.",
                "Learning is connected with case studies, presentations, seminars, live projects, and industry conversations.",
                "The program carries the college's long management education legacy through the Institute of Management Studies.",
            ],
            "quote": "Choose MBA here if you want your ambition to become practical, confident, and ready for the real business world.",
        },
        {
            "title": "Business Administration, BBA",
            "type": "Undergraduate",
            "description": "A foundation in business, communication, finance, and organizational decision-making.",
            "duration": "3 years",
            "fees": "25k/year",
            "route": "/bba",
            "syllabus_pdf": "assets/syllabus/bba.pdf",
            "focus": "Business foundations, communication, accounting, marketing, economics, and decision-making.",
            "why_choose": [
                "A smart first step for students planning careers in management, commerce, entrepreneurship, or an MBA.",
                "Builds confidence through classroom discussions, projects, presentations, and campus participation.",
                "Helps students understand how organizations work before choosing a specialized career path.",
            ],
            "quote": "BBA is for students who want to understand business early and grow into sharper decision-makers.",
        },
        {
            "title": "Fine Arts, BFA",
            "type": "Undergraduate",
            "description": "Creative practice shaped by studio work, visual culture, and artistic expression.",
            "duration": "4 years",
            "fees": "25k/year",
            "route": "/bfa",
            "syllabus_pdf": "assets/syllabus/bfa.pdf",
            "focus": "Drawing, design thinking, visual expression, studio practice, art history, and creative portfolio development.",
            "why_choose": [
                "A strong fit for students who think visually and want to turn creativity into disciplined practice.",
                "Encourages personal expression while building technique, observation, patience, and presentation skills.",
                "Prepares students for creative careers, freelance practice, design pathways, and higher studies in art.",
            ],
            "quote": "Fine Arts gives students the space to turn imagination into skill, and skill into a visible voice.",
        },
        {
            "title": "Computer Applications, BCA",
            "type": "Undergraduate",
            "description": "Computing fundamentals, application development, and digital problem solving.",
            "duration": "3 years",
            "fees": "25k/year",
            "route": "/bca",
            "syllabus_pdf": "assets/syllabus/bca.pdf",
            "focus": "Programming, databases, web technologies, computer fundamentals, software logic, and digital systems.",
            "why_choose": [
                "Designed for students who want to enter software, IT services, web development, data, or technology-driven careers.",
                "Strengthens logical thinking through coding, application design, database work, and problem-solving practice.",
                "Creates a practical base for MCA, technical certifications, internships, and junior developer roles.",
            ],
            "quote": "BCA is where curiosity about computers becomes the confidence to build real digital solutions.",
        },
        {
            "title": "Information Technology, MSc IT",
            "type": "Postgraduate",
            "description": "Advanced study in information technology, software systems, databases, and applied computing.",
            "duration": "2 years",
            "fees": "25k/year",
            "route": "/msc-it",
            "syllabus_pdf": "assets/syllabus/msc-it.pdf",
            "focus": "Advanced programming, data management, networking, web systems, research thinking, and IT project development.",
            "why_choose": [
                "A strong postgraduate path for students who want deeper technical knowledge after a computing or science background.",
                "Supports careers in software development, IT management, database systems, technical support, and digital transformation.",
                "Builds confidence for research, higher studies, technical interviews, and practical technology projects.",
            ],
            "quote": "MSc IT is for students who want to move from using technology to understanding, managing, and building it.",
        },
        {
            "title": "Science, BSc",
            "type": "Undergraduate",
            "description": "A science program focused on analytical thinking, laboratory discipline, observation, and academic foundations.",
            "duration": "3 years",
            "fees": "25k/year",
            "route": "/bsc",
            "syllabus_pdf": "assets/syllabus/bsc.pdf",
            "focus": "Scientific reasoning, practical observation, subject foundations, experimentation, and research readiness.",
            "why_choose": [
                "A strong path for students who want a disciplined science foundation before higher studies or competitive preparation.",
                "Builds observation, accuracy, problem-solving, and confidence through structured academic practice.",
                "Supports future pathways in science, education, research support, and postgraduate study.",
            ],
            "quote": "BSc helps students turn curiosity about the world into disciplined knowledge and practical confidence.",
        },
        {
            "title": "Commerce, BCom",
            "type": "Undergraduate",
            "description": "A commerce program focused on accounting, business knowledge, economics, finance, and professional readiness.",
            "duration": "3 years",
            "fees": "25k/year",
            "route": "/bcom",
            "syllabus_pdf": "assets/syllabus/bcom.pdf",
            "focus": "Accounting, business studies, economics, taxation basics, finance, and commercial decision-making.",
            "why_choose": [
                "A practical stream for students interested in business, finance, accounting, banking, or entrepreneurship.",
                "Creates a strong foundation for MCom, professional certifications, and entry-level commerce roles.",
                "Helps students understand how money, markets, organizations, and records work together.",
            ],
            "quote": "BCom gives students the commercial foundation to understand business with clarity and confidence.",
        },
    ],
    "campus_life": [
        {
            "title": "Pulse of Campus",
            "description": "Ideas find their voice and friendships are formed through shared pursuit of knowledge.",
            "subtitle": "Where ideas find their voice",
            "details": [
                "The campus is far more than a collection of classrooms and corridors. It is a living, breathing space filled with curiosity, ambition, collaboration, and growth. Every corridor conversation, late-night study session, debate in the college courtyard, seminar, and shared reading recommendation contributes to an intellectual culture that shapes young minds in ways no textbook alone can. Students from different backgrounds and dreams bring their own perspectives, spark new ideas, and challenge old assumptions. It is here that a casual lunch table discussion can evolve into a startup pitch, a seminar can redirect an academic journey, and a club meeting can shape leadership. Campus life teaches what no syllabus can: collaboration, resilience, humility, and the courage to stand by an unconventional idea. In every library corner and open space, the same truth is repeated: knowledge is not merely acquired alone, but created, debated, and understood together.",
            ],
            "detail_cards": [
                {"title": "Ideas ignited", "body": "Every debate and discussion sparks something new and unexpected."},
                {"title": "Bonds forged", "body": "Friendships built on shared ambition last a lifetime."},
                {"title": "Leaders shaped", "body": "Club meetings and events create real-world confidence and skill."},
                {"title": "Voices heard", "body": "Open mics, fests, and seminars celebrate every identity."},
            ],
            "quote": "Knowledge is not merely acquired alone — it is created, debated, and truly understood together.",
        },
        {
            "title": "Creative Sparks",
            "description": "Artistic expression complements scholarly life and builds confidence beyond classrooms.",
            "subtitle": "Where art meets academic ambition",
            "details": [
                "Creativity is not a luxury reserved only for art students. It is the heartbeat of a truly rounded education, and on a vibrant campus it finds expression in unexpected and extraordinary ways. Theatre, painting, photography, poetry, music, design, cultural events, and quiet personal expression all open doors that academic rigour alone cannot unlock. Creative work teaches students to sit with uncertainty, embrace failure as a draft rather than a defeat, and trust the voice inside them that says something worth making is worth making with honesty. The stage, studio, dance floor, poetry slam, and photography corner are not escapes from scholarly life, but extensions of it. A student who performs learns presence; a student who paints learns patience; friends who form a band learn listening and collaboration. In these moments students discover not just what they can do, but who they are.",
            ],
            "detail_cards": [
                {"title": "Performing arts", "body": "Theatre and dance build presence, empathy, and bold communication."},
                {"title": "Literary voice", "body": "Poetry, writing, and speaking turn inner thoughts into powerful stories."},
                {"title": "Visual arts", "body": "Photography, painting, and design teach students to see differently."},
                {"title": "Music and rhythm", "body": "Bands and ensembles teach deep listening and joyful collaboration."},
            ],
            "quote": "Creativity teaches us to trust the voice inside us — the one that says something worth making is worth making sincerely.",
        },
        {
            "title": "Victory Zone",
            "description": "Physical wellness, teamwork, resilience, and focus are treated as part of student success.",
            "subtitle": "Where bodies are trained and champions are made",
            "details": [
                "On a campus that truly cares about its students, physical wellness is never an afterthought. It is woven into the fabric of student success. The Victory Zone is where sweat, strategy, and determination converge to build not just stronger bodies, but stronger minds and more resilient spirits. Sport is a classroom without walls: every match teaches how to perform under pressure, trust teammates, recover after setbacks, and celebrate a win with grace. Students who engage in physical activity, whether competitively on the field or quietly through daily fitness, build sharper focus, better stress management, and a greater capacity for sustained effort. The discipline of practice carries into academic life, and the resilience of playing through fatigue becomes the resilience of pushing through a tough semester. The most important victories are often the ones won within.",
            ],
            "detail_cards": [
                {"title": "Physical fitness", "body": "Daily movement sharpens focus and fuels academic performance."},
                {"title": "Teamwork", "body": "Team sports teach trust, collective purpose, and shared sacrifice."},
                {"title": "Resilience", "body": "Losing and bouncing back builds the grit that defines lasting success."},
                {"title": "Mental focus", "body": "Discipline on the field carries directly into the classroom and beyond."},
            ],
            "quote": "The most important victories are the ones won within — over doubt, over fatigue, and over the temptation to give up.",
        },
    ],
    "faculty": [
        {"name": "Aniket Kachhawa", "role": "Lecturer - Fine Arts"},
        {"name": "Dr. Shashi Kala Ranga", "role": "Lecturer"},
        {"name": "Manish Tanwar", "role": "Professor of Finance and Statistics"},
        {"name": "Smt. Mousam Maru", "role": "Lecturer - Department of Computer Science"},
        {"name": "Smt. Seema Biswa", "role": "Lecturer - Department of Computer Science"},
    ],
    "alumni": [
        {
            "name": "Satish Agarwal",
            "role": "Branch Head",
            "quote": "The dynamic curriculum, supportive faculty, and exposure to real-world business scenarios shaped my professional foundation.",
        },
        {
            "name": "Vinay Rathi",
            "role": "Teacher",
            "quote": "The blend of academic excellence, interactive learning methods, and extracurricular activities provided a well-rounded experience.",
        },
        {
            "name": "Sunder Jain",
            "role": "Entrepreneur",
            "quote": "Case studies, simulations, and industry interactions prepared me for the corporate world.",
        },
        {
            "name": "Arpita Sharda",
            "role": "Event Manager",
            "quote": "Management seminars and cultural events helped build my confidence and communication skills.",
        },
    ],
    "contacts": [
        {
            "campus": "Kote-gate",
            "address": "Dauji Road, Inside Kote-gate, Bikaner, Rajasthan, India",
            "phone": "+91 9214241043",
            "email": "bjsrjaincollege@gmail.com",
        },
        {
            "campus": "JNV Colony",
            "address": "JNV Colony, Statue Circle, Bikaner, Rajasthan, India",
            "phone": "+91 9214241042",
            "email": "imsbikaner@gmail.com",
        },
        {
            "campus": "Jai Narayan Vyas",
            "address": "Jai Narayan Vyas Colony, Statue Circle, Bikaner, Rajasthan, India",
            "phone": "+91 1512231443",
            "email": "bjsrlc1973@gmail.com",
        },
    ],
    "links": [
        {"label": "UGC", "url": "https://www.ugc.gov.in/"},
        {"label": "AICTE", "url": "https://www.aicte-india.org/"},
        {"label": "Maharaja Ganga Singh University", "url": "https://www.mgsubikaner.ac.in/"},
        {"label": "Bikaner Technical University", "url": "https://btu.ac.in/"},
        {"label": "Scholarships", "url": "https://scholarships.gov.in/"},
        {"label": "Rajasthan SSO", "url": "https://sso.rajasthan.gov.in/"},
        {"label": "National Career Service", "url": "https://www.ncs.gov.in/"},
        {"label": "NCC", "url": "https://nccindia.gov.in/"},
        {"label": "NSS", "url": "https://nss.gov.in/"},
    ],
}


MCOM_COURSE = {
    "title": "Commerce, MCom",
    "type": "Postgraduate",
    "description": "Advanced commerce study in accounting, finance, research, taxation, and business decision-making.",
    "duration": "2 years",
    "fees": "25k/year",
    "route": "/mcom",
    "syllabus_pdf": "api/syllabus/mcom",
    "focus": "Advanced accounting, financial management, business research, taxation, economics, and strategic commerce.",
    "why_choose": [
        "Builds advanced knowledge for careers in finance, accounting, banking, education, and business research.",
        "Strengthens analytical ability through financial reporting, research methods, and commercial case studies.",
        "Creates a solid foundation for doctoral research, professional qualifications, and commerce leadership roles.",
    ],
    "quote": "MCom is for graduates who want to deepen their commerce expertise and make more confident financial decisions.",
}

ARTS_COURSE = {
    "title": "Arts, BA & MA",
    "type": "Undergraduate + Postgraduate",
    "description": "A complete arts pathway, from a strong BA foundation to advanced MA study in humanities and social sciences.",
    "duration": "BA: 3 years · MA: 2 years",
    "fees": "25k/year",
    "route": "/ba",
    "syllabus_pdf": "api/syllabus/arts",
    "focus": "Humanities, social sciences, communication, critical thinking, research, and academic writing.",
    "why_choose": [
        "Choose BA to build a broad academic foundation and confident communication skills.",
        "Continue with MA for deeper subject expertise, analytical ability, and research readiness.",
        "The combined pathway supports teaching, research, public service, communication, and higher-study goals.",
    ],
    "quote": "Study the ideas that shape people and society, then turn that understanding into a meaningful future.",
}


def ensure_mcom(data: dict) -> dict:
    if not any(course.get("route") == "/mcom" for course in data.get("courses", [])):
        data.setdefault("courses", []).append(MCOM_COURSE)
    if not any(course.get("route") == "/ba" for course in data.get("courses", [])):
        data.setdefault("courses", []).append(ARTS_COURSE)
    return data


if COLLEGE_DATA_FILE.exists():
    COLLEGE = json.loads(COLLEGE_DATA_FILE.read_text(encoding="utf-8"))
COLLEGE = ensure_mcom(COLLEGE)


class LoginRequest(BaseModel):
    username: str
    password: str


def require_admin(authorization: str | None) -> None:
    token = authorization.removeprefix("Bearer ").strip() if authorization else ""
    if token not in ACTIVE_TOKENS:
        raise HTTPException(status_code=401, detail="Principal login required")


@app.post("/api/admin/login")
def admin_login(credentials: LoginRequest):
    if credentials.username != ADMIN_USERNAME or credentials.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = secrets.token_urlsafe(32)
    ACTIVE_TOKENS.add(token)
    return {"token": token}


@app.put("/api/admin/college")
def update_college(data: dict, authorization: str | None = Header(default=None)):
    require_admin(authorization)
    global COLLEGE
    COLLEGE = ensure_mcom(data)
    COLLEGE_DATA_FILE.write_text(json.dumps(COLLEGE, indent=2, ensure_ascii=False), encoding="utf-8")
    return COLLEGE


@app.get("/api/college")
def get_college():
    return COLLEGE


@app.get("/api/syllabus/mcom")
def mcom_syllabus():
    return HTMLResponse("""<!doctype html><html><head><title>MCom syllabus overview</title><style>body{font:16px Arial;padding:32px;color:#151515;line-height:1.55}h1{font-family:Georgia;color:#8f1020}h2{margin-top:28px;color:#0f6763}li{margin:7px 0}</style></head><body><h1>Master of Commerce (MCom)</h1><p><strong>Duration:</strong> 2 years &nbsp; | &nbsp; <strong>Annual fee:</strong> 25k/year</p><h2>Year one</h2><ul><li>Advanced Financial Accounting</li><li>Managerial Economics</li><li>Corporate Finance and Financial Management</li><li>Business Statistics and Research Methods</li><li>Direct and Indirect Taxation</li></ul><h2>Year two</h2><ul><li>Strategic Cost and Management Accounting</li><li>International Business and Financial Markets</li><li>Auditing and Corporate Governance</li><li>Entrepreneurship and Business Policy</li><li>Research Project / Dissertation</li></ul><p>This on-site overview is provided for syllabus browsing; the college may update the final university-prescribed syllabus through the principal portal.</p></body></html>""")


@app.get("/api/syllabus/arts")
def arts_syllabus():
    return HTMLResponse("""<!doctype html><html><head><title>Arts syllabus overview</title><style>body{font:16px Arial;padding:32px;color:#151515;line-height:1.55}h1{font-family:Georgia;color:#8f1020}h2{margin-top:28px;color:#0f6763}li{margin:7px 0}</style></head><body><h1>BA &amp; MA Arts Pathway</h1><p><strong>BA:</strong> 3 years &nbsp; | &nbsp; <strong>MA:</strong> 2 years &nbsp; | &nbsp; <strong>Annual fee:</strong> 25k/year</p><h2>Bachelor of Arts (BA)</h2><ul><li>Humanities and social science foundations</li><li>Language and communication</li><li>Indian society, culture, and public life</li><li>Critical thinking and academic writing</li></ul><h2>Master of Arts (MA)</h2><ul><li>Advanced subject study and theory</li><li>Research methods and analysis</li><li>Academic writing and seminar work</li><li>Dissertation / project work</li></ul><p>The final course structure follows the university-prescribed syllabus and may be updated through the principal portal.</p></body></html>""")


@app.get("/")
def index():
    return FileResponse(STATIC_DIR / "index.html")

#app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")


@app.get("/{full_path:path}")
def spa_fallback(full_path: str):
    requested_file = STATIC_DIR / full_path
    if requested_file.is_file():
        return FileResponse(requested_file)
    return FileResponse(STATIC_DIR / "index.html")
