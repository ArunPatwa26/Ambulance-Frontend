import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Truck, 
  UserCheck, 
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
      // Close mobile menu when resizing to desktop
      if (window.innerWidth > 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userdata");
    navigate("/login");
    window.location.reload();
  };

  // Nav link items data
  const navItems = [
    { 
      path: "/admindashboard",
      icon: <LayoutDashboard size={20} />,
      text: "Dashboard"
    },
    {
      path: "/admin/manage-users",
      icon: <Users size={20} />,
      text: "Manage Users"
    },
    {
      path: "/admin/manage-bookings",
      icon: <FileText size={20} />,
      text: "Manage Bookings"
    },
    {
      path: "/admin/manage-ambulances",
      icon: <Truck size={20} />,
      text: "Manage Ambulance"
    },
    {
      path: "/admin/manage-drivers",
      icon: <UserCheck size={20} />,
      text: "Manage Drivers"
    }
  ];

  // Mobile toggle button
  const MobileToggleButton = () => (
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-900 text-white shadow-lg"
    >
      {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );

  // Navbar content
  const NavbarContent = () => (
    <div className={`w-64 h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white flex flex-col shadow-xl
      ${isDesktop ? 'fixed' : 'fixed lg:relative top-0 left-0 z-40 transition-transform duration-300 ease-in-out'}
      ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
    >
      {/* Logo/Header Section */}
      <div className="p-6 pb-4 border-b border-blue-800">
        <h2 className="text-xl font-bold tracking-tight">
          <span className="text-blue-300">EMS</span> Admin
        </h2>
        <p className="text-sm text-blue-400 mt-1">Emergency Management System</p>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => !isDesktop && setIsMobileMenuOpen(false)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
              ${location.pathname === item.path 
                ? "bg-blue-800/50 text-white border-l-4 border-blue-300"
                : "hover:bg-blue-800/30 hover:text-blue-100 text-blue-200"}
            `}
          >
            {item.icon}
            <span className="text-sm font-medium">{item.text}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-blue-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-red-100 hover:bg-red-600/20 rounded-lg
                   transition-colors duration-200 hover:text-red-50 group"
        >
          <LogOut size={18} className="text-red-300 group-hover:text-red-200" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <MobileToggleButton />
      
      {/* Navbar content */}
      <NavbarContent />
      
      {/* Overlay for mobile */}
      {!isDesktop && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}