from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# 🔑 Configure Gemini using the official SDK
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash-lite")

# 🧠 Your portfolio data (important)
data = """
PERSONAL INFORMATION:
Name: Poojha M
Role: B.Tech Student in Artificial Intelligence and Data Science
Location: Erode, India
CGPA: 9.4/10

SUMMARY:
Poojha is a motivated AI & Data Science student with strong foundations in programming, machine learning, and data analysis. She is passionate about solving real-world problems using AI and building practical applications. She has hands-on experience with Python, machine learning workflows, and software development.

EDUCATION:
- B.Tech in AI & Data Science – K.S.Rangasamy College of Technology
- 12th: 91%
- 10th: 94.6%

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
1. FloatChat – Ocean Data Processing Platform:
- Developed a Python-based system to process oceanographic data from Argo floats
- Worked with NetCDF datasets
- Extracted and analyzed temperature and salinity data
- Designed workflows to simplify scientific data for non-technical users

2. Animal Detection System (Ongoing):
- Built using Django and OpenCV
- Detects animals from real-time CCTV footage
- Integrated Roboflow for model training
- Sends alerts using Twilio when animals are detected
- Focused on real-time monitoring and safety

3. Movie Recommendation System (Ongoing):
- Machine Learning-based recommendation engine
- Suggests movies based on user preferences
- Uses techniques like content-based or collaborative filtering
- Focused on personalization and user experience

MINI PROJECTS:
- Scientific Calculator using Tkinter (Python GUI)
- Attendance Tracker System
- Library Management System (Java)
- Threatly – AI Misinformation Risk Analyzer

INTERNSHIP EXPERIENCE:
Machine Learning & Data Science Virtual Intern – EduSkills
- Worked on real-world datasets
- Learned ML model training and evaluation
- Applied Python for data analysis and preprocessing

CERTIFICATIONS:
- Machine Learning Crash Course – Google
- AI & ML using Microsoft Fabric – Microsoft
- Data Science 101 – IBM

ACHIEVEMENTS:
- Solved 150+ Data Structures and Algorithms problems
- Participated in hackathons and codeathons
- Presented papers in inter-college events

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
A: She has worked on FloatChat (ocean data processing), Animal Detection system, and a Movie Recommendation system.

Q: What makes her unique?
A: She combines strong academic performance with practical project experience and problem-solving skills.

Q: Why should we hire her?
A: She has strong fundamentals, hands-on project experience, and a passion for AI, making her a valuable addition to any team.
"""

@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        user_message = request.json.get("message")
        
        prompt = f"""
        You are Poojha's AI assistant.
        RULES:
        - Answer ONLY from the given data
        - Be clear and professional. Answer politely in 1-3 sentences.
        - If unknown, say "I don't have that information"

        DATA:
        {data}

        QUESTION:
        {user_message}
        """

        response = model.generate_content(prompt)
        return jsonify({"reply": response.text})
        
    except Exception as e:
        print(f"Server Error: {str(e)}")
        return jsonify({"reply": "I'm having trouble connecting right now. Please try again in a moment!"}), 500

if __name__ == "__main__":
    app.run(port=5000)