from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

app = Flask(__name__)
CORS(app)

# 🔑 Configure Gemini
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

# 🧠 Your portfolio data
data = """
PERSONAL INFORMATION:
Name: Poojha M
Role: B.Tech Student in Artificial Intelligence and Data Science
Location: Erode, India
CGPA: 9.4/10

SUMMARY:
Poojha is a motivated AI & Data Science student with strong foundations in programming, machine learning, and data analysis. She is passionate about solving real-world problems using AI and building practical applications. She has hands-on experience with Python, machine learning workflows, and software development.

EDUCATION:
- B.Tech in AI & Data Science – K.S.Rangasamy College of Technology, Tiruchengode, India (CGPA: 9.4/10)
- High School – Isha Vidhya Matric Hr.Sec School, Erode, India (12th Grade: 91%, 10th Grade: 94.6%)

TECHNICAL SKILLS:
Programming Languages:
- Python, Java, C
Libraries & Tools:
- NumPy, Pandas, OpenCV
Frameworks:
- Django, Flask, Streamlit
Database:
- SQL
Concepts:
- Data Structures and Algorithms
- Machine Learning Basics
- Data Analysis
- Problem Solving

PROJECTS:
1. MentorAI – AI Classroom Intelligence System:
    - Problem: Teachers need to explain concepts, generate quizzes, and check student understanding during class.
    - Approach: Voice-enabled classroom co-pilot using Python, Streamlit, Gemini AI, and Whisper; supports explanations, stories, Socratic questions, and quizzes.
    - Result: Interactive teaching support and quick understanding checks in one classroom workflow.
   - GitHub: https://github.com/poojhaManikandan/MentorAI
   - Live Demo: https://mentorai-bf6xvd5kqphpyqy2al9vu4.streamlit.app

2. FloatChat – Ocean Data Processing Platform:
    - Problem: Argo-float NetCDF ocean data is difficult for non-specialists to explore.
    - Approach: Processes float datasets and surfaces temperature and salinity measurements in an accessible dashboard.
    - Result: Makes key ocean observations easier to inspect without parsing raw files.
    - GitHub: https://github.com/Aariyan7/Float_Chat
    - Live Demo: https://float-chat-xi.vercel.app

3. Animal Detection System (Ongoing):
    - Problem: Monitoring camera feeds for animal activity requires constant manual attention.
    - Approach: Django, OpenCV, Roboflow model training, and Twilio alerts.
    - Result: Automated detection-and-alert workflow for monitoring footage.
    - GitHub: https://github.com/poojhaManikandan/animal_detection_live

4. Movie Recommendation System (Ongoing):
    - Problem: Finding films that match a viewer's interests can be time-consuming.
    - Approach: Exploring content-based and collaborative filtering to rank recommendations by user preference.
    - Result: Personalized movie-discovery experience is the goal; development is ongoing.

5. FedHealthAI – Privacy-Focused Healthcare ML:
    - Problem: Hospitals need to collaborate on disease models without sharing private patient records.
    - Approach: Local hospital-node training with secure aggregation; React, FastAPI, and PyTorch.
    - Result: Collaborative model training while raw patient data stays local.
   - GitHub: https://github.com/poojhaManikandan/fed-health-ai

6. Threatly – Misinformation Risk Analyzer:
    - Problem: Readers need help spotting potentially misleading claims in online text.
    - Approach: NLP prototype that scans text and flags potential misinformation risk.
    - Result: Provides a first-pass signal to support further fact-checking.
    - Live Demo: https://threatly-ez6jqdawdgeafcljpay3ht.streamlit.app
    - GitHub: https://github.com/poojhaManikandan/Threatly

MINI PROJECTS:
- Scientific Calculator using Tkinter (Python GUI)
- Attendance Tracker System
- Library Management System (Java)

INTERNSHIP EXPERIENCE:
Data Analysis Intern – Finest Coder (completed, offline, 1 month)
- Developed a project using data analytics tools and presented the project and its findings

Machine Learning & Data Science Virtual Intern – EduSkills
- Used Python and machine learning libraries to analyze real datasets and build predictive models
- Got hands-on experience with the complete ML lifecycle—from cleaning messy data to training, testing, and tweaking the models

CERTIFICATIONS:
- Machine Learning Crash Course – Google
- AI & ML using Microsoft Fabric – Microsoft
- Microsoft SQL: AI Developer Associate (Global Certification)
- Data Science 101 – IBM

ACHIEVEMENTS:
- Made it to the finals at the AI for Good Hackathon with a project focused on social impact
- Practiced problem-solving by cracking over 150 DSA questions on competitive coding sites
- Gave presentations on technical topics at several inter-college events
- Enjoys competing and building software quickly in hackathons and codeathons

STRENGTHS:
- Strong problem-solving ability
- Good communication skills
- Leadership qualities
- Quick learner and adaptable

CAREER GOALS:
- To become a skilled AI/ML engineer
- To work on impactful real-world AI applications
- To continuously learn and improve technical skills

POSSIBLE QUESTIONS AND ANSWERS:

Q: Who is Poojha?
A: Poojha is a B.Tech AI & Data Science student with strong skills in Python, machine learning, and data science.

Q: What are her key skills?
A: Python, Machine Learning, NumPy, Pandas, OpenCV, SQL, Django, and Streamlit.

Q: Tell me about her projects.
A: She has worked on MentorAI (an AI classroom intelligence system), FloatChat (ocean data processing), Animal Detection system, Movie Recommendation system, and FedHealthAI — a federated learning model for privacy-preserving healthcare data analysis.

Q: What is MentorAI?
A: MentorAI is an AI classroom intelligence system Poojha built using Python, Streamlit, Gemini AI, Whisper, and gTTS. It is a voice-enabled classroom assistant that helps teachers simplify concepts, generate quizzes, and deliver story-based learning and Socratic questioning. Live Demo: https://mentorai-bf6xvd5kqphpyqy2al9vu4.streamlit.app , GitHub: https://github.com/poojhaManikandan/MentorAI

Q: What is FedHealthAI?
A: FedHealthAI is a privacy-focused machine learning project where Poojha developed a federated learning model that enables distributed healthcare data analysis. It improves disease prediction accuracy without ever sharing sensitive patient data between nodes.

Q: What makes her unique?
A: She combines strong academic performance with practical project experience and problem-solving skills.

Q: Why should we hire her?
A: She has strong fundamentals, hands-on project experience, and a passion for AI, making her a valuable addition to any team.
"""

@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        user_message = request.json.get("message", "")
        if not user_message:
            return jsonify({"reply": "Please ask me something!"}), 400

        prompt = f"""You are Poojha's AI assistant on her portfolio website.
RULES:
- Answer ONLY from the given data below.
- Be clear, friendly and professional. Answer in 1-3 sentences.
- If the question is not covered in the data, say "I don't have that information."

DATA:
{data}

QUESTION: {user_message}
"""

        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        return jsonify({"reply": response.text})

    except Exception as e:
        print(f"Server Error: {str(e)}")
        return jsonify({"reply": f"Error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)