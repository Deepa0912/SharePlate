// src/pages/Dashboard.jsx
// ========================
// Main donor dashboard for SharePlate.
// Integrates:
//   - Food donation form with AI food image classifier (auto-fill)
//   - AI NGO recommendation badge per donation card
//   - Priority-sorted donation grid with stats strip
//   - Search / filter

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import NGOBadge from "../components/NGOBadge";
import FoodClassifier from "../components/FoodClassifier";
import { useLanguage } from "../context/LanguageContext";
import LanguageSelector from "../components/LanguageSelector";

// Minimum confidence (%) for AI to auto-fill the food name field
const AUTO_FILL_THRESHOLD = 80;

// Robust countdown duration parser and dynamic expiry utility
const getDynamicExpiry = (createdTimeIso, expiryString) => {
  if (!createdTimeIso) return { label: expiryString, isExpired: false, percentRemaining: 100 };
  
  try {
    const createdTime = new Date(createdTimeIso);
    const now = new Date();
    const elapsedMs = now - createdTime;
    const elapsedHours = elapsedMs / (1000 * 60 * 60);

    let initialHours = 3; // Default fallback
    const numMatch = expiryString.match(/(\d+(\.\d+)?)/);
    if (numMatch) {
      initialHours = parseFloat(numMatch[1]);
    }
    
    if (/day|d\b/i.test(expiryString)) {
      initialHours *= 24;
    } else if (/min|m\b/i.test(expiryString)) {
      initialHours /= 60;
    }

    const remainingHours = initialHours - elapsedHours;
    if (remainingHours <= 0) {
      return { label: "Expired", isExpired: true, percentRemaining: 0 };
    }

    const percentRemaining = Math.max(0, Math.min(100, (remainingHours / initialHours) * 100));

    if (remainingHours >= 24) {
      const days = Math.floor(remainingHours / 24);
      const hours = Math.round(remainingHours % 24);
      return { label: `${days}d ${hours}h left`, isExpired: false, percentRemaining };
    } else if (remainingHours >= 1) {
      const hours = Math.floor(remainingHours);
      const minutes = Math.round((remainingHours - hours) * 60);
      return { label: `${hours}h ${minutes}m left`, isExpired: false, percentRemaining };
    } else {
      const minutes = Math.round(remainingHours * 60);
      return { label: `${minutes}m left`, isExpired: false, percentRemaining };
    }
  } catch (e) {
    console.error("Countdown calculation failed:", e);
    return { label: expiryString, isExpired: false, percentRemaining: 100 };
  }
};

function Dashboard() {
  const { t } = useLanguage();
  
  // Real-time ticking state to trigger countdown updates without reload
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((curr) => curr + 1), 10000); // 10-second tick
    return () => clearInterval(timer);
  }, []);
  
  // Parse current logged-in user details from token
  const token = localStorage.getItem("token");
  let currentUserEmail = "";
  let currentUserRole = "";
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      currentUserEmail = payload.email || "";
      currentUserRole = payload.role || "";
    }
  } catch (e) {
    console.error("JWT parse error:", e);
  }

  const [donations,      setDonations]      = useState([]);
  const [ngoMap,         setNgoMap]         = useState({});
  const [ngoLoading,     setNgoLoading]     = useState({});
  const [volunteerShifts, setVolunteerShifts] = useState([]);
  const [shiftLoading,   setShiftLoading]   = useState(false);
  const [submitting,     setSubmitting]     = useState(false);
  const [search,         setSearch]         = useState("");
  const [activeTab,      setActiveTab]      = useState("all"); // "all", "available", "bookings", "donations"

  const [formData, setFormData] = useState({
    food_name:   "",
    quantity:    "",
    expiry_time: "",
    location:    "",
    donor_id:    currentUserEmail,
  });

  // Custom modal notification and confirmation state
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "alert", // "alert" | "confirm"
    onConfirm: null,
    onCancel: null
  });

  const customAlert = (message, title = "Notification") => {
    return new Promise((resolve) => {
      setModalConfig({
        isOpen: true,
        title,
        message,
        type: "alert",
        onConfirm: () => {
          setModalConfig(prev => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: null
      });
    });
  };

  const customConfirm = (message, title = "Confirm Action") => {
    return new Promise((resolve) => {
      setModalConfig({
        isOpen: true,
        title,
        message,
        type: "confirm",
        onConfirm: () => {
          setModalConfig(prev => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setModalConfig(prev => ({ ...prev, isOpen: false }));
          resolve(false);
        }
      });
    });
  };

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
  const fetchVolunteerShifts = async () => {
    setShiftLoading(true);
    try {
      const { data } = await API.get("/volunteer-shifts?max_results=3");
      setVolunteerShifts(data.shifts || []);
    } catch (err) {
      console.error("[Dashboard] volunteer shifts error:", err);
    } finally {
      setShiftLoading(false);
    }
  };

  const fetchDonations = async () => {
    try {
      const { data } = await API.get("/donations");
      setDonations(data);
      fetchNGORecommendations(data);
    } catch (err) {
      console.error("[Dashboard] fetchDonations error:", err);
    }
  };

  useEffect(() => {
    fetchDonations();
    fetchVolunteerShifts();
  }, []);

  // Handle AI-driven operations dispatched from Chatbot
  useEffect(() => {
    const handleAIAction = async (e) => {
      const { action, data } = e.detail;
      if (!action) return;

      const notifyText = `🤖 AI Agent processing action: ${action}`;
      console.log(notifyText, data);

      if (action === "CREATE_DONATION") {
        const { food_name, quantity, expiry_time, location } = data;
        const newDonationForm = new FormData();
        newDonationForm.append("food_name", food_name || "Pasta");
        newDonationForm.append("quantity", quantity || "10 plates");
        newDonationForm.append("expiry_time", expiry_time || "3 hours");
        newDonationForm.append("location", location || "Central Square");
        newDonationForm.append("donor_id", currentUserEmail);
        
        try {
          await API.post("/donate", newDonationForm);
          await customAlert(`AI successfully created a donation for: ${food_name || 'Pasta'}!`, "AI Agent Action Completed");
          fetchDonations();
        } catch (err) {
          console.error("AI create donation failed:", err);
          await customAlert("AI failed to create donation.", "Error");
        }
        return;
      }

      // Look up target food by name (case-insensitive fuzzy match)
      const targetName = (data?.food_name || "").toLowerCase().trim();
      if (!targetName) {
        await customAlert("Please specify the food name for the operation.", "AI Input Error");
        return;
      }

      const match = donations.find(d => 
        (d.food_name || "").toLowerCase().includes(targetName)
      );

      if (!match) {
        await customAlert(`Could not find an active donation matching "${data.food_name}".`, "AI Search Error");
        return;
      }

      const donationId = match.id;
      const foodDisplay = match.food_name;

      if (action === "DELETE_DONATION") {
        try {
          await API.delete(`/donation/${donationId}`);
          await customAlert(`AI successfully deleted donation: ${foodDisplay}`, "AI Agent Action Completed");
          fetchDonations();
        } catch (err) {
          console.error("AI delete failed:", err);
          await customAlert("AI failed to delete donation.", "Error");
        }
      } else if (action === "BOOK_DONATION") {
        try {
          await API.post(`/donation/${donationId}/book`, { email: currentUserEmail });
          await customAlert(`AI successfully booked food: ${foodDisplay}`, "AI Agent Action Completed");
          fetchDonations();
        } catch (err) {
          console.error("AI book failed:", err);
          await customAlert(err.response?.data?.detail || "AI booking failed.", "Error");
        }
      } else if (action === "CANCEL_BOOKING") {
        try {
          await API.post(`/donation/${donationId}/cancel-booking`);
          await customAlert(`AI successfully cancelled booking for: ${foodDisplay}`, "AI Agent Action Completed");
          fetchDonations();
        } catch (err) {
          console.error("AI cancel booking failed:", err);
          await customAlert(err.response?.data?.detail || "AI cancellation failed.", "Error");
        }
      } else if (action === "COLLECT_DONATION") {
        try {
          await API.post(`/donation/${donationId}/collect`);
          await customAlert(`AI successfully marked food as collected: ${foodDisplay}`, "AI Agent Action Completed");
          fetchDonations();
        } catch (err) {
          console.error("AI collection failed:", err);
          await customAlert(err.response?.data?.detail || "AI collection failed.", "Error");
        }
      }
    };

    window.addEventListener("sp-ai-action", handleAIAction);
    return () => window.removeEventListener("sp-ai-action", handleAIAction);
  }, [donations, currentUserEmail]);

  // ── Submit donation ───────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    data.append("image", image);

    try {
      await API.post("/donate", data);
      await customAlert("Donation added successfully!", "Success");
      // Reset form
      setFormData({ food_name: "", quantity: "", expiry_time: "", location: "", donor_id: currentUserEmail });
      setImage(null);
      fetchDonations();
    } catch (err) {
      console.error("[Dashboard] donate error:", err);
      await customAlert("Donation failed — check console.", "Error");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete donation ───────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    const ok = await customConfirm("Delete this donation?", "Delete Donation");
    if (!ok) return;
    try {
      await API.delete(`/donation/${id}`);
      fetchDonations();
    } catch (err) {
      console.error("[Dashboard] delete error:", err);
      await customAlert("Delete failed.", "Error");
    }
  };

  // ── Book Food ─────────────────────────────────────────────────────────────
  const handleBook = async (id) => {
    const ok = await customConfirm("Book this food item?", "Book Food");
    if (!ok) return;
    try {
      await API.post(`/donation/${id}/book`, { email: currentUserEmail });
      await customAlert("Success! Food has been booked.", "Booked");
      fetchDonations();
    } catch (err) {
      console.error("[Dashboard] book error:", err);
      await customAlert(err.response?.data?.detail || "Booking failed.", "Error");
    }
  };

  // ── Cancel Booking ────────────────────────────────────────────────────────
  const handleCancelBooking = async (id) => {
    const ok = await customConfirm("Cancel this booking?", "Cancel Booking");
    if (!ok) return;
    try {
      await API.post(`/donation/${id}/cancel-booking`);
      await customAlert("Success! Booking cancelled.", "Cancelled");
      fetchDonations();
    } catch (err) {
      console.error("[Dashboard] cancel booking error:", err);
      await customAlert(err.response?.data?.detail || "Cancellation failed.", "Error");
    }
  };

  // ── Mark as Collected ─────────────────────────────────────────────────────
  const handleCollect = async (id) => {
    const ok = await customConfirm("Mark this food as collected?", "Collect Food");
    if (!ok) return;
    try {
      await API.post(`/donation/${id}/collect`);
      await customAlert("Success! Food marked as collected.", "Collected");
      fetchDonations();
    } catch (err) {
      console.error("[Dashboard] collect error:", err);
      await customAlert(err.response?.data?.detail || "Collect failed.", "Error");
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = donations.filter((d) => {
    // 1. Tab filters
    if (activeTab === "available" && d.status !== "Pending" && d.status !== "Available" && d.status !== "Approved" && d.status !== null && d.status !== undefined) {
      return false;
    }
    if (activeTab === "bookings" && d.booked_by !== currentUserEmail) {
      return false;
    }
    if (activeTab === "donations" && d.donor_id !== currentUserEmail) {
      return false;
    }

    // 2. Search query filter
    return (
      d.food_name.toLowerCase().includes(search.toLowerCase()) ||
      d.location.toLowerCase().includes(search.toLowerCase())
    );
  });

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
          <h1 style={S.navTitle}>{t('brand')}</h1>
          <span style={S.navBadge}>{t('dashboard')}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <LanguageSelector />
          <Link
            to="/analytics"
            style={{
              background: "#f1f5f9",
              color: "#334155",
              textDecoration: "none",
              border: "1px solid #cbd5e1",
              borderRadius: "10px",
              padding: "8px 16px",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            📊 {t('analytics')}
          </Link>
          <button onClick={handleLogout} style={S.logoutBtn}>{t('logout')}</button>
        </div>
      </nav>

      {/* ── Donation Form ────────────────────────────────────────────────── */}
      <section style={S.formCard}>
        <h2 style={S.sectionTitle}>➕ {t('modal_title')}</h2>

        {/* AI Classifier — sits above the form */}
        <FoodClassifier onFoodDetected={handleFoodDetected} />

        <form onSubmit={handleSubmit}>
          <div style={S.formGrid}>

            {/* Food name — may be auto-filled by the classifier */}
            <div style={S.fieldGroup}>
              <label style={S.label}>
                {t('lbl_food')}
                {formData.food_name && (
                  <span style={S.autoFillTag}>🤖 AI Auto-fill</span>
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
              <label style={S.label}>{t('col_qty')}</label>
              <input
                type="text"
                name="quantity"
                placeholder={t('lbl_quantity')}
                value={formData.quantity}
                style={S.input}
                onChange={handleChange}
                required
              />
            </div>

            <div style={S.fieldGroup}>
              <label style={S.label}>{t('col_expiry')}</label>
              <input
                type="text"
                name="expiry_time"
                placeholder={t('lbl_expiry')}
                value={formData.expiry_time}
                style={S.input}
                onChange={handleChange}
                required
              />
            </div>

            <div style={S.fieldGroup}>
              <label style={S.label}>{t('col_location')}</label>
              <input
                type="text"
                name="location"
                placeholder={t('lbl_location')}
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
              <label style={S.label}>{t('lbl_image')}</label>
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
            {submitting ? "Submitting…" : t('btn_submit')}
          </button>
        </form>
      </section>

      {/* ── Search ───────────────────────────────────────────────────────── */}
      <div style={S.searchWrapper}>
        <span style={{ color: "#64748b" }}>🔍</span>
        <input
          type="text"
          placeholder="Search..."
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

      {/* ── Volunteer Micro-Shifts ───────────────────────────────────────────── */}
      <section style={S.volunteerSection}>
        <div style={S.sectionHeader}>
          <div>
            <p style={S.sectionSub}>🚚 Volunteer Micro-Shift</p>
            <h2 style={{ margin: 0, fontSize: "20px", color: "#0f172a" }}>Top urgent pickups</h2>
          </div>
          {shiftLoading && <span style={{ color: "#64748b", fontSize: "13px" }}>Loading shifts...</span>}
        </div>

        {volunteerShifts.length > 0 ? (
          <div style={S.shiftGrid}>
            {volunteerShifts.map((shift) => (
              <div key={shift.id} style={S.shiftCard}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "16px", color: "#111827" }}>{shift.food_name}</h3>
                    <p style={{ margin: "8px 0 0", color: "#475569", fontSize: "13px" }}>{shift.quantity} · {shift.location}</p>
                  </div>
                  <span style={shift.urgency_level === "HIGH" ? S.highBadge : S.mediumBadge}>
                    {shift.urgency_level}
                  </span>
                </div>
                <div style={{ marginTop: "14px", fontSize: "13px", color: "#334155" }}>
                  <p style={{ margin: "0 0 8px" }}><strong>{shift.recommended_ngo?.name || "NGO not found"}</strong> · {shift.recommended_ngo?.distance_km ?? "—"} km</p>
                  <p style={{ margin: 0, color: "#6b7280" }}>{shift.pickup_route || "Route info unavailable."}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={S.emptyShift}>
            <p style={{ margin: 0, color: "#64748b" }}>No urgent volunteer shifts available yet.</p>
          </div>
        )}
      </section>

      {/* ── Tab Filters ──────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", borderBottom: "1px solid #e2e8f0", paddingBottom: "1px" }}>
        {[
          { id: "all", label: t('tab_all') },
          { id: "available", label: t('tab_available') },
          { id: "bookings", label: t('tab_my_bookings') },
          { id: "donations", label: t('tab_my_donations') },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: "600",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              border: "1px solid transparent",
              marginBottom: "-1.5px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              backgroundColor: activeTab === tab.id ? "#ffffff" : "transparent",
              borderColor: activeTab === tab.id ? "#e2e8f0 #e2e8f0 transparent" : "transparent",
              color: activeTab === tab.id ? "#059669" : "#64748b",
              boxShadow: activeTab === tab.id ? "0 -2px 10px rgba(0,0,0,0.02)" : "none",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Donation Grid ────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div style={S.empty}>
          <p style={{ fontSize: "52px", margin: "0 0 12px" }}>🍱</p>
          <h2 style={{ color: "#334155", margin: "0 0 8px" }}>No Donations Found</h2>
          <p style={{ color: "#64748b" }}>Add one above or adjust your search.</p>
        </div>
      ) : (
        <div style={S.grid}>
          {filtered.map((donation) => {
            const ps = priorityStyle[donation.priority] || priorityStyle.MEDIUM;
            const expiryInfo = getDynamicExpiry(donation.created_at, donation.expiry_time);
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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", gap: "8px" }}>
                    <h3 style={{ ...S.cardTitle, margin: 0 }}>{donation.food_name}</h3>
                    <span style={{
                      padding: "4px 10px",
                      borderRadius: "9999px",
                      fontSize: "11px",
                      fontWeight: "800",
                      textTransform: "uppercase",
                      border: "1px solid",
                      whiteSpace: "nowrap",
                      backgroundColor: expiryInfo.isExpired ? "#fee2e2" : donation.status === "Booked" ? "#fef3c7" : donation.status === "Collected" ? "#f1f5f9" : "#dcfce7",
                      borderColor: expiryInfo.isExpired ? "#fecaca" : donation.status === "Booked" ? "#fde68a" : donation.status === "Collected" ? "#cbd5e1" : "#bbf7d0",
                      color: expiryInfo.isExpired ? "#ef4444" : donation.status === "Booked" ? "#b45309" : donation.status === "Collected" ? "#475569" : "#15803d",
                    }}>
                      {expiryInfo.isExpired
                        ? "⚠️ Expired"
                        : donation.status === "Booked"
                        ? `🤝 ${t('status_booked')}`
                        : donation.status === "Collected"
                        ? `✅ ${t('status_collected')}`
                        : `🟢 ${t('status_available')}`}
                    </span>
                  </div>

                  <div style={S.infoRows}>
                    <InfoRow icon="⚖️" label={t('col_qty')}      value={donation.quantity} />
                    <InfoRow icon="⏰" label={t('col_expiry')}  value={expiryInfo.label} />
                    <InfoRow icon="📍" label={t('col_location')} value={donation.location} />
                    <InfoRow icon="🔥" label="Spoilage" value={donation.spoilage?.spoilage_label || donation.spoilage_label || "Unknown"} />
                    <InfoRow icon="🍽️" label="Meal Match" value={donation.meal_suggestions?.[0]?.recipe_name ? `${donation.meal_suggestions[0].recipe_name} (${donation.meal_suggestions[0].servings} servings)` : "N/A"} />
                    {donation.pickup_route && <InfoRow icon="🚚" label="Pickup route" value={donation.pickup_route} />}
                    <InfoRow icon="🔄" label={t('col_status')}   value={expiryInfo.isExpired ? "Expired" : (donation.status || "Pending")} />
                  </div>

                  {/* Countdown Progress Bar */}
                  <div style={{
                    width: "100%",
                    height: "4px",
                    backgroundColor: "#e2e8f0",
                    borderRadius: "2px",
                    marginTop: "6px",
                    marginBottom: "12px",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      width: `${expiryInfo.percentRemaining}%`,
                      height: "100%",
                      backgroundColor: expiryInfo.percentRemaining < 25 ? "#ef4444" : expiryInfo.percentRemaining < 60 ? "#f59e0b" : "#10b981",
                      transition: "width 0.5s ease"
                    }} />
                  </div>

                  {/* NGO Recommendation Badge */}
                  <NGOBadge
                    ngo={ngoMap[donation.id]}
                    loading={!!ngoLoading[donation.id]}
                  />

                  {/* Action Buttons */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "16px" }}>
                    {/* 1. Book button (Available for Pending foods) */}
                    {(donation.status === "Pending" || donation.status === "Available" || donation.status === "Approved" || !donation.status) && (
                      <button
                        disabled={expiryInfo.isExpired}
                        onClick={() => handleBook(donation.id)}
                        style={{
                          backgroundColor: expiryInfo.isExpired ? "#cbd5e1" : "#059669",
                          color: "#ffffff",
                          fontWeight: "600",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          border: "none",
                          fontSize: "14px",
                          cursor: expiryInfo.isExpired ? "not-allowed" : "pointer",
                          transition: "all 0.2s ease",
                          width: "100%",
                          boxShadow: expiryInfo.isExpired ? "none" : "0 2px 4px rgba(0,0,0,0.05)",
                        }}
                      >
                        {expiryInfo.isExpired ? "⚠️ Expired" : `🤝 ${t('btn_book')}`}
                      </button>
                    )}

                    {/* 2. Collected & Cancel Bookings buttons (Visible to Booker when Booked) */}
                    {donation.status === "Booked" && (
                      <>
                        {donation.booked_by === currentUserEmail ? (
                          <div style={{ display: "flex", gap: "8px", width: "100%" }}>
                            <button
                              onClick={() => handleCollect(donation.id)}
                              style={{
                                flex: 1,
                                backgroundColor: "#2563eb",
                                color: "#ffffff",
                                fontWeight: "600",
                                padding: "10px 10px",
                                borderRadius: "8px",
                                border: "none",
                                fontSize: "12px",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                textAlign: "center",
                              }}
                            >
                              ✅ {t('btn_collect')}
                            </button>
                            <button
                              onClick={() => handleCancelBooking(donation.id)}
                              style={{
                                flex: 1,
                                backgroundColor: "#f59e0b",
                                color: "#ffffff",
                                fontWeight: "600",
                                padding: "10px 10px",
                                borderRadius: "8px",
                                border: "none",
                                fontSize: "12px",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                textAlign: "center",
                              }}
                            >
                              ❌ {t('btn_cancel_booking')}
                            </button>
                          </div>
                        ) : (
                          <div style={{
                            textAlign: "center",
                            fontSize: "12px",
                            color: "#b45309",
                            backgroundColor: "#fffbeb",
                            border: "1px solid #fde68a",
                            padding: "8px",
                            borderRadius: "8px",
                            fontWeight: "500",
                            lineHeight: "1.4",
                          }}>
                            🔒 Booked by {donation.booked_by}
                          </div>
                        )}
                      </>
                    )}

                    {/* 3. Collected details (if status is Collected) */}
                    {donation.status === "Collected" && (
                      <div style={{
                        textAlign: "center",
                        fontSize: "12px",
                        color: "#475569",
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        padding: "8px",
                        borderRadius: "8px",
                        fontWeight: "500",
                      }}>
                        🎉 Collected and saved!
                      </div>
                    )}

                    {/* 4. Delete button (Visible for management) */}
                    <button
                      onClick={() => handleDelete(donation.id)}
                      style={{
                        ...S.delBtn,
                        width: "100%",
                        marginTop: "4px",
                      }}
                      className="sp-del"
                    >
                      🗑️ {t('btn_delete')}
                    </button>
                  </div>
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
        body { margin: 0; font-family: 'Inter', sans-serif; background-color: #f8fafc; }
        .sp-card  { transition: transform .25s ease, box-shadow .25s ease; }
        .sp-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,.08) !important; }
        .sp-del:hover  { opacity: .85; transform: scale(1.02); }
        input::placeholder { color: #94a3b8; }
        input:focus { outline: none; border-color: #10b981 !important; }
        @keyframes fadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(8px); }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* ── Custom Centered Alert/Confirm Modal ─────────────────────────── */}
      {modalConfig.isOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.4)",
          backdropFilter: "blur(8px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 99999,
          animation: "fadeIn 0.2s ease-out",
        }}>
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: "1px solid #f1f5f9",
            width: "90%",
            maxWidth: "380px",
            padding: "32px 24px 24px",
            textAlign: "center",
            animation: "scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
            {/* Modal Icon / Visual Cue */}
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: modalConfig.type === "confirm" ? "#fef3c7" : "#dcfce7",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "30px",
              margin: "0 auto 20px",
            }}>
              {modalConfig.type === "confirm" ? "❓" : "🔔"}
            </div>

            {/* Modal Title */}
            <h3 style={{
              fontSize: "20px",
              fontWeight: "800",
              color: "#0f172a",
              margin: "0 0 10px 0",
              letterSpacing: "-0.025em",
            }}>
              {modalConfig.title}
            </h3>

            {/* Modal Message */}
            <p style={{
              fontSize: "14px",
              color: "#64748b",
              margin: "0 0 28px 0",
              lineHeight: "1.6",
              fontWeight: "500",
            }}>
              {modalConfig.message}
            </p>

            {/* Modal Action Control Buttons */}
            <div style={{
              display: "flex",
              gap: "10px",
            }}>
              {modalConfig.type === "confirm" && (
                <button
                  onClick={modalConfig.onCancel}
                  style={{
                    flex: 1,
                    padding: "12px 18px",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#ffffff",
                    color: "#64748b",
                    fontWeight: "700",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#f8fafc";
                    e.target.style.borderColor = "#cbd5e1";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#ffffff";
                    e.target.style.borderColor = "#e2e8f0";
                  }}
                >
                  Cancel
                </button>
              )}
              <button
                onClick={modalConfig.onConfirm}
                style={{
                  flex: 1,
                  padding: "12px 18px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "#059669",
                  color: "#ffffff",
                  fontWeight: "700",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 6px -1px rgba(5, 150, 105, 0.2)",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#047857";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#059669";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ── Info row helper ────────────────────────────────────────────────────────
function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: "flex", gap: "6px", alignItems: "baseline", marginBottom: "4px" }}>
      <span style={{ fontSize: "13px" }}>{icon}</span>
      <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "700", minWidth: "52px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
      <span style={{ fontSize: "13px", color: "#1e293b", fontWeight: "500" }}>{value}</span>
    </div>
  );
}

// ── Design tokens ──────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #ecfdf5 100%)",
    fontFamily: "'Inter',sans-serif",
    paddingBottom: "60px",
  },

  // Navbar
  navbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 36px",
    background: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    marginBottom: "32px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
  },
  navBrand:  { display: "flex", alignItems: "center", gap: "10px" },
  navLogo:   { fontSize: "26px" },
  navTitle:  { fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: 0 },
  navBadge:  {
    fontSize: "11px", color: "#059669",
    background: "#ecfdf5",
    padding: "2px 10px", borderRadius: "999px",
    fontWeight: "700", letterSpacing: "0.05em",
    border: "1px solid #a7f3d0",
  },
  logoutBtn: {
    background: "linear-gradient(135deg,#ef4444,#dc2626)",
    color: "#fff", border: "none", borderRadius: "10px",
    padding: "8px 20px", fontWeight: "700",
    cursor: "pointer", fontSize: "13px",
    boxShadow: "0 2px 4px rgba(239, 68, 68, 0.2)",
  },

  // Form card
  formCard: {
    maxWidth: "720px", margin: "0 auto 28px",
    background: "#ffffff",
    border: "1px solid #e2e8f0", borderRadius: "24px",
    padding: "28px 32px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)",
  },
  sectionTitle: { color: "#0f172a", fontSize: "18px", fontWeight: "700", margin: "0 0 18px" },

  // Form inputs
  formGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: "14px", marginBottom: "16px",
  },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { color: "#334155", fontSize: "12px", fontWeight: "700",
           textTransform: "uppercase", letterSpacing: "0.05em",
           display: "flex", alignItems: "center", gap: "6px" },
  autoFillTag: {
    fontSize: "10px", background: "#ecfdf5",
    color: "#059669", padding: "1px 8px", borderRadius: "999px",
    fontWeight: "700", letterSpacing: "0.03em",
    border: "1px solid #a7f3d0",
  },
  input: {
    padding: "10px 13px", borderRadius: "11px",
    border: "1px solid #cbd5e1",
    background: "#ffffff", color: "#1e293b",
    fontSize: "14px", fontFamily: "inherit", width: "100%",
    transition: "border-color .2s",
  },
  submitBtn: {
    width: "100%", padding: "13px",
    background: "linear-gradient(135deg,#10b981,#059669)",
    color: "#fff", border: "none", borderRadius: "13px",
    fontSize: "15px", fontWeight: "700", cursor: "pointer",
    fontFamily: "inherit", letterSpacing: "0.03em",
    boxShadow: "0 4px 6px rgba(16, 185, 129, 0.15)",
  },

  // Search
  searchWrapper: {
    maxWidth: "520px", margin: "0 auto 24px",
    display: "flex", alignItems: "center", gap: "10px",
    background: "#ffffff",
    border: "1px solid #e2e8f0", borderRadius: "16px",
    padding: "4px 16px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
  },
  searchInput: {
    flex: 1, background: "transparent", border: "none",
    color: "#1e293b", fontSize: "14px", padding: "10px 0",
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
    background: "#ffffff",
    border: "1px solid #e2e8f0", borderRadius: "16px",
    padding: "14px 28px", minWidth: "120px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
  },
  statIcon:  { fontSize: "20px", marginBottom: "4px" },
  statValue: { fontSize: "24px", fontWeight: "800", color: "#0f172a" },
  statLabel: { fontSize: "10px", color: "#475569", fontWeight: "700",
               textTransform: "uppercase", letterSpacing: "0.06em" },

  // Grid
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))",
    gap: "22px", padding: "0 28px",
    maxWidth: "1280px", margin: "0 auto",
  },
  card: {
    background: "#ffffff", borderRadius: "22px",
    overflow: "hidden", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)",
    border: "1px solid #e2e8f0",
  },
  volunteerSection: {
    maxWidth: "1280px",
    margin: "0 auto 34px",
    padding: "0 28px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "16px",
    marginBottom: "18px",
  },
  sectionSub: {
    margin: 0,
    color: "#0f766e",
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  shiftGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
  },
  shiftCard: {
    borderRadius: "22px",
    border: "1px solid #e2e8f0",
    padding: "18px",
    background: "#ffffff",
    boxShadow: "0 8px 20px -10px rgba(15, 23, 42, 0.12)",
  },
  highBadge: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    borderRadius: "999px",
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  mediumBadge: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "#fef9c3",
    color: "#78350f",
    borderRadius: "999px",
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  emptyShift: {
    borderRadius: "22px",
    border: "1px dashed #cbd5e1",
    padding: "28px",
    background: "#ffffff",
    textAlign: "center",
  },
  cardImg: { width: "100%", height: "200px", objectFit: "cover", display: "block" },
  priorityTag: {
    position: "absolute", top: "10px", right: "10px",
    fontSize: "11px", fontWeight: "700",
    padding: "3px 11px", borderRadius: "999px",
    backdropFilter: "blur(6px)",
  },
  cardBody:  { padding: "16px 18px 18px" },
  cardTitle: { fontSize: "17px", fontWeight: "800", color: "#0f172a", margin: "0 0 10px" },
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