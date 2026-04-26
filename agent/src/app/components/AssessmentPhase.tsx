"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Loader2, AlertTriangle, Volume2, VolumeX, Activity } from "lucide-react";
import JarvisAvatar from "./JarvisAvatar";

type Message = {
  role: "user" | "model";
  text: string;
};

function renderText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function AssessmentPhase({ skills, onFinish }: { skills: string[], onFinish: (history: Message[]) => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [turnCount, setTurnCount] = useState(0);
  const [jarvisState, setJarvisState] = useState<'idle' | 'thinking' | 'speaking'>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [confidence, setConfidence] = useState(50);
  
  const maxTurns = 10; 
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      sendMessage("START_ASSESSMENT", true);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/\*\*/g, "").replace(/##/g, "").replace(/\*/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      utterance.pitch = 0.85;
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.name.includes("Daniel") || v.name.includes("Male"));
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const sendMessage = async (text: string, isSystem = false) => {
    if (!text.trim() && !isSystem) return;
    setError("");

    let updatedMessages = messages;
    if (!isSystem) {
      const userMsg: Message = { role: "user", text };
      updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setInput("");
      setConfidence(prev => Math.min(95, Math.max(20, prev + (text.length > 50 ? 5 : -2))));
    }

    setLoading(true);
    setJarvisState('thinking');

    try {
      const currentTurn = isSystem ? 0 : turnCount + 1;
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: updatedMessages, skills, turnCount: currentTurn, maxTurns }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      const isFinished = data.isFinished || data.reply.toLowerCase().includes("data i require");

      setJarvisState('speaking');
      const modelMsg: Message = { role: "model", text: data.reply };
      const allMessages = [...updatedMessages, modelMsg];
      setMessages(allMessages);
      
      if (isFinished) {
        setTimeout(() => onFinish(allMessages), 4000);
      } else {
        if (!isSystem) setTurnCount(currentTurn);
        setTimeout(() => setJarvisState('idle'), 3000);
      }
    } catch (err: any) {
      setError(err.message);
      setJarvisState('idle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card slide-up" style={{ maxWidth: '800px', margin: '0 auto', height: '88vh', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <JarvisAvatar state={jarvisState} />
        
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
            <Activity size={14} className={loading ? "pulse" : ""} /> Candidate Standing
          </div>
          <div style={{ width: '120px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <div style={{ 
              width: `${confidence}%`, height: '100%', 
              background: confidence > 70 ? 'var(--success-color)' : confidence > 40 ? 'var(--accent-color)' : 'var(--error-color)',
              transition: 'all 1s ease',
              boxShadow: `0 0 10px ${confidence > 70 ? 'var(--success-color)' : 'var(--accent-color)'}`
            }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.5rem 0' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Q {Math.min(turnCount + 1, maxTurns)}/{maxTurns}</span>
        <div style={{ flex: 1, height: '4px', background: 'var(--bg-surface)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${(turnCount / maxTurns) * 100}%`, height: '100%', background: 'var(--accent-color)', transition: 'width 0.5s ease' }} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '1rem', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{ 
              width: '36px', height: '36px', borderRadius: '50%', background: msg.role === 'user' ? 'var(--accent-color)' : '#111827',
              border: msg.role === 'user' ? 'none' : '2px solid var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white'
            }}>
              {msg.role === 'user' ? <User size={18} /> : 'J'}
            </div>
            <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ background: msg.role === 'user' ? 'var(--accent-color)' : 'rgba(255,255,255,0.08)', color: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: msg.role === 'user' ? 'none' : '1px solid var(--border-color)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {renderText(msg.text)}
              </div>
              {msg.role === 'model' && (
                <button onClick={() => isSpeaking ? window.speechSynthesis.cancel() : speakText(msg.text)} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.75rem', cursor: 'pointer' }}>
                  {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />} {isSpeaking ? 'Stop' : 'Read Aloud'}
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && <div style={{ display: 'flex', gap: '1rem' }}><div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#111827', border: '2px solid var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>J</div><div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}><Loader2 size={18} className="spinner" /> Jarvis is analyzing...</div></div>}
        {error && <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-sm)', color: 'var(--error-color)' }}><AlertTriangle size={18} /><span>{error}</span></div>}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ marginTop: '1.5rem', position: 'relative' }}>
        <textarea 
          className="input-field" 
          placeholder="Type your answer to Jarvis here..." 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage(input))} 
          disabled={loading} 
          style={{ minHeight: '60px', paddingRight: '4.5rem', resize: 'none' }} 
        />
        <button 
          onClick={() => sendMessage(input)} 
          disabled={loading || !input.trim()} 
          style={{ 
            position: 'absolute', right: '10px', bottom: '10px',
            background: 'var(--accent-color)', color: 'white', 
            width: '45px', height: '45px', borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            opacity: (!input.trim() || loading) ? 0.5 : 1,
            transition: 'var(--transition)'
          }}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
