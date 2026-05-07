import { NavLink } from "react-router-dom";
import {
  FaCalendarAlt,
  FaClipboardList
} from "react-icons/fa";

export default function UserBottomNavBar() {

  const baseStyle =
    "flex flex-col items-center justify-center flex-1 py-2 text-xs transition-all duration-200";

  const activeStyle =
    "text-blue-600 bg-blue-50 border-t-2 border-blue-600";

  const inactiveStyle =
    "text-gray-500";

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md z-50">

      <div className="flex">

        {/* EVENTS */}
        <NavLink
          to="/user"
          className={({ isActive }) =>
            `${baseStyle} ${
              isActive ? activeStyle : inactiveStyle
            }`
          }
        >
          <FaCalendarAlt size={20} />
          <span className="mt-1">Events</span>
        </NavLink>

        {/* BOOK EVENTS */}
        <NavLink
          to="/user/book-events"
          className={({ isActive }) =>
            `${baseStyle} ${
              isActive ? activeStyle : inactiveStyle
            }`
          }
        >
          <FaClipboardList size={20} />
          <span className="mt-1">Booking</span>
        </NavLink>

      </div>
    </div>
  );
}