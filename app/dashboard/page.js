"use client";
import { useEffect, useState } from "react";
import Comments from "../components/Comments";
export default function DashboardPage() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    fetch("/api/items", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch items");
        }
        return res.json();
      })
      .then((data) => setItems(data.data || []))
      .catch((err) => console.error("Fetch error:", err.message));
  }, []);

  async function addItem(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch("/api/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description: desc }),
    });

    const data = await res.json();
    if (res.ok) setItems([data.data, ...items]);
    setTitle("");
    setDesc("");
  }

  return (
    <div className="p-6 max-w-3xl mx-auto text-white">
      <h1 className="text-2xl mb-4 font-semibold">Dashboard</h1>

      <form onSubmit={addItem} className="mb-6">
        <input
          placeholder="Title"
          className="block w-full mb-2 p-2 rounded bg-gray-800 border border-gray-700"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="block w-full mb-2 p-2 rounded bg-gray-800 border border-gray-700"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition">
          Add Item
        </button>
      </form>

      <div>
        {items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          items.map((it) => (
            <div key={it._id} className="p-4 bg-gray-800 mb-2 rounded">
              <h2 className="font-bold text-lg">{it.title}</h2>
              <p>{it.description}</p>
              <small className="text-gray-400">
                {new Date(it.createdAt).toLocaleString()}
              </small>
               {/* Comments Section */}
             <Comments itemId={it._id} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// "use client";
// import { useEffect, useState } from "react";
// import { NextResponse } from "next/server";  

// export default function DashboardPage() {
//   const [items, setItems] = useState([]);
//   const [title, setTitle] = useState("");
//   const [desc, setDesc] = useState("");
// useEffect(() => {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     console.error("No token found");
//     return;
//   }
//   fetch("/api/items", { headers: { Authorization: `Bearer ${token}` } })
//     .then(async (res) => {
//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(text || "Failed to fetch items");
//       }
//       return res.json();
//     })
//     .then((data) => setItems(data.items || []))
//     .catch((err) => console.error("Fetch error:", err.message));
// }, []);


//   async function addItem(e) {
//     e.preventDefault();
//     const token = localStorage.getItem("token");
//     const res = await fetch("/api/items", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ title, description: desc }),
//     });
//     const data = await res.json();
//     if (res.ok) setItems([data.item, ...items]);
//     setTitle("");
//     setDesc("");
//   }

//   return (
//     <div className="p-6 max-w-3xl mx-auto text-white">
//       <h1 className="text-2xl mb-4">Dashboard</h1>

//       <form onSubmit={addItem} className="mb-6">
//         <input
//           placeholder="Title"
//           className="block w-full mb-2 p-2 rounded bg-gray-800 border border-gray-700"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//         <textarea
//           placeholder="Description"
//           className="block w-full mb-2 p-2 rounded bg-gray-800 border border-gray-700"
//           value={desc}
//           onChange={(e) => setDesc(e.target.value)}
//         />
//         <button className="bg-blue-600 px-4 py-2 rounded">Add Item</button>
//       </form>

//       <div>
//         {items.length === 0 ? (
//           <p>No items found.</p>
//         ) : (
//           items.map((it) => (
//             <div key={it._id} className="p-4 bg-gray-800 mb-2 rounded">
//               <h2 className="font-bold">{it.title}</h2>
//               <p>{it.description}</p>
//               <small>{new Date(it.createdAt).toLocaleString()}</small>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }
