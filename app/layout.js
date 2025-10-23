// app/layout.js
import "./globals.css";

export const metadata = {
  title: "Auth Demo",
  description: "Simple auth demo"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-[#0B132B] via-[#1C2541] to-[#0B132B] text-white">
        {children}
      </body>
    </html>
  );
}
