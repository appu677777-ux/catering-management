import { useEffect, useState } from "react";
import API from "../../services/api";
import UserHeader from "../../components/user/UserHeader";

export default function UserDashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    API.get("/events/user/dashboard")
      .then(res => setEvents(res.data))
      .catch(err => console.log(err));
  }, []);

  // Total earnings
  const totalEarnings = events.reduce(
    (sum, e) => sum + (e.earning || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-100">

      <UserHeader />

      <div className="p-4 sm:p-6">

        {/* Earnings Summary */}
        <div className="bg-white shadow rounded-xl p-4 mb-5">
          <h2 className="text-gray-500">Total Earnings</h2>
          <p className="text-2xl font-bold text-green-600">
            ₹{totalEarnings}
          </p>
        </div>

        {/* Events */}
        <h2 className="text-xl font-semibold mb-4">
          My Work Events
        </h2>

        {events.length === 0 ? (
          <p className="text-gray-500">No events assigned</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {events.map(e => (
              <div
                key={e.eventId}
                className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-bold text-gray-800">
                  {e.title}
                </h3>

                <p className="text-gray-500 text-sm">📍 {e.location}</p>

                <p className="text-green-600 font-semibold mt-2">
                  ₹{e.earning}
                </p>

                <span className={`text-xs px-2 py-1 rounded ${
                  e.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}>
                  {e.status}
                </span>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}