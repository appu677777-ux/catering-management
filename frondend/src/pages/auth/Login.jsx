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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/dosth_logo.png"   // 👉 replace with your logo path
            alt="App Logo"
            className="w-16 h-16 mb-2"
          />
          <h2 className="text-2xl font-bold text-gray-800">
            Login to Your Account
          </h2>
          <p className="text-sm text-gray-500">
            Enter your credentials to continue
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full mt-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {/* LOGIN BUTTON */}
          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>

        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-500 mt-6">
          © {new Date().getFullYear()} Dosth Team
        </p>

      </div>
    </div>
  );
}