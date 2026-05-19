import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import LanguageSelector from "../components/LanguageSelector";

function Signup() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "donor"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async () => {
    try {
      const response = await API.post("/signup", formData);
      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Signup failed";
      alert(errorMessage);
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center theme-bg-light-gradient relative">
      <div className="absolute top-6 right-6">
        <LanguageSelector />
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 w-96 border-t-4 theme-border-primary">
        <h2 className="text-3xl font-bold text-center theme-text-primary mb-6">
          {t('signup_title')}
        </h2>

        <input
          type="text"
          name="name"
          placeholder={t('ph_name')}
          className="w-full p-3 border border-slate-200 rounded-lg mb-4 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder={t('ph_email')}
          className="w-full p-3 border border-slate-200 rounded-lg mb-4 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder={t('ph_password')}
          className="w-full p-3 border border-slate-200 rounded-lg mb-4 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
          onChange={handleChange}
        />

        <select
          name="role"
          className="w-full p-3 border border-slate-200 rounded-lg mb-6 text-slate-700 bg-white focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
          onChange={handleChange}
        >
          <option value="donor">{t('opt_donor')}</option>
          <option value="ngo">{t('opt_ngo')}</option>
          <option value="volunteer">{t('opt_volunteer')}</option>
        </select>

        <button
          onClick={handleSignup}
          className="w-full theme-btn-primary py-3 rounded-lg font-semibold shadow-sm hover:shadow"
        >
          {t('btn_signup')}
        </button>

        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="theme-text-primary hover:underline font-semibold">
            {t('login')}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;