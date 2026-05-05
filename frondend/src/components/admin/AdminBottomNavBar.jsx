import { NavLink } from "react-router-dom";
import { FaCalendarAlt, FaUsers,FaMoneyBill  } from "react-icons/fa";

export default function AdminBottomNavBar() {
  const baseStyle =
    "flex flex-col items-center justify-center flex-1 py-2 text-xs transition-all duration-200";

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md z-50">

      <div className="flex">

        {/* EVENTS */}
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `${baseStyle} ${isActive
              ? "text-blue-600 bg-blue-50"
              : "text-gray-500"
            }`
          }
        >
          <FaCalendarAlt size={20} />
          <span className="mt-1">Events</span>
        </NavLink>

        {/* 💰 PAYMENTS */}
        <NavLink to="/admin/payments" className={({ isActive }) =>
          `${baseStyle} ${isActive ? "text-blue-600 bg-blue-50" : "text-gray-500"}`
        }>
          <FaMoneyBill size={20} />
          <span className="mt-1">Payments</span>
        </NavLink>

        

        {/* USERS */}
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `${baseStyle} ${
              isActive
              ? "text-blue-600 bg-blue-50 border-t-2 border-blue-600"
              : "text-gray-500"
            }`
          }
        >
          <FaUsers size={20} />
          <span className="mt-1">Users</span>
        </NavLink>

      </div>
    </div>
  );
}