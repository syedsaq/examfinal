"use client";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("/api/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setUser(data.data));
  }, []);

  if (!user) return <p className="text-center mt-8 text-gray-400">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="bg-gray-800 p-4 rounded">
        <p><strong>Name:</strong> {user.fullName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
  );
}
