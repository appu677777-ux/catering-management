import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUser, FaPlus, FaUserPlus } from "react-icons/fa";

export default function AdminHeader() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-md px-4 sm:px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">

      {/* Title */}
      <h2
        onClick={() => navigate("/admin")}
        className="text-xl font-bold text-gray-800 cursor-pointer"
      >
        🍽️ Catering Admin
      </h2>

      {/* Right Section */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">

        {/* User */}
        <span className="text-gray-600 text-sm sm:text-base flex items-center gap-1">
          <FaUser /> {user?.name}
        </span>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">

          {/* Create Event */}
          <button
            onClick={() => navigate("/admin/create-event")}
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
          >
            <FaPlus /> Event
          </button>

          {/* Create User */}
          <button
            onClick={() => navigate("/register")}
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition text-sm"
          >
            <FaUserPlus /> User
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-full sm:w-auto bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition text-sm"
          >
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}