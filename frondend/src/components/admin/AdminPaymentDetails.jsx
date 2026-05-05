import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import AdminHeader from "../admin/AdminHeader";
import AdminBottomNavBar from "../admin/AdminBottomNavBar";

export default function AdminPaymentDetails() {
  const { id } = useParams();

  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  // 🔥 FETCH EVENTS
  const fetchEvents = async () => {
    try {


      const res = await API.get("/events/admin/dashboard");

      const mapped = res.data
        .filter(e =>
          e.staff?.some(s =>
            (s._id || s).toString() === id.toString()
          ) ||
          e.captains?.some(c =>
            (c._id || c).toString() === id.toString()
          )
        )
        .map(e => {
          const isStaff = e.staff?.some(s =>
            (s._id || s).toString() === id.toString()
          );

          const roleData = isStaff
            ? e.costDistribution?.staff
            : e.costDistribution?.captain;


          return {
            eventId: e._id,
            eventName: e.title,

            userId: id, // 👈 ADD THIS
            role: isStaff ? "staff" : "captain", // 👈 ADD THIS

            payment: roleData?.share || 0,
            bonus: roleData?.bonus || 0,
            fines: roleData?.fine || 0,
            received: roleData?.amountReceived || 0,

            total:
              (roleData?.share || 0) +
              (roleData?.bonus || 0) -
              (roleData?.fine || 0),

            due: roleData?.due || 0
          };
        });

      setRows(mapped);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔄 EDIT + UPDATE BACKEND
  const handleEdit = async (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = Number(value);

    const row = updated[index];

    // 🔥 CALCULATE
    row.total = row.payment + row.bonus - row.fines;
    row.due = row.total - row.received;

    setRows(updated);

    // 🔥 UPDATE DB
    try {

      await API.put(`/events/${row.eventId}/payment`, {
        [row.role]: {
          share: row.payment,
          bonus: row.bonus,
          fine: row.fines,
          amountReceived: row.received,
          due: row.due
        }
      });

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />

      <div className="p-4 pb-20">
        <h2 className="text-xl font-bold mb-4">
          Payment Details
        </h2>

        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Event</th>
                <th className="p-2">Payment</th>
                <th className="p-2">Bonus</th>
                <th className="p-2">Fines</th>
                <th className="p-2">Received</th>
                <th className="p-2">Total</th>
                <th className="p-2">Due</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b">

                  {/* EVENT */}
                  <td className="p-2 font-medium">
                    {row.eventName}
                  </td>

                  {/* PAYMENT */}
                  <td className="p-2">
                    <input
                      type="number"
                      value={row.payment}
                      onChange={(e) =>
                        handleEdit(i, "payment", e.target.value)
                      }
                      className="input"
                    />
                  </td>

                  {/* BONUS */}
                  <td className="p-2">
                    <input
                      type="number"
                      value={row.bonus}
                      onChange={(e) =>
                        handleEdit(i, "bonus", e.target.value)
                      }
                      className="input"
                    />
                  </td>

                  {/* FINES */}
                  <td className="p-2">
                    <input
                      type="number"
                      value={row.fines}
                      onChange={(e) =>
                        handleEdit(i, "fines", e.target.value)
                      }
                      className="input"
                    />
                  </td>

                  {/* RECEIVED */}
                  <td className="p-2">
                    <input
                      type="number"
                      value={row.received}
                      onChange={(e) =>
                        handleEdit(i, "received", e.target.value)
                      }
                      className="input"
                    />
                  </td>

                  {/* TOTAL */}
                  <td className="p-2 text-center font-semibold">
                    ₹{row.total}
                  </td>

                  {/* DUE */}
                  <td className="p-2 text-center text-red-500 font-semibold">
                    ₹{row.due}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      <AdminBottomNavBar />
    </div>
  );
}