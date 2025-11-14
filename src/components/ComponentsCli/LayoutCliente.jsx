
// src/components/ComponentsCli/LayoutCliente.jsx
import React from "react";
import Navbar from "./Navbar";

export default function LayoutCliente({ children }) {
  return (
    <div className="relative min-h-screen bg-black ext-white">
      <Navbar />
      {/* pt-20 = ~5rem → suficiente para navbar alto (80px) */}
      {/*<main className="pt-[5rem] pb-8">{children}</main>*/}
      <main className="pb-8">{children}</main>
    </div>
  );
}