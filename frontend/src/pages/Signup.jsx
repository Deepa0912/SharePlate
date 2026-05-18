import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Signup() {

  const navigate = useNavigate();

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

      alert("Signup failed");

      console.log(error);

    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-green-50">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">

        <h2 className="text-3xl font-bold text-center text-green-600 mb-6">
          Signup
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full p-3 border rounded-lg mb-4"
          onChange={handleChange}
        />

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
          className="w-full p-3 border rounded-lg mb-4"
          onChange={handleChange}
        />

        <select
          name="role"
          className="w-full p-3 border rounded-lg mb-6"
          onChange={handleChange}
        >

          <option value="donor">donor</option>

          <option value="ngo">ngo</option>

          <option value="volunteer">volunteer</option>

        </select>

        <button
          onClick={handleSignup}
          className="w-full bg-green-600 text-white py-3 rounded-lg"
        >
          Signup
        </button>

      </div>
    </div>
  );
}

export default Signup;