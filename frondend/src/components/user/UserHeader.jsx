import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";

export default function UserHeader() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b px-4 sm:px-6 py-3 flex items-center justify-between">

      {/* LEFT: LOGO + BRAND */}
      <div
        onClick={() => navigate("/user")}
        className="flex items-center gap-3 cursor-pointer"
      >
        {/* LOGO */}
        <img
          src="/dosth_logo.png"
          alt="logo"
          className="w-8 h-8 object-contain"
        />

        {/* TEXT */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Dosth Team
          </h2>

          {/* 📱 MOBILE NAME */}
          <p className="text-xs text-gray-500 sm:hidden">
            Boy : {user?.name}
          </p>

          {/* 💻 DESKTOP LABEL */}
          <p className="text-xs text-gray-500 hidden sm:block">
            Staff Dashboard
          </p>
        </div>
      </div>

      {/* RIGHT: ACTIONS */}
      <div className="flex items-center gap-3 sm:gap-4">

        {/* 💻 DESKTOP USER */}
        <div className="hidden sm:flex items-center gap-2 text-gray-600 text-sm">
          <FaUser className="text-gray-500" />
          <span className="truncate max-w-[100px]">
            {user?.name}
          </span>
        </div>

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
    </header>
  );
}
