// src/components/NGOBadge.jsx
// ----------------------------
// Glassmorphism card showing the AI-recommended NGO for a donation.

function NGOBadge({ ngo, loading }) {

  // ── Loading shimmer ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.shimmerHeader} />
        <div style={styles.shimmerRow} />
        <div style={{ ...styles.shimmerRow, width: "60%" }} />
      </div>
    );
  }

  // ── No NGO found ─────────────────────────────────────────────────────────
  if (!ngo) {
    return (
      <div style={{ ...styles.wrapper, ...styles.emptyWrapper }}>
        <span style={styles.emptyIcon}>🏢</span>
        <span style={styles.emptyText}>No NGO data available</span>
      </div>
    );
  }

  // ── Match badge colour ────────────────────────────────────────────────────
  const pct = ngo.match_percentage ?? 0;
  const badgeColor =
    pct >= 80 ? "#16a34a" :   // green
    pct >= 60 ? "#d97706" :   // amber
               "#dc2626";     // red

  const distanceLabel = ngo.distance_km != null
    ? `${ngo.distance_km} km away`
    : ngo.city || "Distance unavailable";

  const specialities = Array.isArray(ngo.speciality)
    ? ngo.speciality.join(", ")
    : ngo.speciality;

  return (
    <div style={styles.wrapper} className="ngo-badge-wrapper">
      {/* Header row */}
      <div style={styles.header}>
        <span style={styles.headerIcon}>🏢</span>
        <span style={styles.headerTitle}>Recommended NGO</span>
        <span style={{ ...styles.matchBadge, background: badgeColor }}>
          {pct}% match
        </span>
      </div>

      {/* NGO name */}
      <p style={styles.ngoName}>{ngo.name}</p>

      {/* Info row */}
      <div style={styles.infoRow}>
        <span style={styles.infoChip}>
          <span>📍</span>
          <span>{distanceLabel}</span>
        </span>
        <span style={styles.infoChip}>
          <span>🍽️</span>
          <span style={{ textTransform: "capitalize" }}>
            {specialities || "General"}
          </span>
        </span>
      </div>

      {/* Contact */}
      {ngo.contact && (
        <div style={styles.contactRow}>
          <span style={styles.contactIcon}>📞</span>
          <a href={`tel:${ngo.contact}`} style={styles.contactLink}>
            {ngo.contact}
          </a>
        </div>
      )}
    </div>
  );
}

// ── Inline styles ────────────────────────────────────────────────────────────
const styles = {
  wrapper: {
    marginTop: "14px",
    padding: "14px 16px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(5,150,105,0.14) 100%)",
    border: "1px solid rgba(16,185,129,0.25)",
    backdropFilter: "blur(8px)",
    boxShadow: "0 2px 12px rgba(16,185,129,0.10)",
  },
  emptyWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    opacity: 0.5,
  },
  emptyIcon: { fontSize: "18px" },
  emptyText: { fontSize: "13px", color: "#6b7280" },

  // Shimmer
  shimmerHeader: {
    height: "16px",
    width: "55%",
    borderRadius: "8px",
    background: "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s infinite",
    marginBottom: "10px",
  },
  shimmerRow: {
    height: "12px",
    width: "80%",
    borderRadius: "8px",
    background: "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s infinite",
    marginBottom: "8px",
  },

  // Header
  header: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "8px",
  },
  headerIcon: { fontSize: "15px" },
  headerTitle: {
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#065f46",
    flex: 1,
  },
  matchBadge: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#fff",
    padding: "2px 10px",
    borderRadius: "999px",
    letterSpacing: "0.03em",
  },

  // NGO name
  ngoName: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#064e3b",
    margin: "0 0 8px 0",
    lineHeight: 1.3,
  },

  // Info chips
  infoRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginBottom: "8px",
  },
  infoChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "12px",
    color: "#047857",
    background: "rgba(16,185,129,0.10)",
    border: "1px solid rgba(16,185,129,0.20)",
    borderRadius: "999px",
    padding: "3px 10px",
    fontWeight: "500",
  },

  // Contact
  contactRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginTop: "2px",
  },
  contactIcon: { fontSize: "12px" },
  contactLink: {
    fontSize: "12px",
    color: "#065f46",
    fontWeight: "600",
    textDecoration: "none",
    borderBottom: "1px dashed #6ee7b7",
  },
};

// Inject shimmer keyframes once
if (typeof document !== "undefined") {
  const styleId = "ngo-badge-shimmer";
  if (!document.getElementById(styleId)) {
    const tag = document.createElement("style");
    tag.id = styleId;
    tag.textContent = `
      @keyframes shimmer {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      .ngo-badge-wrapper { transition: box-shadow 0.25s ease, transform 0.2s ease; }
      .ngo-badge-wrapper:hover {
        box-shadow: 0 4px 20px rgba(16,185,129,0.22);
        transform: translateY(-1px);
      }
    `;
    document.head.appendChild(tag);
  }
}

export default NGOBadge;
