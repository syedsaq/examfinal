"use client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("users"); // toggle between 'users' and 'items'

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch all users (admin only)
  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUsers(data.data || []);
      });
  }, [token]);

  // Fetch all items (admin only)
  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/items", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setItems(data.data || []);
      });
  }, [token]);

  async function deleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setUsers(users.filter((u) => u._id !== id));
    alert(data.message);
  }

  async function deleteItem(id) {
    if (!confirm("Delete this item?")) return;
    const res = await fetch(`/api/admin/items/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setItems(items.filter((i) => i._id !== id));
    alert(data.message);
  }

  return (
    <div className="p-6 text-white max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tab buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTab("users")}
          className={`px-4 py-2 rounded ${
            tab === "users" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          👥 Users
        </button>
        <button
          onClick={() => setTab("items")}
          className={`px-4 py-2 rounded ${
            tab === "items" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          📦 Items
        </button>
      </div>

      {/* USERS TABLE */}
      {tab === "users" && (
        <div>
          <h2 className="text-xl mb-3 font-semibold">All Users</h2>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <table className="w-full text-sm border border-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="p-3 text-left">Full Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t border-gray-700">
                    <td className="p-3">{u.fullName}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3 capitalize">{u.role}</td>
                    <td className="p-3 text-right">
                      {u.role !== "admin" && (
                        <button
                          onClick={() => deleteUser(u._id)}
                          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ITEMS TABLE */}
      {tab === "items" && (
        <div>
          <h2 className="text-xl mb-3 font-semibold">All Items</h2>
          {items.length === 0 ? (
            <p>No items found.</p>
          ) : (
            <table className="w-full text-sm border border-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Created At</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i._id} className="border-t border-gray-700">
                    <td className="p-3">{i.title}</td>
                    <td className="p-3 truncate max-w-[200px]">
                      {i.description}
                    </td>
                    <td className="p-3">{i.user?.fullName || "—"}</td>
                    <td className="p-3">
                      {new Date(i.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => deleteItem(i._id)}
                        className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
