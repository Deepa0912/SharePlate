import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import LanguageSelector from "../components/LanguageSelector";

function ForgotPassword() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [step, setStep] = useState(1); // 1 = Request Code, 2 = Reset Password
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [devCode, setDevCode] = useState(""); // captured from developer sandbox response
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Dynamic SMTP configurations
  const [smtpUser, setSmtpUser] = useState(localStorage.getItem("shareplate_smtp_user") || "");
  const [smtpPassword, setSmtpPassword] = useState(localStorage.getItem("shareplate_smtp_password") || "");
  const [showSmtpSettings, setShowSmtpSettings] = useState(false);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Persist sender configuration locally
      if (smtpUser) localStorage.setItem("shareplate_smtp_user", smtpUser);
      if (smtpPassword) localStorage.setItem("shareplate_smtp_password", smtpPassword);

      const response = await API.post("/forgot-password", {
        email,
        smtp_user: smtpUser || null,
        smtp_password: smtpPassword || null,
      });
      if (response.data.email_sent) {
        setEmailSent(true);
        setSuccess(`Verification code sent to ${email}!`);
      } else {
        setEmailSent(false);
        setSuccess("Verification code generated successfully!");
        if (response.data.reset_code) {
          setDevCode(response.data.reset_code);
        }
      }
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to generate reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await API.post("/reset-password", {
        email,
        reset_code: resetCode,
        new_password: newPassword
      });
      alert("Password reset successful! Please log in with your new password.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center theme-bg-light-gradient relative">
      <div className="absolute top-6 right-6">
        <LanguageSelector />
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 w-96 border-t-4 theme-border-primary">
        <h2 className="text-3xl font-bold text-center theme-text-primary mb-2">
          Reset Password
        </h2>
        <p className="text-sm text-slate-500 text-center mb-6">
          {step === 1 
            ? "Enter your email to request a reset code" 
            : "Enter your 6-digit code and new password"}
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 border border-red-100">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 text-emerald-800 text-sm p-3 rounded-lg mb-4 border border-emerald-100">
            ✅ {success}
          </div>
        )}

        {/* Real Email Sent Info Badge */}
        {emailSent && step === 2 && (
          <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg mb-6 border border-blue-200">
            📧 <strong>Real Email Sent:</strong> A verification code has been sent directly to your email address! Please check your inbox (and spam folder).
          </div>
        )}

        {/* Developer Sandbox helper badge */}
        {!emailSent && devCode && step === 2 && (
          <div className="bg-amber-50 text-amber-800 text-xs p-3 rounded-lg mb-6 border border-amber-200">
            🛠️ <strong>Sandbox Mode:</strong> Your test reset code is: 
            <span className="bg-amber-200 px-2 py-1 rounded ml-1 text-sm font-extrabold select-all tracking-wider">
              {devCode}
            </span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestCode}>
            <input
              type="email"
              placeholder={t('ph_email')}
              value={email}
              className="w-full p-3 border border-slate-200 rounded-lg mb-4 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Collapsible SMTP dynamic configuration panel */}
            <div className="mt-2 mb-6 text-left">
              <button
                type="button"
                onClick={() => setShowSmtpSettings(!showSmtpSettings)}
                className="text-xs text-slate-500 hover:text-emerald-600 font-semibold flex items-center gap-1 focus:outline-none transition-colors"
              >
                ⚙️ {showSmtpSettings ? "Hide Sender Settings" : "Configure Real Email Sender (SMTP)"}
              </button>

              {showSmtpSettings && (
                <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl animate-fade-in text-left">
                  <p className="text-xs font-bold text-slate-700 mb-2">Configure Gmail SMTP</p>
                  
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Gmail Address</label>
                  <input
                    type="email"
                    placeholder="e.g. sender@gmail.com"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-200 rounded mb-2 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none bg-white"
                  />

                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Gmail App Password</label>
                  <input
                    type="password"
                    placeholder="16-character passcode"
                    value={smtpPassword}
                    onChange={(e) => setSmtpPassword(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-emerald-500/20 focus:outline-none font-mono bg-white"
                  />

                  <div className="mt-3 p-2 bg-amber-50 rounded border border-amber-100 text-[10px] text-amber-800 leading-relaxed">
                    💡 <strong>How to get passcode:</strong> Go to Google Account -{">"} Security -{">"} 2-Step Verification -{">"} <strong>App Passwords</strong> (at the bottom) -{">"} Select 'Other' and name it 'SharePlate' -{">"} Copy the generated 16-letter code here!
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full theme-btn-primary py-3 rounded-lg font-semibold shadow-sm hover:shadow"
            >
              {loading ? "Requesting..." : "Send Reset Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={resetCode}
              className="w-full p-3 border border-slate-200 rounded-lg mb-4 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all font-mono text-center tracking-widest text-lg font-bold"
              onChange={(e) => setResetCode(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              className="w-full p-3 border border-slate-200 rounded-lg mb-6 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full theme-btn-primary py-3 rounded-lg font-semibold shadow-sm hover:shadow"
            >
              {loading ? "Resetting..." : "Update Password"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="theme-text-primary hover:underline font-semibold">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
