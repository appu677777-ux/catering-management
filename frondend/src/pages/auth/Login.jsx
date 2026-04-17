import { useState } from "react";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";





export default function Login() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin");
      if (user.role === "captain") navigate("/captain");
      if (user.role === "user") navigate("/user");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      login(res.data);

      const role = res.data.user.role;

      if (role === "admin") navigate("/admin");
      if (role === "captain") navigate("/captain");
      if (role === "user") navigate("/user");

    } catch (err) {
      alert("Invalid credentials");
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">

      {/* Card */}
      <div className="bg-gradient-to-r from-red-500 to-indigo-600 shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {/* Button */}
          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        
      </div>
    </div>
  );
}