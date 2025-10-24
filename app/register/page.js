"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const params = useSearchParams();
  const role = params.get("role") || "user";

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function onChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, ...form }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Registration failed");
      } else {
        setMessage("✅ Registration successful — redirecting...");
        setTimeout(() => router.push("/login"), 900);
      }
    } catch (err) {
      setMessage("Server error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-lime-100 to-emerald-200 relative overflow-hidden">
      {/* Background circles for decoration */}
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

      {/* Form Card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl p-10 rounded-3xl border border-white/30"
      >
        <h2 className="text-3xl font-extrabold text-green-700 text-center mb-6">
          🍋 Create Your Account
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Sign up as <span className="font-semibold text-green-700">{role}</span> and start your grocery journey!
        </p>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-green-700 mb-1">
              Full Name
            </label>
           <input
  name="fullName"
  placeholder="Enter your full name"
  value={form.fullName}
  onChange={onChange}
  className="w-full p-3 rounded-xl bg-green-50 text-gray-800 border border-green-200 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
  required
/>
          </div>

          <div>
            <label className="block text-sm font-semibold text-green-700 mb-1">
              Email
            </label>
           <input
  name="email"
  type="email"
  placeholder="example@email.com"
  value={form.email}
  onChange={onChange}
  className="w-full p-3 rounded-xl bg-green-50 text-gray-800 border border-green-200 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
  required
/>
          </div>

          <div>
            <label className="block text-sm font-semibold text-green-700 mb-1">
              Password
            </label>
           <input
  name="password"
  type="password"
  placeholder="At least 6 characters"
  value={form.password}
  onChange={onChange}
  className="w-full p-3 rounded-xl bg-green-50 text-gray-800 border border-green-200 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
  required
/>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition"
          >
            {loading ? "Registering..." : "Register"}
          </motion.button>
        </form>

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-5 text-center text-sm text-green-700 font-medium"
          >
            {message}
          </motion.p>
        )}

        <div className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-green-700 font-semibold hover:underline"
          >
            Login
          </button>
        </div>
      </motion.div>
    </div>
  );
}
