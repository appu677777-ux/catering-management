import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    location: "",
    totalPeople: "",
    totalCost: ""
  });

  const [loading, setLoading] = useState(true);

  // 🔄 Fetch event data
  useEffect(() => {
    API.get("/events/admin/dashboard")
      .then(res => {
        const event = res.data.find(e => e._id === id);
        if (event) {
          setForm({
            title: event.title || "",
            location: event.location || "",
            totalPeople: event.totalPeople || "",
            totalCost: event.totalCost || ""
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, [id]);

  // ✍️ Handle change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Update event
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/events/${id}`, form);
      alert("Event Updated ✅");
      navigate("/admin");
    } catch (err) {
      console.log(err);
      alert("Update failed ❌");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-xl">
        
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Edit Event ✏️
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="title"
            value={form.title}
            placeholder="Event Title"
            className="input"
            onChange={handleChange}
          />

          <input
            name="location"
            value={form.location}
            placeholder="Location"
            className="input"
            onChange={handleChange}
          />

          <input
            name="totalPeople"
            value={form.totalPeople}
            placeholder="Total People"
            className="input"
            onChange={handleChange}
          />

          <input
            name="totalCost"
            value={form.totalCost}
            placeholder="Total Cost"
            className="input"
            onChange={handleChange}
          />

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Update Event
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}