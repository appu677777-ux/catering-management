import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminBottomNavBar from "../../components/admin/AdminBottomNavBar";
import API from "../../services/api";

export default function AdminPaymentPage() {
  const [users, setUsers] = useState([]);
  const [captains, setCaptains] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const [userRes, eventRes] = await Promise.all([
        API.get("/auth/users"),
        API.get("/events/admin/dashboard")
      ]);

      const allUsers = userRes.data;
      const events = eventRes.data;

      // 🔥 CALCULATE USER PAYMENTS
      const usersData = allUsers
        .filter(u => u.role === "user")
        .map(u => {
          let totalWorked = 0;
          let totalDue = 0;

          events.forEach(e => {
            const isAssigned = e.staff?.some(id =>
              (id._id ? id._id.toString() : id.toString()) === u._id.toString()
            );

            if (!isAssigned) return;

            const staff = e.costDistribution?.staff;

            const share = staff?.share || 0;
            const bonus = staff?.bonus || 0;
            const fine = staff?.fine || 0;
            const received = staff?.amountReceived || 0;

            const total = share + bonus - fine;
            const due = total - received;

            totalWorked += total;
            totalDue += due;
          });

          return {
            ...u,
            totalWorked,
            totalDue
          };
        });

      // 🔥 CALCULATE CAPTAIN PAYMENTS
      const captainsData = allUsers
        .filter(u => u.role === "captain")
        .map(u => {
          let totalWorked = 0;
          let totalDue = 0;

          events.forEach(e => {
            const isAssigned = e.captains?.some(id =>
              (id._id ? id._id.toString() : id.toString()) === u._id.toString()
            );

            if (!isAssigned) return;

            const captain = e.costDistribution?.captain;

            const share = captain?.share || 0;
            const bonus = captain?.bonus || 0;
            const fine = captain?.fine || 0;
            const received = captain?.amountReceived || 0;

            const total = share + bonus - fine;
            const due = total - received;

            totalWorked += total;
            totalDue += due;
          });

          return {
            ...u,
            totalWorked,
            totalDue
          };
        });

      setUsers(usersData);
      setCaptains(captainsData);

    } catch (err) {
      console.log(err);
    }
  };

  const renderTable = (title, data) => (
    <div className="bg-white rounded-xl shadow p-4 mb-6">

      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold">{title}</h2>

        
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-center">Total Worked</th>
              <th className="p-2 text-center">Total Due</th>
            </tr>
          </thead>

          <tbody>
            {data.map(u => (
              <tr
                key={u._id}
                onClick={() => navigate(`/admin/payments/${u._id}`)}
                className="border-b hover:bg-gray-50 cursor-pointer"
              >
                <td className="p-2">{u._id.slice(-5)}</td>
                <td className="p-2">{u.name}</td>

                <td className="p-2 text-center font-semibold text-green-600">
                  ₹{u.totalWorked}
                </td>

                <td className="p-2 text-center font-semibold text-red-500">
                  ₹{u.totalDue}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">

      <AdminHeader />

      <div className="p-4 pb-20">
        {renderTable("Users Payments", users)}
        {renderTable("Captains Payments", captains)}
      </div>

      <AdminBottomNavBar />
    </div>
  );
}