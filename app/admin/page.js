"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPage, setUserPage] = useState(1);
  const [itemPage, setItemPage] = useState(1);
  const pageSize = 5;



  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      router.replace("/login");
      return;
    }

    try {
      const parsed = JSON.parse(storedUser);

      if (parsed.role !== "admin") {
        router.replace("/dashboard");
        return;
      }

      setUser(parsed);
      fetchData(token);
    } catch {
      router.replace("/login");
    }
  }, [router]);

  async function fetchData(token) {
    try {
      const [usersRes, itemsRes] = await Promise.all([
        fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/admin/items", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const usersData = await usersRes.json();
      const itemsData = await itemsRes.json();

      setUsers(usersData.data || []);
      setItems(itemsData.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Fetch admin data error:", err);
    }
  }

  async function deleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const token = localStorage.getItem("token");
    await fetch(`/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(users.filter((u) => u._id !== id));
  }

  async function deleteItem(id) {
    if (!confirm("Are you sure you want to delete this item?")) return;
    const token = localStorage.getItem("token");
    await fetch(`/api/admin/items/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setItems(items.filter((i) => i._id !== id));
  }

  if (loading) return <div className="text-white p-6">Loading...</div>;

  // Pagination logic
  const paginatedUsers = users.slice(
    (userPage - 1) * pageSize,
    userPage * pageSize
  );
  const paginatedItems = items.slice(
    (itemPage - 1) * pageSize,
    itemPage * pageSize
  );

  const totalUserPages = Math.ceil(users.length / pageSize);
  const totalItemPages = Math.ceil(items.length / pageSize);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">👑 Admin Dashboard</h1>
      <p>
        Welcome, {user?.fullName} ({user?.email})
      </p>

      {/* Users Section */}
      <section className="mt-6">
        <h2 className="text-2xl mb-2 font-semibold">All Users</h2>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <>
            <table className="w-full border border-gray-700 text-sm">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-2">Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((u) => (
                  <tr key={u._id} className="border-t border-gray-700">
                    <td className="p-2">{u.fullName}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-3 space-x-2">
              <button
                disabled={userPage === 1}
                onClick={() => setUserPage((p) => p - 1)}
                className={`px-3 py-1 rounded ${
                  userPage === 1 ? "bg-gray-700" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Prev
              </button>
              <span className="px-2 py-1">
                Page {userPage} of {totalUserPages}
              </span>
              <button
                disabled={userPage === totalUserPages}
                onClick={() => setUserPage((p) => p + 1)}
                className={`px-3 py-1 rounded ${
                  userPage === totalUserPages
                    ? "bg-gray-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>

      {/* Items Section */}
      <section className="mt-8">
        <h2 className="text-2xl mb-2 font-semibold">All Items</h2>
        {items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <>
            <table className="w-full border border-gray-700 text-sm">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-2">Title</th>
                  <th>Description</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((i) => (
                  <tr key={i._id} className="border-t border-gray-700">
                    <td className="p-2">{i.title}</td>
                    <td>{i.description}</td>
                    <td>{new Date(i.createdAt).toLocaleString()}</td>
                    <td>
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

            {/* Pagination Controls */}
            <div className="flex justify-center mt-3 space-x-2">
              <button
                disabled={itemPage === 1}
                onClick={() => setItemPage((p) => p - 1)}
                className={`px-3 py-1 rounded ${
                  itemPage === 1 ? "bg-gray-700" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Prev
              </button>
              <span className="px-2 py-1">
                Page {itemPage} of {totalItemPages}
              </span>
              <button
                disabled={itemPage === totalItemPages}
                onClick={() => setItemPage((p) => p + 1)}
                className={`px-3 py-1 rounded ${
                  itemPage === totalItemPages
                    ? "bg-gray-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
