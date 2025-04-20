import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, ChevronDown, Ambulance } from "lucide-react";
import config from "../context/config";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("userdata")));
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setUserData(JSON.parse(localStorage.getItem("userdata")));
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userdata");

    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Ambulance className="h-8 w-8 text-red-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                E-Ambulance
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              className="px-4 py-2 text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50"
              to="/"
            >
              Home
            </Link>
            <Link 
              className="px-4 py-2 text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50"
              to="/services"
            >
              Services
            </Link>
            <Link 
              className="px-4 py-2 text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50"
              to="/booking"
            >
              Book Ambulance
            </Link>
            <Link 
              className="px-4 py-2 text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50"
              to="/contact"
            >
              Contact
            </Link>

            {isLoggedIn && (
              <Link 
                className="px-4 py-2 text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50"
                to="/userbookings"
              >
                My Bookings
              </Link>
            )}

            {!isLoggedIn ? (
              <div className="flex space-x-2 ml-4">
                <Link 
                  className="px-4 py-2 text-blue-600 font-medium border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                  to="/login"
                >
                  Login
                </Link>
                <Link 
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-blue-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity duration-200 shadow-md"
                  to="/register"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="relative ml-4">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-200"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-red-100 to-blue-100 flex items-center justify-center">
                    <User size={18} className="text-gray-600" />
                  </div>
                  <span className="font-medium">{userData?.name || "User"}</span>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50"
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <Link 
                      to="/profile" 
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-red-600 hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden text-gray-700 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {isOpen ? (
              <X size={24} className="text-gray-600" />
            ) : (
              <Menu size={24} className="text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden bg-white shadow-lg ${isOpen ? "block" : "hidden"} transition-all duration-300 overflow-hidden`}
      >
        <div className="px-2 pt-2 pb-4 space-y-1">
          <Link 
            className="block px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors duration-200"
            to="/"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link 
            className="block px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors duration-200"
            to="/services"
            onClick={() => setIsOpen(false)}
          >
            Services
          </Link>
          <Link 
            className="block px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors duration-200"
            to="/booking"
            onClick={() => setIsOpen(false)}
          >
            Book Ambulance
          </Link>
          <Link 
            className="block px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors duration-200"
            to="/contact"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>

          {isLoggedIn && (
            <Link 
              className="block px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors duration-200"
              to="/userbookings"
              onClick={() => setIsOpen(false)}
            >
              My Bookings
            </Link>
          )}

          {!isLoggedIn ? (
            <div className="pt-2 space-y-2">
              <Link 
                className="block w-full px-3 py-3 rounded-lg text-center bg-gradient-to-r from-red-600 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity duration-200"
                to="/login"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link 
                className="block w-full px-3 py-3 rounded-lg text-center border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-colors duration-200"
                to="/register"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="pt-2 space-y-2">
              <Link 
                className="block px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors duration-200"
                to="/profile"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full px-3 py-3 rounded-lg text-center bg-red-600 text-white font-medium hover:bg-red-700 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;