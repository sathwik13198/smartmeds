import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const [location] = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Check if current route is login page or auth page
  const isAuthPage = location === "/login" || location === "/auth";

  // If on login or auth page, render without layout
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Main layout with sidebar and content
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar mobile={false} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      </div>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 ${sidebarOpen ? "block" : "hidden"}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-neutral-600 bg-opacity-75" aria-hidden="true" onClick={toggleSidebar}></div>
        <div className="relative flex flex-col max-w-xs w-full h-full bg-white">
          <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200">
            <h1 className="text-xl font-semibold text-primary">SmartHospital</h1>
            <button
              type="button"
              className="text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={toggleSidebar}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Sidebar mobile onClose={toggleSidebar} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar onMenuClick={toggleSidebar} />

        <main className="flex-1 overflow-y-auto bg-neutral-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
