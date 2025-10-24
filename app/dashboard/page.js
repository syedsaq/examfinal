"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Comments from "../components/Comments";

export default function DashboardPage() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    // 🔒 Redirect to login if not authenticated
    if (!userData || !token) {
      router.replace("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUserName(parsedUser.fullName || "User");
      setRole(parsedUser.role || "user");
    } catch {
      router.replace("/login");
      return;
    }

    // Fetch items for the dashboard
    fetch("/api/items", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => setItems(data.data || []))
      .catch((err) => console.error("Fetch error:", err.message))
      .finally(() => setLoading(false));
  }, [router]);

  async function addItem(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!title.trim() || !desc.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    const res = await fetch("/api/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description: desc }),
    });

    const data = await res.json();
    if (res.ok) {
      setItems([data.data, ...items]);
      setTitle("");
      setDesc("");
    }
  }

  // 🚪 Logout function
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  // 🧭 Navigate to Admin Panel
  function goToAdmin() {
    router.push("/admin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-lime-100 to-emerald-200 py-10 px-6 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute w-72 h-72 bg-green-400/30 rounded-full top-10 left-10 blur-3xl"
      ></motion.div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4 }}
        className="absolute w-96 h-96 bg-lime-300/30 rounded-full bottom-10 right-10 blur-3xl"
      ></motion.div>

      <div className="relative max-w-4xl mx-auto">
        {/* 🧠 Header Section */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <motion.h1
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-extrabold text-green-800"
          >
            🛒 Welcome, <span className="text-emerald-600">{userName}</span>!
          </motion.h1>

          <div className="flex gap-3">
            {/* 🧭 Admin Navigation Button */}
            {role === "admin" && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToAdmin}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-xl shadow-md transition"
              >
                🧑‍💼 Admin Panel
              </motion.button>
            )}

            {/* 🚪 Logout Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-xl shadow-md transition"
            >
              Logout
            </motion.button>
          </div>
        </div>

        {/* ✏️ Add Item Card */}
        <motion.form
          onSubmit={addItem}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white/80 backdrop-blur-lg shadow-xl border border-white/40 p-8 rounded-3xl mb-8"
        >
          <h2 className="text-xl font-semibold text-green-700 mb-4">
            Add New Grocery Item
          </h2>

          <input
            placeholder="Enter item title (e.g., Fresh Apples)"
            className="w-full p-3 mb-3 rounded-xl bg-green-50 text-gray-800 placeholder-gray-400 border border-green-200 focus:ring-2 focus:ring-green-400 focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Enter item description (e.g., 1kg pack of juicy apples)"
            className="w-full p-3 mb-3 rounded-xl bg-green-50 text-gray-800 placeholder-gray-400 border border-green-200 focus:ring-2 focus:ring-green-400 focus:outline-none"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition shadow-lg"
            type="submit"
          >
            Add Item
          </motion.button>
        </motion.form>

        {/* 🧾 Grocery Items List */}
        {loading ? (
          <p className="text-center text-green-800">Loading your items...</p>
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-16 text-gray-700"
          >
            <p className="text-lg">No grocery items yet 🍅</p>
            <p className="text-sm text-gray-500">
              Add your first one above to start tracking!
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence>
              {items.map((it) => (
                <motion.div
                  key={it._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 border border-green-100 hover:shadow-green-200 transition"
                >
                  <h3 className="text-xl font-semibold text-green-700">
                    {it.title}
                  </h3>
                  <p className="text-gray-700 mt-1">{it.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Added: {new Date(it.createdAt).toLocaleString()}
                  </p>

                  {/* 💬 Comments Section */}
                  <div className="mt-4">
                    <Comments itemId={it._id} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
