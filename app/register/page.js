// app/register/page.js
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
        setMessage("Registration successful — redirecting to login...");
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
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-xl bg-[#1C2541]/60 p-10 rounded-2xl">
        <h2 className="text-2xl font-bold mb-4">Sign up ({role})</h2>
        <form onSubmit={submit} className="space-y-4">
          <input name="fullName" placeholder="Full name" value={form.fullName} onChange={onChange} className="w-full p-3 rounded bg-[#0B132B]/40" required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} className="w-full p-3 rounded bg-[#0B132B]/40" required />
          <input name="password" type="password" placeholder="Password (min 6)" value={form.password} onChange={onChange} className="w-full p-3 rounded bg-[#0B132B]/40" required />
          <button disabled={loading} className="w-full py-3 bg-yellow-400 text-black rounded">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        {message && <p className="mt-4 text-yellow-300">{message}</p>}
      </motion.div>
    </div>
  );
}
