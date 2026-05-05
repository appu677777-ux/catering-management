import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function AdminEventCard({ event, onDelete }) {
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);

    const BASE_URL = import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace("/api", "")
        : "https://catering-management-1.onrender.com/api";

    return (
        <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition">

            {event.images?.length > 0 && (
                <div className="relative">

                    {/* IMAGE */}
                    <img
                        src={`${BASE_URL}/uploads/${event.images[index]}`}
                        className="w-full h-40 object-cover transition-all duration-300"
                    />

                    {/* LEFT BUTTON */}
                    {event.images.length > 1 && (
                        <button
                            onClick={() =>
                                setIndex((prev) =>
                                    prev === 0 ? event.images.length - 1 : prev - 1
                                )
                            }
                            className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 backdrop-blur text-white p-2 rounded-full hover:bg-black transition"
                        >
                            <FaChevronLeft size={16} />
                        </button>
                    )}

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

                    {/* DOT INDICATOR */}
                    {event.images.length > 1 && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            {event.images.map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${i === index ? "bg-white" : "bg-gray-400"
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                </div>
            )}

            <div className="p-5">
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

                <p className="text-green-600 font-semibold mt-2">
                    ₹{event.totalCost}
                </p>

                {/* 👨‍✈️ CAPTAINS */}
                <div className="mt-2 text-sm">
                    <p className="font-semibold">Captains:</p>
                    <div className="flex flex-wrap gap-1">
                        {event.captains?.map(c => (
                            <span
                                key={c._id}
                                className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                            >
                                {c.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 👷 STAFF */}
                <div className="mt-2 text-sm">
                    <p className="font-semibold">Staff:</p>
                    <div className="flex flex-wrap gap-1">
                        {event.staff?.map(s => (
                            <span
                                key={s._id}
                                className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs"
                            >
                                {s.name}
                            </span>
                        ))}
                    </div>
                </div>

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
                                    <span className="text-green-600">₹{item.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 📦 RENTAL ITEMS */}
                {event.rentalItems && event.rentalItems.length > 0 && (
                    <div className="mt-4">
                        <p className="font-semibold text-sm mb-2">Rental Items:</p>

                        <div className="space-y-2">
                            {event.rentalItems.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border"
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

                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800">
                                            {item.name}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            Qty: {item.quantity}
                                        </p>

                                        {/* 🚚 DELIVERY STATUS */}
                                        <div className="flex gap-2 mt-1 flex-wrap">

                                            <span className={`text-xs px-2 py-1 rounded ${item.deliveryStatus === "delivered"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                }`}>
                                                🚚 {item.deliveryStatus}
                                            </span>

                                            {/* 🔄 RETURN STATUS */}
                                            <span className={`text-xs px-2 py-1 rounded ${item.returnStatus === "returned"
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

                {/* STATUS */}
                <span className={`text-xs px-2 py-1 rounded mt-2 inline-block ${event.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                    }`}>
                    {event.status}
                </span>

                {/* ACTIONS */}
                <div className="flex gap-2 mt-4">
                    <button
                        onClick={() => navigate(`/admin/edit-event/${event._id}`)}
                        className="flex-1 bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => onDelete(event._id)}
                        className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}