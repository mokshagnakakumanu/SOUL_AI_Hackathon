import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import mammoth from "mammoth";
import PDFParser from "pdf2json";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Extract Job Description
    let jd = formData.get("jd") as string;
    const jdFile = formData.get("jdFile") as File;
    if (jdFile) {
      jd = await extractTextFromFile(jdFile);
    }

    // Extract Resume
    let resume = formData.get("resume") as string;
    const resumeFile = formData.get("resumeFile") as File;
    if (resumeFile) {
      resume = await extractTextFromFile(resumeFile);
    }

    if (!jd || !resume) {
      return NextResponse.json({ error: "Missing JD or Resume" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured on the server." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.1-flash-lite-preview",
      generationConfig: {
        temperature: 0, // Deterministic output for consistent ATS scores
      }
    });

    const prompt = `
You are an expert technical recruiter and ATS (Applicant Tracking System) engine. 
Analyze the following Job Description and Candidate Resume with a strict, deterministic scoring rubric.

SCORING RUBRIC (follow exactly):
- For each required skill/qualification in the JD, check if the resume explicitly mentions it.
- Award points proportionally: if 10 skills are required and 7 are present, base score = 70.
- Deduct 5 points if experience level doesn't match.
- Deduct 5 points for missing certifications if required.
- Add up to 10 bonus points for additional relevant skills not in JD.
- Final score must be between 0-100.

1. **ATS Check**: Calculate the ATS Score using the rubric above (out of 100).
2. **Resume Suggestions**: Provide 3 short, actionable suggestions on how they could improve their resume for this JD.
3. **Skills to Verify**: Extract the top 5-7 core technical skills required by the JD where the resume shows gaps or ambiguity.

Return ONLY a valid JSON object with NO markdown formatting:
{
  "atsScore": 72,
  "fitPercentage": "72%",
  "suggestions": [
    "Add specific TypeScript project examples.",
    "Quantify achievements with metrics.",
    "Include state management library experience."
  ],
  "skillsToVerify": ["TypeScript", "State Management", "System Design", "Testing", "Performance Optimization"]
}

Job Description:
${jd}

Candidate Resume:
${resume}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    const cleanedText = responseText.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
    const parsedData = JSON.parse(cleanedText);

    if (!parsedData.skillsToVerify || !Array.isArray(parsedData.skillsToVerify)) {
      throw new Error("Invalid output format from LLM");
    }

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Extraction error:", error);
    return NextResponse.json({ error: error.message || "Failed to process request" }, { status: 500 });
  }
}

async function extractTextFromFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (file.name.toLowerCase().endsWith('.pdf')) {
    return new Promise((resolve, reject) => {
      const pdfParser = new (PDFParser as any)(null, 1);
      pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
      pdfParser.on("pdfParser_dataReady", () => {
        resolve((pdfParser as any).getRawTextContent());
      });
      pdfParser.parseBuffer(buffer);
    });
  } else if (file.name.toLowerCase().endsWith('.docx')) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else if (file.name.toLowerCase().endsWith('.txt')) {
    return buffer.toString('utf-8');
  } else {
    throw new Error(`Unsupported file format for ${file.name}`);
  }
}
