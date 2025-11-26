import React, { useState } from "react";
import SidebarAdmin from "./SidebarAdmin";
import NavbarAdmin from "./NavbarAdmin"; // Navbar específico
import AdminIntroTour from "../ui/AdminIntroTour";

function DashboardLayoutAdmin({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarAdmin open={sidebarOpen} />
      
      <div className={`flex-1 flex flex-col overflow-hidden ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Usar Navbar específico para admin */}
        <NavbarAdmin 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {/* Guided Tour component mounted for admin pages */}
          <AdminIntroTour />
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayoutAdmin;