import { useEffect, useState } from "react";
import API from "../../services/api";
import UserHeader from "../../components/user/UserHeader";
import UserEventCard from "../../components/user/UserEventCard";

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
              <UserEventCard key={e.eventId || e._id} event={e} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}