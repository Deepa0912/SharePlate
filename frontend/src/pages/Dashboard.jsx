// src/pages/Dashboard.jsx
// ========================
// Main donor dashboard for SharePlate.
// Integrates:
//   - Food donation form with AI food image classifier (auto-fill)
//   - AI NGO recommendation badge per donation card
//   - Priority-sorted donation grid with stats strip
//   - Search / filter

import { useState, useEffect, useCallback } from "react";
import API from "../services/api";
import NGOBadge from "../components/NGOBadge";
import FoodClassifier from "../components/FoodClassifier";

// Minimum confidence (%) for AI to auto-fill the food name field
const AUTO_FILL_THRESHOLD = 80;

function Dashboard() {

  const [donations,   setDonations]   = useState([]);
  const [ngoMap,      setNgoMap]      = useState({});
  const [ngoLoading,  setNgoLoading]  = useState({});
  const [submitting,  setSubmitting]  = useState(false);
  const [search,      setSearch]      = useState("");

  const [formData, setFormData] = useState({
    food_name:   "",
    quantity:    "",
    expiry_time: "",
    location:    "",
    donor_id:    "",
  });

  const [image, setImage] = useState(null);


  // ── Form field handler ────────────────────────────────────────────────────
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));


  // ── AI classifier callback: auto-fill food name if confidence >= threshold
  const handleFoodDetected = useCallback((foodName, confidence) => {
    if (confidence >= AUTO_FILL_THRESHOLD) {
      setFormData((prev) => ({ ...prev, food_name: foodName }));
    }
  }, []);


  // ── Fetch NGO recommendations (batched) ──────────────────────────────────
  const fetchNGORecommendations = async (donationList) => {
    const loadingState = {};
    donationList.forEach((d) => { loadingState[d.id] = true; });
    setNgoLoading(loadingState);

    const results = await Promise.allSettled(
      donationList.map((d) => API.get(`/recommended-ngo/${d.id}`))
    );

    const ngoState = {};
    donationList.forEach((d, i) => {
      const r = results[i];
      ngoState[d.id] = r.status === "fulfilled" ? r.value.data : null;
    });

    setNgoMap(ngoState);
    setNgoLoading({});
  };


  // ── Fetch all donations ───────────────────────────────────────────────────
  const fetchDonations = async () => {
    try {
      const { data } = await API.get("/donations");
      setDonations(data);
      fetchNGORecommendations(data);
    } catch (err) {
      console.error("[Dashboard] fetchDonations error:", err);
    }
  };

  useEffect(() => { fetchDonations(); }, []);


  // ── Submit donation ───────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    data.append("image", image);

    try {
      await API.post("/donate", data);
      alert("Donation added successfully!");
      // Reset form
      setFormData({ food_name: "", quantity: "", expiry_time: "", location: "", donor_id: "" });
      setImage(null);
      fetchDonations();
    } catch (err) {
      console.error("[Dashboard] donate error:", err);
      alert("Donation failed — check console.");
    } finally {
      setSubmitting(false);
    }
  };


  // ── Delete donation ───────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this donation?")) return;
    try {
      await API.delete(`/donation/${id}`);
      fetchDonations();
    } catch (err) {
      console.error("[Dashboard] delete error:", err);
      alert("Delete failed.");
    }
  };


  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };


  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = donations.filter((d) =>
    d.food_name.toLowerCase().includes(search.toLowerCase()) ||
    d.location.toLowerCase().includes(search.toLowerCase())
  );


  // ── Priority badge styles ─────────────────────────────────────────────────
  const priorityStyle = {
    HIGH:   { background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" },
    MEDIUM: { background: "#fffbeb", color: "#d97706", border: "1px solid #fde68a" },
    LOW:    { background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" },
  };


  return (
    <div style={S.page}>

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav style={S.navbar}>
        <div style={S.navBrand}>
          <span style={S.navLogo}>🍽️</span>
          <h1 style={S.navTitle}>SharePlate</h1>
          <span style={S.navBadge}>Dashboard</span>
        </div>
        <button onClick={handleLogout} style={S.logoutBtn}>Logout</button>
      </nav>


      {/* ── Donation Form ────────────────────────────────────────────────── */}
      <section style={S.formCard}>
        <h2 style={S.sectionTitle}>➕ Add Food Donation</h2>

        {/* AI Classifier — sits above the form */}
        <FoodClassifier onFoodDetected={handleFoodDetected} />

        <form onSubmit={handleSubmit}>
          <div style={S.formGrid}>

            {/* Food name — may be auto-filled by the classifier */}
            <div style={S.fieldGroup}>
              <label style={S.label}>
                Food Name
                {formData.food_name && (
                  <span style={S.autoFillTag}>🤖 AI detected</span>
                )}
              </label>
              <input
                type="text"
                name="food_name"
                placeholder="e.g. Paneer curry, Biryani…"
                value={formData.food_name}
                style={S.input}
                onChange={handleChange}
                required
              />
            </div>

            <div style={S.fieldGroup}>
              <label style={S.label}>Quantity</label>
              <input
                type="text"
                name="quantity"
                placeholder="e.g. 80 kg, 50 plates"
                value={formData.quantity}
                style={S.input}
                onChange={handleChange}
                required
              />
            </div>

            <div style={S.fieldGroup}>
              <label style={S.label}>Expiry Time</label>
              <input
                type="text"
                name="expiry_time"
                placeholder="e.g. 2 hours, 2025-06-01"
                value={formData.expiry_time}
                style={S.input}
                onChange={handleChange}
                required
              />
            </div>

            <div style={S.fieldGroup}>
              <label style={S.label}>Location</label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Koramangala, Bengaluru"
                value={formData.location}
                style={S.input}
                onChange={handleChange}
                required
              />
            </div>

            <div style={S.fieldGroup}>
              <label style={S.label}>Donor ID</label>
              <input
                type="text"
                name="donor_id"
                placeholder="Your donor ID"
                value={formData.donor_id}
                style={S.input}
                onChange={handleChange}
                required
              />
            </div>

            <div style={S.fieldGroup}>
              <label style={S.label}>Food Photo</label>
              <input
                type="file"
                accept="image/*"
                style={{ ...S.input, cursor: "pointer" }}
                onChange={(e) => setImage(e.target.files[0])}
                required
              />
            </div>

          </div>

          <button type="submit" style={S.submitBtn} disabled={submitting}>
            {submitting ? "Submitting…" : "Submit Donation"}
          </button>
        </form>
      </section>


      {/* ── Search ───────────────────────────────────────────────────────── */}
      <div style={S.searchWrapper}>
        <span>🔍</span>
        <input
          type="text"
          placeholder="Search by food name or location…"
          style={S.searchInput}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>


      {/* ── Stats Strip ──────────────────────────────────────────────────── */}
      <div style={S.statsStrip}>
        {[
          { icon: "📦", value: donations.length, label: "Total" },
          { icon: "🔴", value: donations.filter(d => d.priority === "HIGH").length,   label: "High" },
          { icon: "🟡", value: donations.filter(d => d.priority === "MEDIUM").length, label: "Medium" },
          { icon: "🟢", value: donations.filter(d => d.priority === "LOW").length,    label: "Low" },
        ].map((s) => (
          <div key={s.label} style={S.statCard}>
            <span style={S.statIcon}>{s.icon}</span>
            <span style={S.statValue}>{s.value}</span>
            <span style={S.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>


      {/* ── Donation Grid ────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div style={S.empty}>
          <p style={{ fontSize: "52px", margin: "0 0 12px" }}>🍱</p>
          <h2 style={{ color: "#ecfdf5", margin: "0 0 8px" }}>No Donations Found</h2>
          <p style={{ color: "#6ee7b7" }}>Add one above or adjust your search.</p>
        </div>
      ) : (
        <div style={S.grid}>
          {filtered.map((donation) => {
            const ps = priorityStyle[donation.priority] || priorityStyle.MEDIUM;
            return (
              <article key={donation.id} style={S.card} className="sp-card">

                {/* Image */}
                <div style={{ position: "relative" }}>
                  <img
                    src={donation.image_url}
                    alt={donation.food_name}
                    style={S.cardImg}
                  />
                  <span style={{ ...S.priorityTag, ...ps }}>
                    {donation.priority === "HIGH"   && "🔴 "}
                    {donation.priority === "MEDIUM" && "🟡 "}
                    {donation.priority === "LOW"    && "🟢 "}
                    {donation.priority}
                  </span>
                </div>

                {/* Body */}
                <div style={S.cardBody}>
                  <h3 style={S.cardTitle}>{donation.food_name}</h3>

                  <div style={S.infoRows}>
                    <InfoRow icon="⚖️" label="Qty"      value={donation.quantity} />
                    <InfoRow icon="⏰" label="Expires"  value={donation.expiry_time} />
                    <InfoRow icon="📍" label="Location" value={donation.location} />
                    <InfoRow icon="🔄" label="Status"   value={donation.status} />
                  </div>

                  {/* NGO Recommendation Badge */}
                  <NGOBadge
                    ngo={ngoMap[donation.id]}
                    loading={!!ngoLoading[donation.id]}
                  />

                  <button
                    onClick={() => handleDelete(donation.id)}
                    style={S.delBtn}
                    className="sp-del"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}


      {/* ── Global CSS ───────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Inter', sans-serif; }
        .sp-card  { transition: transform .25s ease, box-shadow .25s ease; }
        .sp-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,.18) !important; }
        .sp-del:hover  { opacity: .85; transform: scale(1.02); }
        input::placeholder { color: rgba(167,243,208,.5); }
        input:focus { outline: none; border-color: #10b981 !important; }
      `}</style>

    </div>
  );
}


// ── Info row helper ────────────────────────────────────────────────────────
function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: "flex", gap: "6px", alignItems: "baseline", marginBottom: "4px" }}>
      <span style={{ fontSize: "13px" }}>{icon}</span>
      <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "700", minWidth: "52px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
      <span style={{ fontSize: "13px", color: "#374151", fontWeight: "500" }}>{value}</span>
    </div>
  );
}


// ── Design tokens ──────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#064e3b 0%,#065f46 30%,#0f766e 60%,#134e4a 100%)",
    fontFamily: "'Inter',sans-serif",
    paddingBottom: "60px",
  },

  // Navbar
  navbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 36px",
    background: "rgba(0,0,0,0.25)", backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
    marginBottom: "32px",
  },
  navBrand:  { display: "flex", alignItems: "center", gap: "10px" },
  navLogo:   { fontSize: "26px" },
  navTitle:  { fontSize: "22px", fontWeight: "800", color: "#fff", margin: 0 },
  navBadge:  {
    fontSize: "11px", color: "#6ee7b7",
    background: "rgba(16,185,129,0.20)",
    padding: "2px 10px", borderRadius: "999px",
    fontWeight: "700", letterSpacing: "0.05em",
  },
  logoutBtn: {
    background: "linear-gradient(135deg,#dc2626,#b91c1c)",
    color: "#fff", border: "none", borderRadius: "10px",
    padding: "8px 20px", fontWeight: "700",
    cursor: "pointer", fontSize: "13px",
  },

  // Form card
  formCard: {
    maxWidth: "720px", margin: "0 auto 28px",
    background: "rgba(255,255,255,0.07)", backdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.15)", borderRadius: "24px",
    padding: "28px 32px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
  },
  sectionTitle: { color: "#ecfdf5", fontSize: "18px", fontWeight: "700", margin: "0 0 18px" },

  // Form inputs
  formGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: "14px", marginBottom: "16px",
  },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { color: "#a7f3d0", fontSize: "12px", fontWeight: "700",
           textTransform: "uppercase", letterSpacing: "0.05em",
           display: "flex", alignItems: "center", gap: "6px" },
  autoFillTag: {
    fontSize: "10px", background: "rgba(16,185,129,0.25)",
    color: "#6ee7b7", padding: "1px 8px", borderRadius: "999px",
    fontWeight: "700", letterSpacing: "0.03em",
  },
  input: {
    padding: "10px 13px", borderRadius: "11px",
    border: "1px solid rgba(255,255,255,0.20)",
    background: "rgba(255,255,255,0.08)", color: "#ecfdf5",
    fontSize: "14px", fontFamily: "inherit", width: "100%",
    transition: "border-color .2s",
  },
  submitBtn: {
    width: "100%", padding: "13px",
    background: "linear-gradient(135deg,#10b981,#059669)",
    color: "#fff", border: "none", borderRadius: "13px",
    fontSize: "15px", fontWeight: "700", cursor: "pointer",
    fontFamily: "inherit", letterSpacing: "0.03em",
  },

  // Search
  searchWrapper: {
    maxWidth: "520px", margin: "0 auto 24px",
    display: "flex", alignItems: "center", gap: "10px",
    background: "rgba(255,255,255,0.10)", backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.18)", borderRadius: "16px",
    padding: "4px 16px",
  },
  searchInput: {
    flex: 1, background: "transparent", border: "none",
    color: "#ecfdf5", fontSize: "14px", padding: "10px 0",
    outline: "none", fontFamily: "inherit",
  },

  // Stats
  statsStrip: {
    display: "flex", justifyContent: "center", gap: "14px",
    flexWrap: "wrap", margin: "0 auto 32px",
    maxWidth: "720px", padding: "0 20px",
  },
  statCard: {
    display: "flex", flexDirection: "column", alignItems: "center",
    background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.15)", borderRadius: "16px",
    padding: "14px 28px", minWidth: "120px",
  },
  statIcon:  { fontSize: "20px", marginBottom: "4px" },
  statValue: { fontSize: "24px", fontWeight: "800", color: "#ecfdf5" },
  statLabel: { fontSize: "10px", color: "#6ee7b7", fontWeight: "700",
               textTransform: "uppercase", letterSpacing: "0.06em" },

  // Grid
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))",
    gap: "22px", padding: "0 28px",
    maxWidth: "1280px", margin: "0 auto",
  },
  card: {
    background: "rgba(255,255,255,0.97)", borderRadius: "22px",
    overflow: "hidden", boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
  },
  cardImg: { width: "100%", height: "200px", objectFit: "cover", display: "block" },
  priorityTag: {
    position: "absolute", top: "10px", right: "10px",
    fontSize: "11px", fontWeight: "700",
    padding: "3px 11px", borderRadius: "999px",
    backdropFilter: "blur(6px)",
  },
  cardBody:  { padding: "16px 18px 18px" },
  cardTitle: { fontSize: "17px", fontWeight: "800", color: "#064e3b", margin: "0 0 10px" },
  infoRows:  { marginBottom: "4px" },
  delBtn: {
    marginTop: "12px", width: "100%",
    background: "linear-gradient(135deg,#ef4444,#dc2626)",
    color: "#fff", border: "none", borderRadius: "11px",
    padding: "10px", fontSize: "13px", fontWeight: "700",
    cursor: "pointer", fontFamily: "inherit",
    transition: "opacity .2s, transform .15s",
  },

  // Empty
  empty: { textAlign: "center", padding: "70px 20px" },
};

export default Dashboard;