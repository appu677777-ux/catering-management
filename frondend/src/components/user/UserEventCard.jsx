import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function UserEventCard({ event }) {
  const [index, setIndex] = useState(0);

  const BASE_URL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace("/api", "")
    //: "http://localhost:5000";
      : "https://catering-management-1.onrender.com";

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition">

      {/* 🖼️ IMAGE SLIDER */}
      {event.images?.length > 0 && (
        <div className="relative">
          <img
            src={`${BASE_URL}/uploads/${event.images[index]}`}
            className="w-full h-40 object-cover"
          />

          {event.images.length > 1 && (
            <>
              {/* LEFT */}
              <button
                onClick={() =>
                  setIndex(prev =>
                    prev === 0 ? event.images.length - 1 : prev - 1
                  )
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
              >
                <FaChevronLeft />
              </button>

              {/* RIGHT */}
              <button
                onClick={() =>
                  setIndex(prev =>
                    prev === event.images.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
              >
                <FaChevronRight />
              </button>
            </>
          )}
        </div>
      )}

      <div className="p-5">
        {/* TITLE */}
        <h3 className="text-lg font-bold text-gray-800">
          {event.title}
        </h3>

        {/* LOCATION */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 "
        >
          📍 {event.location}
        </a>

        {/* 💰 EARNINGS */}
        <p className="text-green-600 font-semibold mt-2">
          ₹{event.earning || 0}
        </p>

        {/* DATE */}
        <p className="text-sm text-gray-500 mt-2">
          📅{" "}
          {
            new Date(event.date)
              .toLocaleDateString()
          }
        </p>

        {/* TIME */}
        <p className="text-sm text-gray-500 mt-1">

          ⏰{" "}

          {event.time?.start
            ? `${event.time.start} - ${event.time.end}`
            : "Time not added"}

        </p>


      </div>
    </div>
  );
}