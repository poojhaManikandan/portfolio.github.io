// api/chat.js - Vercel Node.js Serverless Function
const { GoogleGenerativeAI } = require("@google/generative-ai");

const data = `
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
Programming Languages: Python, Java, C
Libraries & Tools: NumPy, Pandas, OpenCV
Frameworks: Django, Flask, Streamlit
Database: SQL
Concepts: Data Structures and Algorithms, Machine Learning, Data Analysis, Problem Solving

PROJECTS:
1. MentorAI – AI Classroom Intelligence System:
   - Voice-enabled AI classroom assistant using Python, Streamlit, Gemini AI, and Whisper
   - Concept explanations, story-based learning, Socratic questioning, quiz generation
   - GitHub: https://github.com/poojhaManikandan/MentorAI
   - Live Demo: https://mentorai-bf6xvd5kqphpyqy2al9vu4.streamlit.app

2. FloatChat – Ocean Data Processing Platform:
   - Python-based system to process Argo float oceanographic data (NetCDF)
   - Extracts temperature and salinity data for non-technical users

3. Animal Detection System:
   - Built using Django and OpenCV for real-time CCTV animal detection
   - Roboflow model training, Twilio alerts
   - GitHub: https://github.com/poojhaManikandan/animal_detection

4. Movie Recommendation System (Ongoing):
   - ML-based recommendation engine using collaborative/content-based filtering

5. FedHealthAI – Privacy-Focused Healthcare ML:
   - Federated learning model for distributed healthcare data analysis
   - GitHub: https://github.com/poojhaManikandan/fed-health-ai

MINI PROJECTS:
- Scientific Calculator (Tkinter), Attendance Tracker, Library Management System (Java)
- Threatly – AI Misinformation Risk Analyzer

INTERNSHIP:
Machine Learning & Data Science Virtual Intern – EduSkills
- Built predictive models, hands-on ML lifecycle experience

CERTIFICATIONS:
- Machine Learning Crash Course – Google
- AI & ML using Microsoft Fabric – Microsoft
- Data Science 101 – IBM

ACHIEVEMENTS:
- Finalist at AI for Good Hackathon
- 150+ DSA problems solved on competitive coding platforms
- Technical presentations at inter-college events
- Active hackathon and codeathon participant

CONTACT:
- Email: poojhacs.erd@gmail.com
- Phone: +91 9940718507
- Location: Erode, India
- LinkedIn: https://www.linkedin.com/in/poojha-manikandan-332974316
- GitHub: https://github.com/poojhaManikandan
`;

module.exports = async function handler(req, res) {
  // Handle CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ reply: "Please ask me something!" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ reply: "API key not configured." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are Poojha's AI assistant on her portfolio website.
RULES:
- Answer ONLY using the data provided below.
- Be friendly and professional. Keep answers to 1-3 sentences.
- If not in the data, say "I don't have that information."

DATA:
${data}

QUESTION: ${message}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return res.status(200).json({ reply: text });

  } catch (err) {
    console.error("Chat error:", err.message);
    return res.status(500).json({ reply: `Error: ${err.message}` });
  }
};
