import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserHeader() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-md px-4 sm:px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">

      {/* Title */}
      <h2
        onClick={() => navigate("/user")}
        className="text-xl font-bold text-gray-800 cursor-pointer"
      >
        👷 Staff Dashboard
      </h2>

      {/* Right */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">

        <span className="text-gray-600 text-sm sm:text-base">
          👤 {user?.name}
        </span>

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
  );
}
