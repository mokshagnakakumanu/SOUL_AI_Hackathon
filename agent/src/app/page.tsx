"use client";

import { useState } from "react";
import SetupPhase from "./components/SetupPhase";
import AtsResultsPhase from "./components/AtsResultsPhase";
import AssessmentPhase from "./components/AssessmentPhase";
import ResultsPhase from "./components/ResultsPhase";

export type Phase = "setup" | "ats" | "assessment" | "results";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [atsData, setAtsData] = useState<any>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  const handleSetupComplete = (data: any) => {
    setAtsData(data);
    setPhase("ats");
  };

  const startAssessment = (extractedSkills: string[]) => {
    setSkills(extractedSkills);
    setPhase("assessment");
  };

  const finishAssessment = async (history: any[]) => {
    setChatHistory(history);
    setPhase("results");
  };

  return (
    <div className="container">
      <div className="fade-in">
        {phase === "setup" && <SetupPhase onStart={handleSetupComplete} />}
        
        {phase === "ats" && (
          <AtsResultsPhase 
            data={atsData} 
            onContinue={startAssessment} 
          />
        )}

        {phase === "assessment" && (
          <AssessmentPhase 
            skills={skills} 
            onFinish={finishAssessment} 
          />
        )}

        {phase === "results" && (
          <ResultsPhase 
            chatHistory={chatHistory} 
            skills={skills}
            atsScore={atsData?.atsScore || 0}
          />
        )}
      </div>
    </div>
  );
}
