import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2, Mic, MicOff } from "lucide-react";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";

export default function Chatbot() {
  const { t, lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState(""); // status label under input
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Set/update the initial welcome message when the language changes, 
  // but only if the user hasn't already sent any messages.
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // ── Voice recognition setup ───────────────────────────────────────────────
  const startListening = useCallback(async () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceStatus("⚠️ Voice not supported in this browser.");
      return;
    }

    if (navigator.permissions && navigator.permissions.query) {
      try {
        const status = await navigator.permissions.query({ name: "microphone" });
        if (status.state === "denied") {
          setVoiceStatus(
            "❌ Microphone access denied. Please allow microphone permission in your browser settings."
          );
          return;
        }
      } catch {
        // ignore permission query failures and continue
      }
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === "kn" ? "kn-IN"
                      : lang === "hi" ? "hi-IN"
                      : lang === "ta" ? "ta-IN"
                      : lang === "te" ? "te-IN"
                      : "en-IN";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceStatus("🎙️ Listening… speak now");
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join("");
      setInputValue(transcript);
      if (event.results[event.results.length - 1].isFinal) {
        setVoiceStatus("✅ Heard! Sending…");
        // Auto-send after short delay so user can see what was captured
        setTimeout(() => sendMessage(transcript), 400);
      }
    };

    recognition.onerror = (ev) => {
      console.error("SpeechRecognition error:", ev.error);
      const errorMessage =
        ev.error === "not-allowed" || ev.error === "service-not-allowed"
          ? "❌ Microphone access blocked. Please allow microphone permission in your browser settings."
          : `❌ Error: ${ev.error}`;
      setVoiceStatus(errorMessage);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setTimeout(() => setVoiceStatus(""), 2500);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [lang]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  // ── Core send logic (usable by both form & voice) ─────────────────────────
  const sendMessage = useCallback(async (textOverride) => {
    const userMsg = (textOverride ?? inputValue).trim();
    if (!userMsg || isLoading) return;

    setInputValue("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const history = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await axios.post("http://localhost:8000/chat", {
        message: userMsg,
        history,
        lang,
      });

      let rawResponse = response.data.response;
      let cleanResponse = rawResponse;

      const actionMatch = rawResponse.match(/\[ACTION_JSON\]([\s\S]*?)\[\/ACTION_JSON\]/);
      if (actionMatch) {
        try {
          const actionPayload = JSON.parse(actionMatch[1].trim());
          cleanResponse = rawResponse.replace(/\[ACTION_JSON\]([\s\S]*?)\[\/ACTION_JSON\]/, "").trim();
          window.dispatchEvent(new CustomEvent("sp-ai-action", { detail: actionPayload }));
        } catch (e) {
          console.error("Failed to parse AI action payload:", e);
        }
      }

      setMessages((prev) => [...prev, { role: "model", content: cleanResponse }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "Oops! Something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, messages, lang]);

  // Form submit wrapper
  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-16 right-0 w-80 md:w-96 h-[500px] max-h-[80vh] bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-100/50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-emerald-600 px-4 py-3 flex justify-between items-center shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-white">{t('chat_header')}</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scroll-smooth">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  } items-end gap-2`}
                >
                  {msg.role === "model" && (
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                      msg.role === "user"
                        ? "bg-emerald-600 text-white rounded-br-none"
                        : "bg-white border border-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {msg.role === "user" && (
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <User className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start items-end gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1">
                    <motion.div
                      className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Voice status label */}
            {voiceStatus && (
              <div className="px-4 py-1.5 bg-emerald-50 border-t border-emerald-100 text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                {isListening && (
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
                {voiceStatus}
              </div>
            )}

            {/* Input Area */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isListening ? "Listening…" : t('chat_placeholder')}
                disabled={isLoading || isListening}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-50"
              />

              {/* Mic button */}
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                disabled={isLoading}
                title={isListening ? "Stop listening" : "Speak a command"}
                className={`rounded-full p-2.5 flex items-center justify-center transition-all ${
                  isListening
                    ? "bg-red-500 hover:bg-red-600 text-white ring-4 ring-red-200 animate-pulse"
                    : "bg-gray-100 hover:bg-emerald-100 text-gray-500 hover:text-emerald-700"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Send button */}
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading || isListening}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xl flex items-center justify-center transition-colors"
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </motion.button>
    </div>
  );
}
