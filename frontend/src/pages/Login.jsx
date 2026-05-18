import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

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

      alert("Login failed");

      console.log(error);

    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-green-50">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">

        <h2 className="text-3xl font-bold text-center text-green-600 mb-6">
          Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg mb-4"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg mb-6"
          onChange={handleChange}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-green-600 text-white py-3 rounded-lg"
        >
          Login
        </button>

      </div>
    </div>
  );
}

export default Login;