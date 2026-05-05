import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminBottomNavBar from "../../components/admin/AdminBottomNavBar";

export default function AdminEventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace("/api", "")
    : "http://localhost:5000";

  // 🔥 FETCH EVENT
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get("/events/admin/dashboard");
        const found = res.data.find(e => e._id === id);
        setEvent(found);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // 🗑 DELETE EVENT
  const handleDelete = async () => {
    if (!confirm("Delete this event?")) return;

    try {
      await API.delete(`/events/${id}`);
      alert("Event deleted successfully");
      navigate("/admin");
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  // 🔄 CHANGE STATUS
  const handleStatusChange = async (newStatus) => {
    if (event.status === newStatus) return;

    if (!confirm(`Change status to "${newStatus}"?`)) return;

    try {
      setUpdating(true);

      await API.put(`/events/${id}`, {
        ...event,
        status: newStatus
      });

      setEvent(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.log(err);
      alert("Status update failed");
    } finally {
      setUpdating(false);
    }
  };

  // ⏳ LOADING UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminHeader />
        <div className="p-6">Loading event...</div>
        <AdminBottomNavBar />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminHeader />
        <div className="p-6 text-red-500">Event not found</div>
        <AdminBottomNavBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <AdminHeader />

      <div className="p-6 space-y-5">

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-gray-800">
          {event.title}
        </h1>

        {/* BASIC INFO */}
        <div className="bg-white p-4 rounded-xl shadow space-y-3">

          <p>📍 {event.location}</p>
          <p>📅 {event.date ? new Date(event.date).toLocaleDateString() : "No date"}</p>
          <p>👥 {event.totalPeople} people</p>

          <p className="text-green-600 font-semibold">
            ₹{event.totalCost}
          </p>

          {/* 🔄 STATUS */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Status:</span>

            <select
              value={event.status}
              disabled={updating}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`text-xs px-2 py-1 rounded outline-none ${
                event.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : event.status === "ongoing"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              <option value="pending">Pending</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 pt-2">

            <button
              onClick={() => navigate(`/admin/edit-event/${event._id}`)}
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
            >
              Delete
            </button>

          </div>
        </div>

        {/* 🖼️ IMAGES */}
        {event.images?.length > 0 && (
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-2">Images</h3>

            <div className="flex gap-3 overflow-x-auto">
              {event.images.map((img, i) => (
                <img
                  key={i}
                  src={`${BASE_URL}/uploads/${img}`}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        {/* 🍽️ MENU */}
        {event.menu?.length > 0 && (
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-2">Menu</h3>

            {event.menu.map((m, i) => (
              <div
                key={i}
                className="flex justify-between text-sm border-b py-1"
              >
                <span>{m.name}</span>
                <span>₹{m.price}</span>
              </div>
            ))}
          </div>
        )}

        {/* 📦 RENTAL ITEMS */}
        {event.rentalItems?.length > 0 && (
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-2">Rental Items</h3>

            <div className="space-y-3">
              {event.rentalItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 border p-2 rounded-lg"
                >
                  {item.image && (
                    <img
                      src={`${BASE_URL}/uploads/${item.image}`}
                      className="w-14 h-14 object-cover rounded"
                    />
                  )}

                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>

                    <div className="flex gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.deliveryStatus === "delivered"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        🚚 {item.deliveryStatus}
                      </span>

                      <span className={`text-xs px-2 py-1 rounded ${
                        item.returnStatus === "returned"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-200 text-gray-600"
                      }`}>
                        🔄 {item.returnStatus}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <AdminBottomNavBar />
      <div className="pb-20"></div>
    </div>
  );
}