import { useEffect, useRef, useState } from "react";

import { FaTimes, FaRobot, FaVolumeUp, FaLanguage } from "react-icons/fa";

import knowledgeBase from "../../data/assistantData";

import "./Assistant.css";

const GERMAN_HINTS = /(wer|wie|was|wo|für|über|praktikum|studium|projekte|fähigkeiten|kontakt|erfahrung|ausbildung|bitte|hallo|servus|guten|danke|ja|nein)/i;

function pickVoice(lang) {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang.toLowerCase().startsWith(lang)) ||
    voices.find((v) => v.lang.toLowerCase().includes(lang)) ||
    null
  );
}

function Assistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [lang, setLang] = useState("en");

  const chatBodyRef = useRef(null);
  const lastBotMessageRef = useRef(null);

  const speak = (text, language) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    window.dispatchEvent(new CustomEvent("assistant-speaking", { detail: { speaking: true } }));
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "de" ? "de-DE" : "en-US";
    const voice = pickVoice(language === "de" ? "de" : "en");
    if (voice) utterance.voice = voice;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const detectLang = (text) => (GERMAN_HINTS.test(text) ? "de" : "en");

  const getAnswer = (question) => {
    const q = question.toLowerCase();
    // A clearly German question auto-answers in German; otherwise follow the
    // selected language so the EN/DE switch is authoritative.
    const language = detectLang(q) === "de" ? "de" : lang;

    for (const [topic, keywords] of Object.entries(knowledgeBase.topics)) {
      if (keywords.some((keyword) => q.includes(keyword))) {
        return {
          text: knowledgeBase.responses[`${topic}${language === "de" ? "De" : ""}`] || knowledgeBase.responses[topic],
          language,
        };
      }
    }

    return {
      text: language === "de" ? knowledgeBase.fallbackDe : knowledgeBase.fallback,
      language,
    };
  };

  const addMessage = (text, from, language = "en") => {
    setMessages((prev) => [...prev, { text, from, language }]);
  };

  const handleSend = (rawText) => {
    const text = (rawText || input).trim();
    if (!text || typing) return;

    const language = detectLang(text);
    addMessage(text, "user", language);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const answer = getAnswer(text);
      addMessage(answer.text, "bot", answer.language);
      setTyping(false);
    }, 800);
  };

  const toggleLanguage = () => {
    const next = lang === "en" ? "de" : "en";
    setLang(next);
    const confirmation =
      next === "de"
        ? "Ich antworte jetzt auf Deutsch. Frag mich zum Beispiel: „Was sind Nithins Projekte?“"
        : "I'll now answer in English. Try asking: 'What projects has Nithin done?'";
    addMessage(confirmation, "bot", next);
    speak(confirmation, next);
  };

  useEffect(() => {
    if (!open) return;

    const greeting =
      lang === "de"
        ? knowledgeBase.greetingDe[0]
        : knowledgeBase.greeting[0];

    const timer = setTimeout(() => {
      setMessages([{ text: greeting, from: "bot", language: lang }]);
    }, 600);

    return () => clearTimeout(timer);
  }, [open, lang]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, typing]);

  useEffect(() => {
    const el = lastBotMessageRef.current;
    if (!el) return;

    const speakOnce = () => {
      if (el.dataset.spoken === "true") return;
      el.dataset.spoken = "true";
      speak(el.textContent, el.dataset.lang || "en");
    };

    el.addEventListener("mouseenter", speakOnce);
    return () => el.removeEventListener("mouseenter", speakOnce);
  }, [messages]);

  const quickReplies = [
    "What are Nithin's skills?",
    "What projects has he built?",
    "Tell me about his experience",
    "How can I contact him?"
  ];

  const quickRepliesDe = [
    "Was sind Nithins Fähigkeiten?",
    "Welche Projekte hat er gebaut?",
    "Erzähl mir von seiner Erfahrung",
    "Wie kann ich ihn kontaktieren?"
  ];

  const activeQuickReplies = lang === "de" ? quickRepliesDe : quickReplies;

  return (
    <>
      <button
        className={`assistant-fab ${open ? "assistant-fab-open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open AI assistant"
      >
        {open ? <FaTimes /> : <FaRobot />}

        <span
          className={`assistant-lang-badge ${lang === "de" ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleLanguage();
          }}
          title="English / Deutsch"
        >
          {lang === "en" ? "EN" : "DE"}
        </span>
      </button>

      {open && (
        <div className="assistant-panel hologram">
          <div className="assistant-header">
            <div className="assistant-avatar">
              <FaRobot />
              <span className="assistant-pulse" />
            </div>

            <div className="assistant-header-text">
              <h3>Nova - AI Assistant</h3>
              <p>Holographic guide · Online · EN/DE</p>
            </div>

            <button
              className={`assistant-lang-btn ${lang === "de" ? "active" : ""}`}
              onClick={toggleLanguage}
              aria-label="Toggle language"
              title="English / Deutsch"
            >
              <FaLanguage />
              <span>{lang === "en" ? "DE" : "EN"}</span>
            </button>

            <button
              className={`assistant-voice-btn ${speaking ? "active" : ""}`}
              onClick={() =>
                speaking
                  ? stopSpeaking()
                  : speak(
                      messages[messages.length - 1]?.text || "",
                      messages[messages.length - 1]?.language || "en"
                    )
              }
              aria-label="Toggle voice"
            >
              <FaVolumeUp />
            </button>
          </div>

          <div className="assistant-scanline" />

          <div className="assistant-body" ref={chatBodyRef}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`assistant-msg ${msg.from === "bot" ? "bot" : "user"}`}
              >
                <div
                  className="assistant-bubble"
                  data-lang={msg.language || "en"}
                  ref={
                    msg.from === "bot" && index === messages.length - 1
                      ? lastBotMessageRef
                      : undefined
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="assistant-msg bot">
                <div className="assistant-bubble typing-bubble">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
          </div>

          <div className="assistant-quick-replies">
            {activeQuickReplies.map((reply, index) => (
              <button key={index} onClick={() => handleSend(reply)}>
                {reply}
              </button>
            ))}
          </div>

          <div className="assistant-footer">
            <input
              type="text"
              placeholder={
                lang === "de"
                  ? "Frag nach Fähigkeiten, Projekten, Kontakt..."
                  : "Ask about skills, projects, contact..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />

            <button
              className="assistant-send-btn"
              onClick={() => handleSend()}
              aria-label="Send message"
            >
              <FaVolumeUp />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Assistant;
