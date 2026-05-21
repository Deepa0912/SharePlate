// src/components/FoodClassifier.jsx
// ==================================
// AI food image classifier — premium Tailwind redesign.
// Drag-and-drop OR click-to-upload with instant preview.
// Fires onFoodDetected(foodName, confidence) when classification succeeds.

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Sparkles, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import API from "../services/api";

const AUTO_FILL_THRESHOLD = 80;

function FoodClassifier({ onFoodDetected }) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef(null);

  // ── Classify ──────────────────────────────────────────────────────────────
  const classifyImage = useCallback(async (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    setResult(null);
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await API.post("/classify-food", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(data);
      if (onFoodDetected) onFoodDetected(data.food_name, data.confidence);
    } catch (err) {
      setError(err.response?.data?.detail || "Classification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [onFoodDetected]);

  const handleFileChange = (e) => { const f = e.target.files?.[0]; if (f) classifyImage(f); };
  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) classifyImage(f);
  };

  const confidenceColor = (c) => c >= 80 ? "bg-emerald-500" : c >= 50 ? "bg-amber-500" : "bg-rose-500";

  return (
    <div className="rounded-[1.5rem] bg-slate-50 border border-slate-100 p-5 mb-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-black text-slate-800">AI Food Classifier</p>
          <p className="text-[11px] text-emerald-600 font-medium">Upload a photo — we'll detect the food type automatically</p>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => !loading && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl min-h-[150px] flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-200 ${dragging
            ? "border-emerald-500 bg-emerald-50"
            : preview
              ? "border-slate-200 min-h-[220px]"
              : "border-emerald-200 bg-emerald-50/40 hover:border-emerald-400 hover:bg-emerald-50"
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {preview && (
          <img
            src={preview}
            alt="Food preview"
            className="w-full max-h-[260px] object-cover rounded-xl"
          />
        )}

        {!preview && !loading && (
          <div className="text-center p-6">
            <Upload className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-emerald-700 mb-1">Drop image here or click to upload</p>
            <p className="text-[11px] text-slate-400 font-medium">JPEG · PNG · WEBP supported</p>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 rounded-xl">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-sm font-bold text-emerald-700">Analysing food…</p>
          </div>
        )}
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex items-center gap-2.5 px-4 py-3 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-sm font-bold"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 space-y-3"
          >
            {/* Top prediction */}
            <div className="flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl">
              <span className={`${confidenceColor(result.confidence)} text-white text-[11px] font-black px-3 py-1 rounded-full whitespace-nowrap`}>
                {result.confidence}%
              </span>
              <div>
                <p className="text-sm font-black text-slate-800">
                  {result.is_food ? "🍽️" : "🖼️"} {result.food_name}
                </p>
                <p className="text-[11px] text-emerald-600 font-bold">
                  {result.confidence >= AUTO_FILL_THRESHOLD
                    ? "✅ Auto-filled in food name field"
                    : "⚠️ Low confidence — please verify"}
                </p>
              </div>
            </div>

            {/* Other matches */}
            {result.top_predictions?.length > 1 && (
              <div className="px-4 py-3 bg-white border border-slate-100 rounded-2xl space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Other matches</p>
                {result.top_predictions.slice(1).map((p, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">{p.food_name}</span>
                    <span className="font-black text-emerald-600">{p.confidence}%</span>
                  </div>
                ))}
              </div>
            )}

            {/* Re-upload */}
            <button
              onClick={() => { setPreview(null); setResult(null); fileInputRef.current?.click(); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 rounded-2xl text-xs font-black text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Try Another Image
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FoodClassifier;
