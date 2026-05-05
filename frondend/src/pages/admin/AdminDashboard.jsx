import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminEventCard from "../../components/admin/AdminEventCard";
import AdminBottomNavBar from "../../components/admin/AdminBottomNavBar";
import AdminEventDetails from "../admin/AdminEventDetails";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const pendingEvents = events.filter(e => e.status === "pending");
  const ongoingEvents = events.filter(e => e.status === "ongoing");
  const completedEvents = events.filter(e => e.status === "completed");
  const navigate = useNavigate();

  const fetchEvents = () => {
    API.get("/events/admin/dashboard")
      .then(res => setEvents(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;

    try {
      await API.delete(`/events/${id}`);
      fetchEvents();
    } catch (err) {
      console.log(err);
    }
  };
  const renderSection = (title, data, color) => (
    <div className="mb-8">
      <h2 className={`text-xl font-bold mb-4 ${color}`}>
        {title} ({data.length})
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-400">No events</p>
      ) : (
        <div className="divide-y bg-white rounded-xl shadow">
          {data.map(e => (
            <button
              key={e._id}
              onClick={() => navigate(`/admin/event/${e._id}`)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition text-left"
            >
              {/* LEFT: name + (optional) location */}
              <div className="min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {e.title}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {e.location || ""}
                </p>
              </div>

              {/* RIGHT: date + status */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  {e.date
                    ? new Date(e.date).toLocaleDateString()
                    : "No date"}
                </span>

                <span
                  className={`text-[10px] px-2 py-1 rounded ${e.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : e.status === "ongoing"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                >
                  {e.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">

      <AdminHeader />

      {/* 📊 Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-gray-500">Total Events</h2>
          <p className="text-2xl font-bold">{events.length}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-gray-500">Total Revenue</h2>
          <p className="text-2xl font-bold text-green-600">
            ₹{events.reduce((sum, e) => sum + (e.totalCost || 0), 0)}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-gray-500">Pending Events</h2>
          <p className="text-2xl font-bold text-yellow-500">
            {events.filter(e => e.status === "pending").length}
          </p>
        </div>
      </div>

      <div className="p-6">

        {renderSection("Pending Events", pendingEvents, "text-yellow-600")}

        {renderSection("Ongoing Events", ongoingEvents, "text-blue-600")}

        {renderSection("Completed Events", completedEvents, "text-green-600")}

      </div>
      <AdminBottomNavBar />
      <div className="p-6 pb-20"></div>
    </div>
  );
}