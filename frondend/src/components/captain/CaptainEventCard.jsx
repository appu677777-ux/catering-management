import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function CaptainEventCard({ event, updateDelivery, updateReturn }) {
  const [index, setIndex] = useState(0);

  const BASE_URL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace("/api", "")
    : "http://localhost:5000";



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

      <div className="p-5 space-y-3">

        {/* HEADER */}
        <h3 className="text-lg font-bold text-gray-800">
          {event.title}
        </h3>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 "
        >
          📍 {event.location}
        </a>
        <p className="text-sm">👥 {event.totalPeople} people</p>

        {/* EARNINGS */}
        <p className="text-gray-600 font-semibold">
          Payment: ₹{event.earnings?.perCaptain || 0}
        </p>

        

        {/* 🍽️ MENU */}
        {event.menu && event.menu.length > 0 && (
          <div className="mt-3 text-sm">
            <p className="font-semibold">Menu:</p>

            <div className="max-h-24 overflow-y-auto space-y-1 mt-1">
              {event.menu.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between bg-gray-100 px-2 py-1 rounded text-xs"
                >
                  <span>{item.name}</span>
                  
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 📦 RENTAL ITEMS */}
        {event.rentalItems?.length > 0 && (
          <div className="mt-3">
            <p className="font-semibold text-sm mb-2">Rental Items</p>

            <div className="space-y-3">
              {event.rentalItems.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-3 items-center bg-gray-50 p-2 rounded-lg border"
                >

                  {/* IMAGE */}
                  <div className="w-14 h-14 flex-shrink-0">
                    {item.image ? (
                      <img
                        src={`${BASE_URL}/uploads/${item.image}`}
                        className="w-14 h-14 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gray-200 flex items-center justify-center text-xs rounded-md">
                        No Img
                      </div>
                    )}
                  </div>



                  {/* DETAILS */}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {item.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>

                    {/* STATUS BADGES */}
                    <div className="flex gap-2 mt-1 flex-wrap">

                      <span className={`text-xs px-2 py-1 rounded ${item.deliveryStatus === "delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                        }`}>
                        🚚 {item.deliveryStatus}
                      </span>

                      <span className={`text-xs px-2 py-1 rounded ${item.returnStatus === "returned"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-200 text-gray-600"
                        }`}>
                        🔄 {item.returnStatus}
                      </span>

                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex flex-col gap-1">

                    {item.deliveryStatus !== "delivered" && (
                      <button
                        onClick={() => updateDelivery(event._id, i)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                      >
                        Deliver
                      </button>
                    )}

                    {item.returnStatus !== "returned" && (
                      <button
                        onClick={() => updateReturn(event._id, i)}
                        className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                      >
                        Return
                      </button>
                    )}

                  </div>


                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}