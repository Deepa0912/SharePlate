import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import LanguageSelector from "../components/LanguageSelector";

function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async () => {
    try {
      const response = await API.post("/login", formData);
      localStorage.setItem("token", response.data.token);
      alert("Login successful");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.detail || "Login failed");
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
          {t('login_title')}
        </h2>

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
          className="w-full p-3 border border-slate-200 rounded-lg mb-2 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
          onChange={handleChange}
        />

        <div className="flex justify-end mb-6">
          <Link to="/forgot-password" className="text-xs theme-text-primary hover:underline font-semibold">
            Forgot Password?
          </Link>
        </div>

        <button
          onClick={handleLogin}
          className="w-full theme-btn-primary py-3 rounded-lg font-semibold shadow-sm hover:shadow"
        >
          {t('login')}
        </button>

        <p className="mt-4 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link to="/signup" className="theme-text-primary hover:underline font-semibold">
            {t('signup')}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;