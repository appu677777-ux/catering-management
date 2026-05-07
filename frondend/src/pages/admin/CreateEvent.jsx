import { useState, useEffect } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    type: "marriage",
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    totalPeople: "",
    totalCost: "",
    captainSlot: "",
    staffSlot: "",
    captains: [],
    staff: [],
    menu: [{ name: "", price: "" }]
  });

  const [rentalItems, setRentalItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);

  // fetch users
  useEffect(() => {
    API.get("/auth/users")
      .then(res => setUsers(res.data))
      .catch(console.error);
  }, []);

  // input change
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // menu change
  const handleMenuChange = (index, field, value) => {
    const updated = [...form.menu];
    updated[index][field] = value;
    setForm(prev => ({ ...prev, menu: updated }));
  };

  // add menu
  const addMenuItem = () => {
    setForm(prev => ({
      ...prev,
      menu: [...prev.menu, { name: "", price: "" }]
    }));
  };

  // add rental item
  const addItem = () => {
    setRentalItems(prev => [
      ...prev,
      { name: "", quantity: 1, image: null }
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // =====================
      // BASIC DATA
      // =====================
      formData.append("date", form.date);
      formData.append("startTime", form.startTime);
      formData.append("endTime", form.endTime);
      formData.append("title", form.title);
      formData.append("type", form.type);
      formData.append("location", form.location);
      formData.append("totalPeople", Number(form.totalPeople));
      formData.append("totalCost", Number(form.totalCost));
      formData.append("captainSlot", form.captainSlot);
      formData.append("staffSlot", form.staffSlot);

      // =====================
      // MENU
      // =====================
      formData.append("menu", JSON.stringify(form.menu));

      // =====================
      // RENTAL ITEMS (NO IMAGE HERE)
      // =====================
      formData.append("rentalItems", JSON.stringify(rentalItems));

      // =====================
      // CAPTAINS & STAFF
      // =====================
      form.captains.forEach(id => formData.append("captains", id));
      form.staff.forEach(id => formData.append("staff", id));

      // =====================
      // EVENT IMAGES
      // =====================
      files.forEach(file => {
        formData.append("eventImages", file);
      });

      // =====================
      // RENTAL IMAGES
      // =====================
      rentalItems.forEach(item => {
        if (item.image) {
          formData.append("rentalImages", item.image);
        }
      });

      // =====================
      // API CALL
      // =====================
      await API.post("/events", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Event Created ✅");
      navigate("/admin");

    } catch (err) {
      console.error(err);
      alert("Error creating event ❌");
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* DATE */}
            <div>
              <label className="block text-sm mb-1">
                Event Date
              </label>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* START */}
            <div>
              <label className="block text-sm mb-1">
                Start Time
              </label>

              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* END */}
            <div>
              <label className="block text-sm mb-1">
                End Time
              </label>

              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">

            {/* CAPTAIN SLOT */}
            <div>
              <label className="block text-sm mb-1">
                Captain Slots
              </label>

              <input
                type="number"
                name="captainSlot"
                value={form.captainSlot}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter captain slots"
              />
            </div>

            {/* STAFF SLOT */}
            <div>
              <label className="block text-sm mb-1">
                Staff Slots
              </label>

              <input
                type="number"
                name="staffSlot"
                value={form.staffSlot}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter staff slots"
              />
            </div>

          </div>

          {/* Captains */}
          <div>
            <h4 className="font-semibold mb-2">Select Captains</h4>
            <p className="text-sm text-gray-500 mb-2">
              {form.captains.length} / {form.captainSlot || 0} selected
            </p>
            <div className="grid grid-cols-2 gap-2">
              {users.filter(u => u.role === "captain").map(u => (
                <label key={u._id} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                  <input
                    type="checkbox"
                    onChange={(e) => {

                      // ✅ ADD
                      if (
                        e.target.checked &&
                        form.captains.length >= Number(form.captainSlot || 0)
                      ) {
                        alert("Captain slot limit reached");
                        return;
                      }

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
            <p className="text-sm text-gray-500 mb-2">
              {form.staff.length} / {form.staffSlot || 0} selected
            </p>
            <div className="grid grid-cols-2 gap-2">
              {users.filter(u => u.role === "user").map(u => (
                <label key={u._id} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                  <input
                    type="checkbox"
                    onChange={(e) => {

                      // ✅ ADD
                      if (
                        e.target.checked &&
                        form.staff.length >= Number(form.staffSlot || 0)
                      ) {
                        alert("Staff slot limit reached");
                        return;
                      }

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
            {/* 📸 IMAGE UPLOAD */}
            <div>
              <h4 className="font-semibold mb-2">Event Images</h4>

              {/* Hidden Input */}
              <input
                type="file"
                id="imageUpload"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const selected = [...e.target.files];
                  setFiles((prev) => [...prev, ...selected]); // append
                }}
              />



              {/* Add Button */}
              <label
                htmlFor="imageUpload"
                className="inline-block cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                + Add Images
              </label>

              {/* Preview Row */}
              {files.length > 0 && (
                <div className="flex gap-3 mt-4 overflow-x-auto">
                  {files.map((file, i) => (
                    <div key={i} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        className="w-24 h-24 object-cover rounded-lg"
                      />

                      {/* ❌ Remove Button */}
                      <button
                        type="button"
                        onClick={() =>
                          setFiles(files.filter((_, index) => index !== i))
                        }
                        className="absolute top-1 right-1 bg-black text-white text-xs px-1 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={addMenuItem}
              className="text-blue-600 text-sm"
            >
              + Add Item
            </button>
          </div>


          {/* ================= RENTAL ITEMS ================= */}
          <div>
            <h4 className="font-semibold mb-3">Rental Items</h4>

            {rentalItems.map((item, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row items-start gap-4 border p-3 rounded-lg mb-3 bg-gray-50"
              >

                {/* LEFT SIDE - IMAGE */}
                <div className="w-full md:w-32">
                  {item.image ? (
                    <img
                      src={URL.createObjectURL(item.image)}
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="w-32 h-32 flex items-center justify-center border rounded-lg text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* RIGHT SIDE - INPUTS */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">

                  <input
                    placeholder="Item name"
                    className="input"
                    value={item.name}
                    onChange={(e) => {
                      const updated = [...rentalItems];
                      updated[i].name = e.target.value;
                      setRentalItems(updated);
                    }}
                  />

                  <input
                    type="number"
                    placeholder="Quantity"
                    className="input"
                    value={item.quantity}
                    onChange={(e) => {
                      const updated = [...rentalItems];
                      updated[i].quantity = e.target.value;
                      setRentalItems(updated);
                    }}
                  />

                  {/* FILE INPUT */}
                  <input
                    type="file"
                    accept="image/*"
                    className="col-span-2"
                    onChange={(e) => {
                      const updated = [...rentalItems];
                      updated[i].image = e.target.files[0];
                      setRentalItems(updated);
                    }}
                  />

                </div>
              </div>
            ))}

            {/* ADD BUTTON */}
            <button
              type="button"
              onClick={addItem}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              + Add Rental Item
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
