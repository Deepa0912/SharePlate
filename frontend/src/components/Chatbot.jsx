import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2, Mic, MicOff, Sparkles, ChevronDown, RotateCcw } from "lucide-react";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";

const QUICK_PROMPTS = [
  "How do I donate food? 🍱",
  "How does NGO matching work? 🤝",
  "Track my mission impact 📊",
  "What food can I donate? 🥗",
];

export default function Chatbot() {
  const { t, lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("");
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (messages.length <= 1) {
      setMessages([
        {
          role: "model",
          content: t('chat_welcome'),
        },
      ]);
    }
  }, [lang]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    } else if (messages.length > 1) {
      // Count new bot messages when closed
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "model") {
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [messages]);

  // ── Voice recognition ────────────────────────────────────────────────────
  const startListening = useCallback(async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setVoiceStatus("⚠️ Voice not supported in this browser."); return; }

    if (navigator.permissions?.query) {
      try {
        const status = await navigator.permissions.query({ name: "microphone" });
        if (status.state === "denied") { setVoiceStatus("❌ Microphone access denied."); return; }
      } catch { /* ignore */ }
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === "kn" ? "kn-IN" : lang === "hi" ? "hi-IN" : lang === "ta" ? "ta-IN" : lang === "te" ? "te-IN" : "en-IN";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => { setIsListening(true); setVoiceStatus("🎙️ Listening… speak now"); };
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((r) => r[0].transcript).join("");
      setInputValue(transcript);
      if (event.results[event.results.length - 1].isFinal) {
        setVoiceStatus("✅ Heard! Sending…");
        setTimeout(() => sendMessage(transcript), 400);
      }
    };
    recognition.onerror = (ev) => {
      const msg = ev.error === "not-allowed" ? "❌ Microphone blocked. Allow access in browser settings." : `❌ Error: ${ev.error}`;
      setVoiceStatus(msg);
      setIsListening(false);
    };
    recognition.onend = () => { setIsListening(false); setTimeout(() => setVoiceStatus(""), 2500); };

    recognitionRef.current = recognition;
    recognition.start();
  }, [lang]);

  const stopListening = useCallback(() => { recognitionRef.current?.stop(); setIsListening(false); }, []);

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (textOverride) => {
    const userMsg = (textOverride ?? inputValue).trim();
    if (!userMsg || isLoading) return;

    setInputValue("");
    setShowQuickPrompts(false);

    // If it's a retry, we don't need to add the user message again if it's already there
    // But for simplicity, we'll just treat retries as a new call with the previous text
    if (!textOverride) {
      setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    }

    setIsLoading(true);

    try {
      const history = messages.map((msg) => ({ role: msg.role, content: msg.content }));
      const API_BASE_URL = window.location.hostname === "localhost" ? "http://localhost:8000" : window.location.origin;
      const response = await axios.post(`${API_BASE_URL}/chat`, { message: userMsg, history, lang });

      setMessages((prev) => [...prev, {
        role: "model",
        content: response.data.response,
        engine: response.data.engine // Store the engine info
      }]);
    } catch (err) {
      setMessages((prev) => [...prev, {
        role: "model",
        content: "Oops! Something went wrong with the AI connection. Please try again. 🔄",
        isError: true,
        lastQuery: userMsg
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, messages, lang]);

  const handleSendMessage = (e) => { e.preventDefault(); sendMessage(); };
  const handleQuickPrompt = (prompt) => { sendMessage(prompt); };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
            className="mb-4 w-[360px] md:w-[420px] bg-white rounded-[2rem] shadow-[0_32px_80px_rgba(0,0,0,0.18)] border border-slate-100/80 flex flex-col overflow-hidden"
            style={{ maxHeight: "82vh" }}
          >
            {/* ── Header ───────────────────────────────────────────────── */}
            <div className="bg-slate-900 px-6 py-5 flex justify-between items-center relative overflow-hidden flex-shrink-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-white text-sm tracking-tight">{t('chat_header')}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Mission AI · Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="relative z-10 w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Messages ─────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#fafbfc] min-h-0">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}
                >
                  {msg.role === "model" && (
                    <div className="w-7 h-7 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user"
                      ? "bg-slate-900 text-white rounded-br-md shadow-sm"
                      : "bg-white border border-slate-100 text-slate-800 rounded-bl-md shadow-sm"
                      }`}
                  >
                    <div className="flex flex-col gap-2">
                      {msg.content}
                      {msg.engine && (
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 opacity-60 mt-1">
                          Powered by {msg.engine}
                        </div>
                      )}
                      {msg.isError && (
                        <button
                          onClick={() => sendMessage(msg.lastQuery)}
                          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/20 transition-all active:scale-95 self-start mt-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Retry
                        </button>
                      )}
                    </div>
                  </div>

                  {
                    msg.role === "user" && (
                      <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    )
                  }
                </motion.div>
              ))}

              {/* Loading dots */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start items-end gap-2"
                >
                  <div className="w-7 h-7 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-md px-4 py-3.5 flex gap-1.5 shadow-sm">
                    {[0, 0.15, 0.3].map((delay, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Quick prompts */}
              <AnimatePresence>
                {showQuickPrompts && messages.length <= 1 && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex flex-wrap gap-2 pt-2"
                  >
                    {QUICK_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleQuickPrompt(prompt)}
                        className="px-3 py-1.5 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all shadow-sm"
                      >
                        {prompt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Voice status */}
            <AnimatePresence>
              {voiceStatus && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 py-2 bg-emerald-50 border-t border-emerald-100 text-xs text-emerald-700 font-bold flex items-center gap-2 flex-shrink-0"
                >
                  {isListening && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />}
                  {voiceStatus}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Input ────────────────────────────────────────────────── */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-white border-t border-slate-100 flex gap-2 items-center flex-shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isListening ? "Listening…" : t('chat_placeholder')}
                disabled={isLoading || isListening}
                className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 focus:bg-white transition-all disabled:opacity-50 text-slate-800 placeholder:text-slate-300"
              />

              {/* Mic */}
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                disabled={isLoading}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 ${isListening
                  ? "bg-red-500 text-white ring-4 ring-red-200 animate-pulse"
                  : "bg-slate-100 hover:bg-emerald-100 text-slate-400 hover:text-emerald-600"
                  } disabled:opacity-40`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Send */}
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading || isListening}
                className="w-10 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl flex items-center justify-center transition-all disabled:opacity-40 flex-shrink-0 shadow-sm"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB ──────────────────────────────────────────────────────────── */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 bg-slate-900 hover:bg-emerald-600 text-white rounded-[1.4rem] shadow-2xl shadow-slate-900/30 flex items-center justify-center transition-colors"
        aria-label="Toggle chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        <AnimatePresence>
          {!isOpen && unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg"
            >
              {unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
