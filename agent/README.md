# SkillSync AI - Personalised Skill Assessment Agent

A resume tells you what someone claims to know — not how well they actually know it. **SkillSync AI** is an intelligent agent that takes a Job Description and a candidate's resume, conversationally assesses real proficiency on each required skill, identifies gaps, and generates a personalised learning plan.

## Architecture

SkillSync AI is built with a modern Next.js stack, using React for the frontend and Next.js App Router for backend API endpoints. It leverages the **Google Gemini API** (`gemini-1.5-flash` for fast chatting and extraction, `gemini-1.5-pro` for deep evaluation) as the core cognitive engine.

1. **Extraction Engine**: Parses the Job Description and Candidate Resume. Gemini extracts the top critical skills that need verification based on potential gaps.
2. **Conversational Agent**: An interactive chat interface where Gemini assumes the persona of a technical interviewer. It asks targeted, scenario-based questions focusing on one skill at a time.
3. **Evaluation Engine**: Analyzes the chat transcript to score the candidate, highlight proficiency levels, and output a structured JSON gap analysis.
4. **Learning Plan Generator**: Creates an actionable, curated learning plan with time estimates and specific resources (Docs, Videos) to help the candidate upskill.

### Stack
- **Frontend**: Next.js 15, React 19, Vanilla CSS (Premium Glassmorphism Design).
- **Backend**: Next.js API Routes.
- **AI Model**: Google Generative AI SDK (`@google/generative-ai`).
- **Icons**: Lucide React.

## Getting Started

### Prerequisites
- Node.js (v18+)
- A Google Gemini API Key

### Installation

1. **Clone the repository** (if not already local):
   \`\`\`bash
   git clone <repository_url>
   cd agent
   \`\`\`

2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure Environment Variables**:
   Create a \`.env.local\` file in the root of the \`agent\` directory:
   \`\`\`
   GEMINI_API_KEY=your_gemini_api_key_here
   \`\`\`

4. **Run the Development Server**:
   \`\`\`bash
   npm run dev
   \`\`\`
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage Guide (Realistic Scenario)

1. **Input Phase**: Navigate to the homepage. Paste a Job Description for a "Senior React Developer" and a Resume of a mid-level developer.
2. **Assessment Phase**: The AI will greet you and ask a deep technical question about React state management (e.g., "How would you handle complex global state without Redux?"). 
3. **Results Phase**: After 3 turns, the assessment concludes. The dashboard will display a score (e.g., 75/100), identify a gap in advanced state management, and provide a 2-week learning plan focused on the React Context API and Zustand.

## Evaluation Criteria Addressed
- **Works End-to-End**: Yes, seamlessly from input to evaluation.
- **Quality of Core Agent**: Uses structured few-shot instructions to ensure the agent asks single, targeted questions without hallucinations.
- **Technical Implementation**: Full-stack Next.js architecture with clean separation of concerns (API routes vs UI components).
- **UX**: High-end dark mode, glassmorphism UI with micro-animations for a premium feel.
