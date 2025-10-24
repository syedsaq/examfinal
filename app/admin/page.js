"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Fetch admin data
  async function fetchData(token) {
    try {
      setLoading(true);
      const [usersRes, itemsRes] = await Promise.all([
        fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/admin/items", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!usersRes.ok) {
        const t = await usersRes.text();
        throw new Error(t || "Failed to fetch users");
      }
      if (!itemsRes.ok) {
        const t = await itemsRes.text();
        throw new Error(t || "Failed to fetch items");
      }

      const usersData = await usersRes.json();
      const itemsData = await itemsRes.json();

      setUsers(usersData.data || []);
      setItems(itemsData.data || []);
    } catch (err) {
      console.error("Fetch admin data error:", err);
    } finally {
      setLoading(false);
    }
  }

  // Delete a user (safe, with optimistic UI)
  async function deleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Not authenticated");
      router.replace("/login");
      return;
    }

    // Optimistic update
    const old = users;
    setUsers((u) => u.filter((x) => x._id !== id));

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Delete failed");
      }
    } catch (err) {
      console.error("Delete user error:", err);
      alert("Failed to delete user. Reverting.");
      setUsers(old);
    }
  }

  // Delete an item (safe, with optimistic UI)
  async function deleteItem(id) {
    if (!confirm("Are you sure you want to delete this item?")) return;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Not authenticated");
      router.replace("/login");
      return;
    }

    const old = items;
    setItems((it) => it.filter((x) => x._id !== id));

    try {
      const res = await fetch(`/api/admin/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Delete failed");
      }
    } catch (err) {
      console.error("Delete item error:", err);
      alert("Failed to delete item. Reverting.");
      setItems(old);
    }
  }

  function handleLogout() {
    localStorage.clear();
    router.replace("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-green-50 text-green-700 text-xl font-semibold">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-green-700" />
      </div>
    );
  }

  const paginatedUsers = users.slice((userPage - 1) * pageSize, userPage * pageSize);
  const paginatedItems = items.slice((itemPage - 1) * pageSize, itemPage * pageSize);
  const totalUserPages = Math.max(1, Math.ceil(users.length / pageSize));
  const totalItemPages = Math.max(1, Math.ceil(items.length / pageSize));

  return (
    <div className="min-h-screen bg-green-50 text-gray-800 p-6">
      {/* NAV */}
      <nav className="flex justify-between items-center bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg mb-6">
        <div className="flex items-center gap-6 font-semibold">
          <button onClick={() => router.push("/dashboard")} className="hover:text-green-200 transition">
            🏠 Dashboard
          </button>
          {/* admin link shown only when user.role === 'admin' */}
          {user?.role === "admin" && (
            <button onClick={() => router.push("/admin")} className="hover:text-green-200 transition">
              🧑‍💼 Admin Panel
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm mr-4">{user?.fullName}</span>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md">
            🚪 Logout
          </button>
        </div>
      </nav>

      <header className="mb-6">
        <h1 className="text-4xl font-bold text-green-700">🥬 Grocery Admin Panel</h1>
        <p className="text-sm text-gray-600 mt-1">
          Welcome, <span className="font-medium text-green-800">{user?.fullName}</span> ({user?.email})
        </p>
      </header>

      {/* USERS */}
      <section className="mb-8 bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-green-700">👥 Users</h2>
          <div className="text-sm text-gray-600">Total: {users.length}</div>
        </div>

        {users.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-md border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-green-100 text-green-800">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((u) => (
                    <tr key={u._id} className="border-t hover:bg-green-50">
                      <td className="p-3">{u.fullName}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3 capitalize">{u.role}</td>
                      <td className="p-3">
                        <button
                          onClick={() => deleteUser(u._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* pagination */}
            <div className="flex items-center justify-center mt-4 gap-3">
              <button
                disabled={userPage === 1}
                onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                className={`px-4 py-2 rounded-md ${userPage === 1 ? "bg-gray-200 text-gray-400" : "bg-green-600 text-white"}`}
              >
                Prev
              </button>
              <div className="text-gray-700">Page {userPage} of {totalUserPages}</div>
              <button
                disabled={userPage === totalUserPages}
                onClick={() => setUserPage((p) => Math.min(totalUserPages, p + 1))}
                className={`px-4 py-2 rounded-md ${userPage === totalUserPages ? "bg-gray-200 text-gray-400" : "bg-green-600 text-white"}`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>

      {/* ITEMS */}
      <section className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-green-700">🛒 Grocery Items</h2>
          <div className="text-sm text-gray-600">Total: {items.length}</div>
        </div>

        {items.length === 0 ? (
          <p className="text-gray-500">No items found.</p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-md border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-green-100 text-green-800">
                  <tr>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-left">Created At</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((i) => (
                    <tr key={i._id} className="border-t hover:bg-green-50">
                      <td className="p-3 font-medium">{i.title}</td>
                      <td className="p-3">{i.description}</td>
                      <td className="p-3">{new Date(i.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <button
                          onClick={() => deleteItem(i._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* pagination */}
            <div className="flex items-center justify-center mt-4 gap-3">
              <button
                disabled={itemPage === 1}
                onClick={() => setItemPage((p) => Math.max(1, p - 1))}
                className={`px-4 py-2 rounded-md ${itemPage === 1 ? "bg-gray-200 text-gray-400" : "bg-green-600 text-white"}`}
              >
                Prev
              </button>
              <div className="text-gray-700">Page {itemPage} of {totalItemPages}</div>
              <button
                disabled={itemPage === totalItemPages}
                onClick={() => setItemPage((p) => Math.min(totalItemPages, p + 1))}
                className={`px-4 py-2 rounded-md ${itemPage === totalItemPages ? "bg-gray-200 text-gray-400" : "bg-green-600 text-white"}`}
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
