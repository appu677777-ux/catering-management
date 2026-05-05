import { useEffect, useMemo, useState } from "react";
import API from "../../services/api";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminBottomNavBar from "../../components/admin/AdminBottomNavBar";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("all"); // all | user | captain | admin
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [actingId, setActingId] = useState(null); // for per-row loading

    // 🔐 get current user id (from your auth middleware payload)
    const token = localStorage.getItem("token");
    const currentUserId = useMemo(() => {
        try {
            if (!token) return null;
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload?.id;
        } catch {
            return null;
        }
    }, [token]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await API.get("/auth/users");
            setUsers(res.data || []);
        } catch (err) {
            console.log(err);
            alert("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        let data = users;

        // ❌ remove admins
        data = data.filter((u) => u.role !== "admin");

        // filter by role
        if (filter !== "all") {
            data = data.filter((u) => u.role === filter);
        }

        // search
        if (search.trim()) {
            const q = search.toLowerCase();
            data = data.filter(
                (u) =>
                    u.name?.toLowerCase().includes(q) ||
                    u.email?.toLowerCase().includes(q)
            );
        }

        return data;
    }, [users, filter, search]);

    // 🔄 change role
    const changeRole = async (id, role) => {
        try {
            setActingId(id);
            await API.patch(`/auth/users/${id}/role`, { role });
            setUsers((prev) =>
                prev.map((u) => (u._id === id ? { ...u, role } : u))
            );
        } catch (err) {
            console.log(err);
            alert("Failed to update role");
        } finally {
            setActingId(null);
        }
    };

    // ❌ delete user
    const deleteUser = async (id) => {
        if (id === currentUserId) {
            alert("You cannot delete yourself");
            return;
        }

        if (!confirm("Delete this user?")) return;

        try {
            setActingId(id);
            await API.delete(`/auth/users/${id}`);
            setUsers((prev) => prev.filter((u) => u._id !== id));
        } catch (err) {
            console.log(err);
            alert("Failed to delete user");
        } finally {
            setActingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            <AdminHeader />

            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                    <h2 className="text-xl font-bold">User Management</h2>

                    <div className="flex gap-2">
                        {/* 🔍 Search */}
                        <input
                            type="text"
                            placeholder="Search name/email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border rounded px-3 py-1 text-sm"
                        />

                        {/* 🎛️ Filter */}
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="border rounded px-2 py-1 text-sm"
                        >
                            <option value="all">All</option>
                            <option value="user">Users</option>
                            <option value="captain">Captains</option>
                        </select>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <p className="text-gray-500">Loading users...</p>
                ) : filteredUsers.length === 0 ? (
                    <p className="text-gray-500">No users found</p>
                ) : (
                    <div className="grid gap-4">
                        {filteredUsers.map((u) => (
                            <div
                                key={u._id}
                                className="bg-white p-4 rounded-xl shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                            >
                                {/* 👤 Info */}
                                <div>
                                    <p className="font-semibold">{u.name}</p>
                                    <p className="text-sm text-gray-500">{u.email}</p>
                                </div>

                                {/* 🎛️ Actions */}
                                <div className="flex items-center gap-2">
                                    {/* ROLE */}
                                    <select
                                        value={u.role}
                                        onChange={(e) => changeRole(u._id, e.target.value)}
                                        disabled={actingId === u._id}
                                        className="border rounded px-2 py-1 text-sm"
                                    >
                                        <option value="user">User</option>
                                        <option value="captain">Captain</option>
                                    </select>

                                    {/* DELETE */}
                                    <button
                                        onClick={() => deleteUser(u._id)}
                                        disabled={actingId === u._id}
                                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 📱 Bottom Navbar */}
            <AdminBottomNavBar />
        </div>
    );
}