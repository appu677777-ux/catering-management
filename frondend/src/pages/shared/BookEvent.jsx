import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaClock,
  FaUsers
} from "react-icons/fa";

export default function BookEvent() {

  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [bookingId, setBookingId] = useState(null);

  // ✅ GET USER
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  useEffect(() => {
    fetchEvents();
  }, []);

  // 🔥 FETCH EVENTS
  const fetchEvents = async () => {
    try {

      const res = await API.get("/events/available");

      setEvents(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 BOOK EVENT
  const handleBook = async (eventId) => {
    try {

      setBookingId(eventId);

      await API.patch(`/events/${eventId}/book`);

      alert("Booked Successfully ✅");

      fetchEvents();

    } catch (err) {

      alert(
        err.response?.data?.error ||
        "Booking failed"
      );

    } finally {

      setBookingId(null);

    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-24">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">

        <button
          onClick={() => navigate(-1)}
          className="bg-white shadow p-2 rounded-lg"
        >
          <FaArrowLeft />
        </button>

        <h2 className="text-2xl font-bold">
          Available Events
        </h2>

      </div>

      {/* EMPTY */}
      {events.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
          No available events
        </div>

      ) : (

        <div className="space-y-4">

          {events.map(event => {

            const captainRemaining =
              (event.slotCount?.captainSlot || 0) -
              (event.captains?.length || 0);

            const staffRemaining =
              (event.slotCount?.staffSlot || 0) -
              (event.staff?.length || 0);

            return (

              <div
                key={event._id}
                className="bg-white rounded-2xl shadow p-5"
              >

                {/* TOP */}
                <div className="flex justify-between gap-4">

                  {/* LEFT */}
                  <div className="flex-1">

                    {/* TITLE */}
                    <h3 className="text-lg font-bold text-gray-800">
                      {event.title}
                    </h3>

                    {/* LOCATION */}
                    <div className="flex items-center gap-2 text-gray-500 mt-2 text-sm">
                      <FaMapMarkerAlt />
                      <span>{event.location}</span>
                    </div>

                    {/* DATE */}
                    <div className="flex items-center gap-2 text-gray-500 mt-2 text-sm">
                      <FaClock />
                      <span>
                        {
                          new Date(event.date)
                            .toLocaleDateString()
                        }
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mt-2">

                      ⏰{" "}

                      {event.time?.start
                        ? `${event.time.start} - ${event.time.end}`
                        : "Time not added"}

                    </p>

                    {/* EVENT TYPE */}
                    <p className="text-sm text-gray-500 mt-1">
                      🎉 Type:
                      {" "}
                      {event.type}
                    </p>

                    {/* TOTAL PEOPLE */}
                    <p className="text-sm text-gray-500 mt-1">
                      👥 Guests:
                      {" "}
                      {event.totalPeople}
                    </p>

                  </div>

                  {/* RIGHT SLOT INFO */}
                  <div className="text-right">

                    {/* CAPTAIN */}
                    {role === "captain" &&
                      captainRemaining < 5 && (
                        <div className="flex items-center justify-end gap-2 text-sm text-blue-600">

                          <FaUsers />

                          <span>
                            Only{" "}
                            {captainRemaining}
                            {" "}
                            Slots Left
                          </span>

                        </div>
                      )}

                    {/* STAFF */}
                    {role === "user" &&
                      staffRemaining < 5 && (
                        <div className="flex items-center justify-end gap-2 text-sm text-green-600">

                          <FaUsers />

                          <span>
                            Only{" "}
                            {staffRemaining}
                            {" "}
                            Slots Left
                          </span>

                        </div>
                      )}

                  </div>

                </div>



                {/* BOOK BUTTON */}
                <button
                  onClick={() =>
                    handleBook(event._id)
                  }
                  disabled={bookingId === event._id}
                  className="mt-5 w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {bookingId === event._id
                    ? "Booking..."
                    : "Book Event"}
                </button>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}