import { useEffect, useState } from "react";
import API from "../../services/api";
import CaptainHeader from "../../components/captain/CaptainHeader";
import CaptainBottomNavbar from "../../components/captain/CaptainBottomNavBar";
import CaptainEventCard from "../../components/captain/CaptainEventCard";

export default function CaptainDashboard() {
  const [events, setEvents] = useState([]);

  const updateDelivery = async (eventId, index) => {
    try {
      await API.patch(`/events/${eventId}/delivery`, { index });
      fetchEvents(); // refresh UI
    } catch (err) {
      console.log(err);
    }
  };

  const updateReturn = async (eventId, index) => {
    try {
      await API.patch(`/events/${eventId}/return`, { index });
      fetchEvents();
    } catch (err) {
      console.log(err);
    }
  };
  const fetchEvents = async () => {
    try {
      const res = await API.get("/events/captain/dashboard");
      setEvents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <CaptainHeader />

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map(e => (
            <CaptainEventCard
              key={e._id}
              event={e}
              updateDelivery={updateDelivery}
              updateReturn={updateReturn}
            />
          ))}
        </div>
      </div>
      <CaptainBottomNavbar/>
      <div className="p-6 pb-20"></div>
    </div>
  );
}