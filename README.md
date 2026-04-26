# 🤖 SkillSync AI - Jarvis Assessment Platform

**SkillSync AI** is a state-of-the-art, AI-powered interviewing platform featuring **Jarvis**, an advanced technical recruiter. Built for the SOUL AI Hackathon, this platform automates the entire hiring pipeline—from ATS resume scoring to deep, multi-turn technical assessments.

---

## 🚀 Key Features

- **🔍 Intelligent ATS Pre-Screening**: Automatically parses resumes against job descriptions to provide a match score and actionable improvement suggestions.
- **🎙️ Jarvis AI Interviewer**: A high-fidelity, interactive interview agent that asks 10 deep technical questions, evaluating responses in real-time.
- **🔊 Multi-modal Experience**: Jarvis speaks his questions using high-quality Text-to-Speech (TTS) for a more immersive experience.
- **📈 Live Performance Pulse**: A real-time "Confidence Meter" that fluctuates based on the quality and depth of the candidate's answers.
- **📊 Talent Intelligence Dashboard**: A final report featuring a **Radar Chart (Skill Matrix)**, categorical scores, and a personalized upskilling roadmap with real-world learning resources.
- **🛡️ Deterministic Evaluation**: Uses `temperature: 0` logic to ensure fair, consistent scoring for every candidate.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind-inspired Vanilla CSS.
- **AI Engine**: Google Gemini 1.5 Flash (high-quota preview).
- **Backend**: Next.js API Routes.
- **Icons**: Lucide React.
- **Parsing**: PDF2JSON & Mammoth (DOCX).

---

## 💻 Local Setup Instructions

Follow these steps to run SkillSync AI on your local machine:

### 1. Clone the Repository
```bash
git clone https://github.com/mokshagnakakumanu/SOUL_AI_Hackathon.git
cd SOUL_AI_Hackathon/agent
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a file named `.env.local` in the `agent/` directory and add your Gemini API Key:
```env
GEMINI_API_KEY=your_api_key_here
```

### 4. Run the Development Server
```bash
npm run dev
```

### 5. Access the Portal
Open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📂 Project Structure

- `/agent`: The core Next.js application.
  - `/src/app/api`: AI endpoints for chat, ATS, and evaluation.
  - `/src/app/components`: The modular UI phases (Setup, ATS, Assessment, Results).
- `/datasets`: Sample Resumes and JDs used for testing the system.

---

## 🏆 Hackathon Credits
Developed by **Mokshagna Chowdary** for the SOUL AI Hackathon.
Special thanks to the **Jarvis AI Persona** for the technical wisdom.
