"use client";
import { useState, useEffect } from "react";

export default function Comments({ itemId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(`/api/comments?itemId=${itemId}`)
      .then((res) => res.json())
      .then((data) => setComments(data.data || []));
  }, [itemId]);

  async function addComment(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ itemId, content: text }),
    });
    const data = await res.json();
    if (res.ok) setComments([data.data, ...comments]);
    setText("");
  }

  return (
    <div className="mt-3">
      <form onSubmit={addComment} className="flex mb-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 p-2 rounded bg-gray-700 border border-gray-600 text-white"
        />
        <button className="ml-2 bg-blue-600 px-3 rounded hover:bg-blue-700">
          Post
        </button>
      </form>
      <div className="space-y-1">
        {comments.map((c) => (
          <div key={c._id} className="bg-gray-700 p-2 rounded text-sm">
            <strong>{c.user?.fullName || "Unknown"}</strong>: {c.content}
          </div>
        ))}
      </div>
    </div>
  );
}
