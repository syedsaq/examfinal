// app/login/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error || "Login failed");
      } else {
        // save token in localStorage (for this simple demo)
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMsg("Login successful — redirecting to dashboard...");
        setTimeout(() => router.push("/dashboard"), 800);
      }
    } catch (err) {
      console.error(err);
      setMsg("Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-[#1C2541]/60 p-10 rounded-2xl">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={submit} className="space-y-4">
          <input name="email" value={form.email} onChange={onChange} placeholder="Email" className="w-full p-3 rounded bg-[#0B132B]/40" required />
          <input name="password" value={form.password} onChange={onChange} type="password" placeholder="Password" className="w-full p-3 rounded bg-[#0B132B]/40" required />
          <button disabled={loading} className="w-full py-3 bg-yellow-400 text-black rounded">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {msg && <p className="mt-4 text-yellow-300">{msg}</p>}
      </div>
    </div>
  );
}
