// // lib/db.js
// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
// }

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function connectDB() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     mongoose.set("strictQuery", false);
//     cached.promise = mongoose.connect(MONGODB_URI, {
//       dbName: process.env.DB_NAME || undefined,
//     }).then((mongoose) => mongoose);
//   }
//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export default connectDB;



import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const MONGODB_URI = process.env.MONGODB_URI;
  const DB_NAME = process.env.DB_NAME || "myappdb"; // ✅ get db from env

  if (!MONGODB_URI) throw new Error("❌ MONGODB_URI not set in .env");

  await mongoose.connect(MONGODB_URI, {
    dbName: DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  isConnected = true;
  console.log(`✅ MongoDB connected to database: ${DB_NAME}`);
};

export default connectDB;


