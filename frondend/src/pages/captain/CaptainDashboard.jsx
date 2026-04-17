import { useEffect, useState } from "react";
import API from "../../services/api";
import CaptainHeader from "../../components/captain/CaptainHeader";

export default function CaptainDashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    API.get("/events/captain/dashboard")
      .then(res => setEvents(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      <CaptainHeader />

      {/* Content */}
      <div className="p-4 sm:p-6">

        <h2 className="text-xl font-semibold mb-4">
          My Assigned Events
        </h2>

        {events.length === 0 ? (
          <p className="text-gray-500">No events assigned</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {events.map(e => (
              <div
                key={e._id}
                className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-bold text-gray-800">
                  {e.title}
                </h3>

                <p className="text-gray-500 text-sm">📍 {e.location}</p>
                <p className="text-sm">👥 {e.totalPeople} people</p>

                <p className="text-blue-600 font-semibold mt-2">
                  Captain Earnings: ₹{e.earnings?.perCaptain || 0}
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