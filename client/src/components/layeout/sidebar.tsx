import { Link, useLocation } from "wouter";
import { useContext } from "react";
import { AuthContext } from "@/hooks/use-auth";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  mobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useContext(AuthContext) ?? { user: null, logoutMutation: null };

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    // ... other nav items remain unchanged
  ];

  // Close sidebar when clicking outside on mobile
  const handleOutsideClick = () => {
    if (isOpen && window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={handleOutsideClick}
        ></div>
      )}

      <aside
        className={`fixed md:static sidebar w-64 bg-white shadow-md h-full z-30 transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-center py-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-primary-500 font-heading">MediSmart</h1>
        </div>

        <div className="px-4 py-4">
          {user && (
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative">
                <img
                  src={user.profileImage || "https://via.placeholder.com/100"}
                  alt="User profile"
                  className="w-10 h-10 rounded-full"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h2 className="text-sm font-medium">{user.fullName}</h2>
                <p className="text-xs text-gray-500">{user.specialty || user.role}</p>
              </div>
            </div>
          )}

          <nav>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link href={item.path}>
                    <div
                      className={`flex items-center px-4 py-3 rounded-lg ${
                        location === item.path || (item.path === "/dashboard" && location === "/")
                          ? "bg-primary-50 text-primary-500"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="absolute bottom-0 w-full border-t border-gray-100 p-4">
          <button
            onClick={() => logoutMutation?.mutate()}
            className="flex items-center text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 w-full text-left"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}