"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("🔹 Login response:", data);

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid email or password");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unexpected server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-lime-100 to-emerald-200 relative overflow-hidden">
      {/* Decorative background */}
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

      {/* Login Card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl p-10 rounded-3xl border border-white/30"
      >
        <h2 className="text-3xl font-extrabold text-green-700 text-center mb-6">
          🥦 Welcome Back
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Log in to access your grocery dashboard
        </p>

        {/* Error Message (Animated Pop-Up) */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-red-100 text-red-700 p-3 mb-4 rounded-xl text-sm font-medium text-center shadow"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-green-700 mb-1">
              Email
            </label>
          <input
  type="email"
  placeholder="you@example.com"
  className="w-full p-3 rounded-xl bg-green-50 text-gray-800 placeholder-gray-400 border border-green-200 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>
          </div>

          <div>
            <label className="block text-sm font-semibold text-green-700 mb-1">
              Password
            </label>
         <input
  type="password"
  placeholder="Enter your password"
  className="w-full p-3 rounded-xl bg-green-50 text-gray-800 placeholder-gray-400 border border-green-200 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
/>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <div className="text-center mt-6 text-gray-600">
          Don’t have an account?{" "}
          <button
            onClick={() => router.push("/register")}
            className="text-green-700 font-semibold hover:underline"
          >
            Register
          </button>
        </div>
      </motion.div>
    </div>
  );
}
