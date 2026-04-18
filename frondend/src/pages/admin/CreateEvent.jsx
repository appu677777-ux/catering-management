import { useState, useEffect } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    type: "marriage",
    location: "",
    totalPeople: "",
    totalCost: "",
    captains: [],
    staff: [],
    menu: [{ name: "", price: "" }]
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get("/auth/users")
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMenuChange = (index, field, value) => {
    const updatedMenu = [...form.menu];
    updatedMenu[index][field] = value;
    setForm({ ...form, menu: updatedMenu });
  };

  const addMenuItem = () => {
    setForm({
      ...form,
      menu: [...form.menu, { name: "", price: "" }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/events", form);
      alert("Event Created!");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Error creating event");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-3xl">

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Create Event 🎉
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="title"
              placeholder="Event Title"
              className="input"
              onChange={handleChange}
            />

            <input
              name="location"
              placeholder="Location"
              className="input"
              onChange={handleChange}
            />

            <input
              name="totalPeople"
              placeholder="Total People"
              className="input"
              onChange={handleChange}
            />

            <input
              name="totalCost"
              placeholder="Total Cost"
              className="input"
              onChange={handleChange}
            />
          </div>

          {/* Captains */}
          <div>
            <h4 className="font-semibold mb-2">Select Captains</h4>
            <div className="grid grid-cols-2 gap-2">
              {users.filter(u => u.role === "captain").map(u => (
                <label key={u._id} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      setForm({
                        ...form,
                        captains: e.target.checked
                          ? [...form.captains, u._id]
                          : form.captains.filter(id => id !== u._id)
                      });
                    }}
                  />
                  {u.name}
                </label>
              ))}
            </div>
          </div>

          {/* Staff */}
          <div>
            <h4 className="font-semibold mb-2">Select Staff</h4>
            <div className="grid grid-cols-2 gap-2">
              {users.filter(u => u.role === "user").map(u => (
                <label key={u._id} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      setForm({
                        ...form,
                        staff: e.target.checked
                          ? [...form.staff, u._id]
                          : form.staff.filter(id => id !== u._id)
                      });
                    }}
                  />
                  {u.name}
                </label>
              ))}
            </div>
          </div>

          {/* Menu */}
          <div>
            <h4 className="font-semibold mb-2">Menu</h4>

            {form.menu.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  placeholder="Item Name"
                  className="input"
                  onChange={(e) =>
                    handleMenuChange(index, "name", e.target.value)
                  }
                />
                <input
                  placeholder="Price"
                  className="input"
                  onChange={(e) =>
                    handleMenuChange(index, "price", e.target.value)
                  }
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addMenuItem}
              className="text-blue-600 text-sm"
            >
              + Add Item
            </button>
          </div>

          {/* Submit */}
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}
