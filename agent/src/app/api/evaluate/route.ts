import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { history, skills, atsScore } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is missing." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.1-flash-lite-preview",
      generationConfig: {
        temperature: 0,
      }
    });

    const prompt = `
You are a deterministic Evaluation Engine. Analyze this interview transcript.

Transcript: ${JSON.stringify(history, null, 2)}
ATS Score: ${atsScore}

TASK:
1. Calculate categorical scores (0-100) for: Technical Depth, Architecture, Problem Solving, and Communication.
2. Calculate Final Overall Score: (Interview_Avg * 0.9) + (${atsScore} * 0.1).
3. Perform gap analysis for these skills: ${skills.join(", ")}.
4. Generate a learning plan with real URLs.

Return EXACTLY this JSON:
{
  "overallScore": 0,
  "interviewScore": 0,
  "categoricalScores": {
    "Technical": 85,
    "Architecture": 70,
    "Logic": 90,
    "Communication": 80
  },
  "summary": "...",
  "skillsAnalysis": [
    { "skill": "...", "proficiency": "...", "feedback": "...", "hasGap": true }
  ],
  "learningPlan": [
    {
      "topic": "...",
      "description": "...",
      "estimatedTime": "...",
      "resources": [{ "name": "...", "type": "...", "url": "..." }]
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    const cleanedText = responseText.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
    const evaluation = JSON.parse(cleanedText);

    return NextResponse.json(evaluation);
  } catch (error: any) {
    console.error("Evaluate API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
