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
    totalCost: "",
    status: "pending",

    // ✅ DATE
    date: "",

    // ✅ TIME
    startTime: "",
    endTime: "",

    // ✅ SLOTS
    captainSlot: "",
    staffSlot: ""
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

            totalCost: event.totalCost || "",

            status: event.status || "pending",

            // ✅ DATE
            date: event.date
              ? new Date(event.date)
                .toISOString()
                .split("T")[0]
              : "",

            // ✅ TIME
            startTime: event.time?.start || "",

            endTime: event.time?.end || "",

            // ✅ SLOT
            captainSlot:
              event.slotCount?.captainSlot || "",

            staffSlot:
              event.slotCount?.staffSlot || ""
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
      await API.put(`/events/${id}`, {

        title: form.title,

        location: form.location,

        totalPeople: Number(form.totalPeople),

        totalCost: Number(form.totalCost),

        status: form.status,

        // ✅ DATE
        date: form.date,

        // ✅ TIME
        time: {
          start: form.startTime,
          end: form.endTime
        },

        // ✅ SLOT COUNT
        slotCount: {
          captainSlot: Number(form.captainSlot),
          staffSlot: Number(form.staffSlot)
        }

      });
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
          <input
            type="date"
            name="date"
            value={form.date}
            className="input"
            onChange={handleChange}
          />
          <div className="grid grid-cols-2 gap-4">

            {/* START */}
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              className="input"
              onChange={handleChange}
            />

            {/* END */}
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              className="input"
              onChange={handleChange}
            />

          </div>

          <div className="grid grid-cols-2 gap-4">

            {/* CAPTAIN SLOT */}
            <input
              type="number"
              name="captainSlot"
              value={form.captainSlot}
              placeholder="Captain Slots"
              className="input"
              onChange={handleChange}
            />

            {/* STAFF SLOT */}
            <input
              type="number"
              name="staffSlot"
              value={form.staffSlot}
              placeholder="Staff Slots"
              className="input"
              onChange={handleChange}
            />

          </div>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className={`w-full border border-gray-300 p-3 rounded-lg focus:outline-none ${form.status === "pending"
              ? "bg-yellow-100"
              : form.status === "ongoing"
                ? "bg-blue-100"
                : "bg-green-100"
              }`}
          >
            <option value="pending">Pending</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>

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