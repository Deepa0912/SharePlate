// src/components/FoodClassifier.jsx
// ==================================
// AI food image classifier component for SharePlate.
//
// Features:
//   - Drag-and-drop OR click-to-upload image area
//   - Instant image preview
//   - Loading spinner during inference
//   - Prediction badge with confidence colour coding
//   - Auto-fill callback: fires when confidence >= AUTO_FILL_THRESHOLD
//
// Props:
//   onFoodDetected(foodName: string, confidence: number)
//       Called whenever a prediction is returned (even low-confidence ones).
//       The parent decides whether to auto-fill based on confidence.
//
// Usage:
//   <FoodClassifier onFoodDetected={(name, conf) => { ... }} />

import { useState, useRef, useCallback } from "react";
import API from "../services/api";

// Minimum confidence (0–100) to trigger auto-fill in the parent form
const AUTO_FILL_THRESHOLD = 80;

function FoodClassifier({ onFoodDetected }) {

  const [preview,    setPreview]    = useState(null);   // data URL
  const [loading,    setLoading]    = useState(false);
  const [result,     setResult]     = useState(null);   // API response
  const [error,      setError]      = useState(null);
  const [dragging,   setDragging]   = useState(false);

  const fileInputRef = useRef(null);


  // ── Classify image via backend ──────────────────────────────────────────
  const classifyImage = useCallback(async (file) => {
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Reset state
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

      // Notify parent — parent auto-fills if confidence >= threshold
      if (onFoodDetected) {
        onFoodDetected(data.food_name, data.confidence);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Classification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [onFoodDetected]);


  // ── File input handler ──────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) classifyImage(file);
  };

  // ── Drag-and-drop handlers ──────────────────────────────────────────────
  const handleDragOver  = (e) => { e.preventDefault(); setDragging(true);  };
  const handleDragLeave = ()  => setDragging(false);
  const handleDrop      = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) classifyImage(file);
  };


  // ── Confidence badge colour ─────────────────────────────────────────────
  const getBadgeStyle = (confidence) => {
    if (confidence >= 80) return { ...styles.badge, background: "#16a34a" };
    if (confidence >= 50) return { ...styles.badge, background: "#d97706" };
    return { ...styles.badge, background: "#dc2626" };
  };


  return (
    <div style={styles.wrapper}>

      {/* Header */}
      <div style={styles.header}>
        <span style={styles.headerIcon}>🤖</span>
        <div>
          <p style={styles.headerTitle}>AI Food Classifier</p>
          <p style={styles.headerSub}>
            Upload a photo — we'll detect the food type automatically
          </p>
        </div>
      </div>

      {/* Drop zone */}
      <div
        style={{
          ...styles.dropZone,
          ...(dragging ? styles.dropZoneActive : {}),
          ...(preview  ? styles.dropZoneWithPreview : {}),
        }}
        onClick={() => !loading && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* Image preview */}
        {preview && (
          <img src={preview} alt="Food preview" style={styles.preview} />
        )}

        {/* Overlay text */}
        {!preview && !loading && (
          <div style={styles.dropPlaceholder}>
            <span style={styles.dropIcon}>📷</span>
            <p style={styles.dropTitle}>Drop image here or click to upload</p>
            <p style={styles.dropSub}>JPEG · PNG · WEBP supported</p>
          </div>
        )}

        {/* Loading spinner overlay */}
        {loading && (
          <div style={styles.spinnerOverlay}>
            <div style={styles.spinner} className="food-spinner" />
            <p style={styles.spinnerText}>Analysing food…</p>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div style={styles.errorBox}>
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Prediction result */}
      {result && !loading && (
        <div style={styles.resultBox}>

          {/* Top prediction badge */}
          <div style={styles.predictionRow}>
            <span style={getBadgeStyle(result.confidence)}>
              {result.confidence}%
            </span>
            <div>
              <p style={styles.foodName}>
                {result.is_food ? "🍽️" : "🖼️"} {result.food_name}
              </p>
              <p style={styles.foodSub}>
                {result.confidence >= AUTO_FILL_THRESHOLD
                  ? "✅ Auto-filled in food name field"
                  : "⚠️ Low confidence — please verify"}
              </p>
            </div>
          </div>

          {/* Top predictions list */}
          {result.top_predictions?.length > 1 && (
            <div style={styles.topList}>
              <p style={styles.topListLabel}>Other matches:</p>
              {result.top_predictions.slice(1).map((p, i) => (
                <div key={i} style={styles.topListItem}>
                  <span style={styles.topListName}>{p.food_name}</span>
                  <span style={styles.topListConf}>{p.confidence}%</span>
                </div>
              ))}
            </div>
          )}

          {/* Re-upload button */}
          <button
            style={styles.retryBtn}
            onClick={() => {
              setPreview(null);
              setResult(null);
              fileInputRef.current?.click();
            }}
          >
            📷 Try Another Image
          </button>

        </div>
      )}

      {/* Keyframe injection */}
      <style>{`
        @keyframes food-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes food-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .food-spinner {
          animation: food-spin 0.8s linear infinite;
        }
      `}</style>
    </div>
  );
}


// ── Inline styles ────────────────────────────────────────────────────────────
const styles = {
  wrapper: {
    borderRadius: "20px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: "20px",
    marginBottom: "18px",
  },

  // Header
  header: {
    display: "flex", alignItems: "flex-start", gap: "12px",
    marginBottom: "16px",
  },
  headerIcon:  { fontSize: "26px", lineHeight: 1 },
  headerTitle: { color: "#0f172a", fontWeight: "700", fontSize: "15px", margin: 0 },
  headerSub:   { color: "#059669", fontSize: "12px", margin: "2px 0 0" },

  // Drop zone
  dropZone: {
    border: "2px dashed #a7f3d0",
    borderRadius: "16px",
    minHeight: "150px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    overflow: "hidden",
    position: "relative",
    background: "#f0fdf4",
  },
  dropZoneActive: {
    border: "2px dashed #059669",
    background: "#d1fae5",
  },
  dropZoneWithPreview: {
    border: "2px solid #cbd5e1",
    minHeight: "220px",
  },

  // Placeholder
  dropPlaceholder: { textAlign: "center", padding: "24px" },
  dropIcon:  { fontSize: "36px", display: "block", marginBottom: "8px" },
  dropTitle: { color: "#059669", fontWeight: "600", fontSize: "14px", margin: "0 0 4px" },
  dropSub:   { color: "#475569", fontSize: "12px", margin: 0 },

  // Preview
  preview: {
    width: "100%", maxHeight: "260px",
    objectFit: "cover", borderRadius: "14px",
    display: "block",
  },

  // Spinner overlay
  spinnerOverlay: {
    position: "absolute", inset: 0,
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(4px)",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: "12px",
    borderRadius: "14px",
  },
  spinner: {
    width: "40px", height: "40px",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #059669",
    borderRadius: "50%",
  },
  spinnerText: { color: "#059669", fontSize: "14px", fontWeight: "600", margin: 0 },

  // Error
  errorBox: {
    marginTop: "12px",
    background: "#fef2f2",
    border: "1px solid #fca5a5",
    borderRadius: "12px",
    color: "#dc2626",
    padding: "10px 14px",
    fontSize: "13px",
    display: "flex", alignItems: "center", gap: "8px",
  },

  // Result
  resultBox: {
    marginTop: "14px",
    animation: "food-fade-in 0.35s ease",
  },
  predictionRow: {
    display: "flex", alignItems: "center", gap: "14px",
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    borderRadius: "14px",
    padding: "12px 16px",
    marginBottom: "10px",
  },
  badge: {
    fontSize: "13px", fontWeight: "800",
    color: "#fff", padding: "4px 12px",
    borderRadius: "999px", whiteSpace: "nowrap",
    minWidth: "56px", textAlign: "center",
  },
  foodName: {
    color: "#0f172a", fontWeight: "700", fontSize: "16px",
    margin: "0 0 3px",
  },
  foodSub: { color: "#059669", fontSize: "12px", margin: 0 },

  // Top list
  topList: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "10px 14px",
    marginBottom: "12px",
  },
  topListLabel: {
    color: "#64748b", fontSize: "11px", fontWeight: "700",
    textTransform: "uppercase", letterSpacing: "0.05em",
    margin: "0 0 8px",
  },
  topListItem: {
    display: "flex", justifyContent: "space-between",
    paddingBottom: "5px", marginBottom: "5px",
    borderBottom: "1px solid #e2e8f0",
  },
  topListName: { color: "#1e293b", fontSize: "13px" },
  topListConf: { color: "#059669", fontSize: "13px", fontWeight: "600" },

  // Retry
  retryBtn: {
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    color: "#059669",
    borderRadius: "10px",
    padding: "8px 16px",
    fontSize: "13px", fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background 0.2s",
  },
};

export default FoodClassifier;
