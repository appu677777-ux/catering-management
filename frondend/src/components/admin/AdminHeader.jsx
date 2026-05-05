import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUser, FaPlus, FaUserPlus, FaSignOutAlt } from "react-icons/fa";

export default function AdminHeader() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b px-4 sm:px-6 py-3 flex items-center justify-between">

      
      {/* LEFT: LOGO + BRAND */}
      <div
        onClick={() => navigate("/admin")}
        className="flex items-center gap-3 cursor-pointer"
      >
        {/* LOGO */}
        <img
          src="/dosth_logo.png" // 👈 place your logo in public folder
          alt="logo"
          className="w-8 h-8 object-contain"
        />

        {/* TEXT */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Dosth Team
          </h2>
          <p className="text-xs text-gray-500 hidden sm:block">
            Admin Dashboard
          </p>
        </div>
      </div>

      {/* RIGHT: ACTIONS */}
      <div className="flex items-center gap-3 sm:gap-4">

        {/* USER */}
        <div className="hidden sm:flex items-center gap-2 text-gray-600 text-sm">
          <FaUser className="text-gray-500" />
          <span className="truncate max-w-[100px]">
            {user?.name}
          </span>
        </div>

        {/* ICON BUTTONS */}
        <div className="flex items-center gap-2">

          {/* ADD EVENT */}
          <button
            onClick={() => navigate("/admin/create-event")}
            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
            title="Create Event"
          >
            <FaPlus />
          </button>

          {/* ADD USER */}
          <button
            onClick={() => navigate("/register")}
            className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition"
            title="Add User"
          >
            <FaUserPlus />
          </button>

          {/* LOGOUT */}
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
            title="Logout"
          >
            <FaSignOutAlt />
          </button>

        </div>

      </div>
    </header>
  );
}