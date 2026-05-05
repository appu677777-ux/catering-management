import { useEffect, useState, useContext } from "react";
import CaptainHeader from "../../components/captain/CaptainHeader";
import CaptainBottomNavBar from "../../components/captain/CaptainBottomNavBar";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

export default function CaptainPaymentPage() {
  const { user } = useContext(AuthContext);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await API.get("/events/captain/dashboard");

      const mapped = res.data.map(e => {
        const captain = e.costDistribution?.captain;

        const share = captain?.share || 0;
        const bonus = captain?.bonus || 0;
        const fine = captain?.fine || 0;
        const received = captain?.amountReceived || 0;

        const total = share + bonus - fine;
        const due = total - received;

        return {
          eventName: e.title,
          payment: share,
          bonus,
          fines: fine,
          received,
          total,
          due
        };
      });

      setRows(mapped);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <CaptainHeader />

      <div className="p-4 pb-20">

        {/* CARD */}
        <div className="bg-white rounded-xl shadow p-4">

          <h2 className="font-semibold mb-3">
            My Payments
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Event</th>
                  <th className="p-2 text-center">Payment</th>
                  <th className="p-2 text-center">Bonus</th>
                  <th className="p-2 text-center">Fines</th>
                  <th className="p-2 text-center">Received</th>
                  <th className="p-2 text-center">Total</th>
                  <th className="p-2 text-center">Due</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">

                    <td className="p-2">{row.eventName}</td>

                    <td className="p-2 text-center">₹{row.payment}</td>
                    <td className="p-2 text-center">₹{row.bonus}</td>
                    <td className="p-2 text-center">₹{row.fines}</td>
                    <td className="p-2 text-center">₹{row.received}</td>

                    <td className="p-2 text-center font-semibold text-green-600">
                      ₹{row.total}
                    </td>

                    <td className="p-2 text-center font-semibold text-red-500">
                      ₹{row.due}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>

      </div>

      <CaptainBottomNavBar />
      <div className="p-6 pb-20"></div>
    </div>
  );
}