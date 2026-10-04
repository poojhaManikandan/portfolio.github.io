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
   - Problem: Teachers need to explain concepts, generate quizzes, and check student understanding during class.
   - Approach: Voice-enabled classroom co-pilot using Python, Streamlit, Gemini AI, and Whisper; supports explanations, stories, Socratic questions, and quizzes.
   - Result: Interactive teaching support and quick understanding checks in one classroom workflow.
   - GitHub: https://github.com/poojhaManikandan/MentorAI
   - Live Demo: https://mentorai-bf6xvd5kqphpyqy2al9vu4.streamlit.app

2. FloatChat – Ocean Data Processing Platform:
   - Problem: Argo-float NetCDF ocean data is difficult for non-specialists to explore.
   - Approach: Processes float datasets and surfaces temperature and salinity measurements in an accessible dashboard.
   - Result: Makes key ocean observations easier to inspect without parsing raw files.
   - Live Demo: https://float-chat-xi.vercel.app
   - GitHub: https://github.com/Aariyan7/Float_Chat

3. Animal Detection System:
   - Problem: Monitoring camera feeds for animal activity requires constant manual attention.
   - Approach: Django, OpenCV, Roboflow model training, and Twilio alerts.
   - Result: Automated detection-and-alert workflow for monitoring footage.
   - GitHub: https://github.com/poojhaManikandan/animal_detection

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
- Scientific Calculator (Tkinter), Attendance Tracker, Library Management System (Java)

INTERNSHIP:
- Data Analysis Intern – Finest Coder (completed, offline, 1 month)
  - Developed a project using data analytics tools and presented the project and its findings
Machine Learning & Data Science Virtual Intern – EduSkills
- Built predictive models, hands-on ML lifecycle experience

CERTIFICATIONS:
- Machine Learning Crash Course – Google
- AI & ML using Microsoft Fabric – Microsoft
- Microsoft SQL: AI Developer Associate (Global Certification)
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
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
    if (!message) {
      return res.status(400).json({ reply: "Please ask me something!" });
    }
    if (message.length > 1000) {
      return res.status(400).json({ reply: "Please keep your message under 1,000 characters." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ reply: "API key not configured." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt = `You are Poojha's AI assistant on her portfolio website.
RULES:
- Answer ONLY using the data provided below.
- Be friendly and professional. Keep answers to 1-3 sentences.
- If not in the data, say "I don't have that information."

DATA:
${data}

QUESTION: ${message}`;

    // Try the configured model first, then a lightweight stable model if it is overloaded.
    const primaryModel = process.env.GEMINI_MODEL || "gemini-3.8-flash";
    const models = [...new Set([primaryModel, "gemini-3.5-flash-lite"])];
    let lastError;
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const reply = result.response.text();
        if (!reply) throw new Error("The model returned an empty response.");
        return res.status(200).json({ reply });
      } catch (err) {
        lastError = err;
        const status = err.status || err.statusCode;
        if (status !== 503 && !String(err.message).includes("503")) break;
        console.warn(`Gemini model ${modelName} is overloaded; trying fallback if available.`);
      }
    }
    throw lastError;

  } catch (err) {
    console.error("Chat error:", err.message);
    const status = err.status || err.statusCode;
    const unavailable = status === 503 || String(err.message).includes("503");
    return res.status(unavailable ? 503 : 500).json({
      reply: unavailable
        ? "The AI assistant is busy right now. Please try again in a moment."
        : "I couldn't process that message right now. Please try again shortly."
    });
  }
};
