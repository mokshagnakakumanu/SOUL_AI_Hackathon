import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { message, history, skills, turnCount, maxTurns } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is missing." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.1-flash-lite-preview",
      generationConfig: {
        temperature: 0,
        topP: 1,
        topK: 1
      }
    });

    const isLastTurn = turnCount >= maxTurns;

    const systemPrompt = `
You are JARVIS, an elite AI technical interviewer. 
Current Goal: Assess proficiency in ${skills.join(", ")}.

STRICT PROTOCOL:
1. **Duration**: You MUST ask exactly ${maxTurns} questions. You are currently on question ${turnCount} of ${maxTurns}.
2. **Early Termination**: DO NOT end the interview early. You must continue until turn ${maxTurns}.
3. **Tone**: Professional, robotic, precise. No markdown (no **, no #).
4. **Final Turn Protocol**: ONLY when turnCount is EXACTLY ${maxTurns}, you must say: "Thank you, I have all the data I require to process your results. This concludes our assessment."

TURN STATUS:
- Current Turn: ${turnCount}
- Questions Remaining: ${maxTurns - turnCount}

INSTRUCTIONS:
- If turnCount < ${maxTurns}: Evaluate the candidate's last answer briefly, then ask the NEXT technical question.
- If turnCount == ${maxTurns}: Provide a brief final evaluation and say the required closing phrase.
- If turnCount == 0: Introduce yourself and ask the FIRST question.`;

    let conversationTranscript = "";
    for (const msg of history) {
      if (msg.text === "START_ASSESSMENT") continue;
      const speaker = msg.role === "user" ? "Candidate" : "Jarvis";
      conversationTranscript += `${speaker}: ${msg.text}\n\n`;
    }

    let fullPrompt: string;
    if (message === "START_ASSESSMENT") {
      fullPrompt = `${systemPrompt}\n\nJarvis, begin Turn 1. Introduce yourself and ask the first question.`;
    } else {
      fullPrompt = `${systemPrompt}\n\nConversation History:\n${conversationTranscript}\nCandidate: ${message}\n\nJarvis, proceed with Turn ${turnCount}:`;
    }

    const result = await model.generateContent(fullPrompt);
    const reply = result.response.text();

    // If the model insisted on ending early despite instructions, 
    // or if it's the actual last turn, let the frontend know.
    const hasClosed = reply.toLowerCase().includes("all the data i require") || 
                      reply.toLowerCase().includes("concludes our assessment");

    return NextResponse.json({ 
      reply, 
      isFinished: hasClosed && turnCount >= maxTurns / 2 // Only allow early finish if at least half done
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
