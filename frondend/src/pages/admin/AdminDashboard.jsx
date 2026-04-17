import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import AdminHeader from "../../components/admin/AdminHeader";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
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

  return (
    <div className="min-h-screen bg-gray-100">

      <AdminHeader/>

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

      {/* 📋 Event List */}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">All Events</h2>

        {events.length === 0 ? (
          <p className="text-gray-500">No events available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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

                <p className="text-green-600 font-semibold mt-2">
                  ₹{e.totalCost}
                </p>

                <span className={`text-xs px-2 py-1 rounded ${
                  e.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}>
                  {e.status}
                </span>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/admin/edit-event/${e._id}`)}
                    className="flex-1 bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(e._id)}
                    className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}