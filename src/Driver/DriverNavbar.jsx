import React, { Component, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { LayoutDashboard, ClipboardCheck, Clock, LogOut, Menu, X } from "lucide-react";
import config from "../context/config";

export default class DriverNavbar extends Component {
  state = {
    redirect: false,
    isMobileMenuOpen: false,
    windowWidth: window.innerWidth
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userdata");
    this.setState({ redirect: true });
  };

  toggleMobileMenu = () => {
    this.setState(prevState => ({ isMobileMenuOpen: !prevState.isMobileMenuOpen }));
  };

  render() {
    if (this.state.redirect) {
      return <Navigate to="/login" />;
    }

    const { isMobileMenuOpen, windowWidth } = this.state;
    const isMobile = windowWidth < 768;

    return (
      <>
        {/* Mobile Header */}
        {isMobile && (
          <div className="w-full bg-blue-900 text-white p-4 fixed top-0 z-50 flex justify-between items-center shadow-md">
            <h2 className="text-xl font-bold">Driver Panel</h2>
            <button 
              onClick={this.toggleMobileMenu}
              className="p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        )}

        {/* Sidebar - Desktop */}
        {!isMobile && (
          <div className="w-64 h-screen bg-blue-900 text-white fixed shadow-lg">
            <div className="p-4 border-b border-blue-700">
              <h2 className="text-2xl font-bold text-center py-2">Driver Panel</h2>
            </div>
            <nav className="flex flex-col space-y-2 p-4">
              <NavLink to="/driverdashboard" icon={<LayoutDashboard size={20} />} text="Dashboard" />
              <NavLink to="/driver/upcoming-rides" icon={<ClipboardCheck size={20} />} text="Upcoming Rides" />
              <NavLink to="/driver/completed-rides" icon={<Clock size={20} />} text="Completed Rides" />
              <button 
                onClick={this.handleLogout}
                className="flex items-center space-x-3 p-3 hover:bg-red-600 rounded-lg transition-all duration-200 mt-4"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobile && isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={this.toggleMobileMenu}></div>
        )}
        {isMobile && (
          <div 
            className={`fixed top-16 left-0 w-64 h-full bg-blue-900 text-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          >
            <nav className="flex flex-col space-y-2 p-4">
              <NavLink 
                to="/driverdashboard" 
                icon={<LayoutDashboard size={20} />} 
                text="Dashboard" 
                onClick={this.toggleMobileMenu}
              />
              <NavLink 
                to="/driver/upcoming-rides" 
                icon={<ClipboardCheck size={20} />} 
                text="Upcoming Rides" 
                onClick={this.toggleMobileMenu}
              />
              <NavLink 
                to="/driver/completed-rides" 
                icon={<Clock size={20} />} 
                text="Completed Rides" 
                onClick={this.toggleMobileMenu}
              />
              <button 
                onClick={this.handleLogout}
                className="flex items-center space-x-3 p-3 hover:bg-red-600 rounded-lg transition-all duration-200 mt-4"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        )}
      </>
    );
  }
}

// Reusable NavLink component
const NavLink = ({ to, icon, text, onClick }) => (
  <Link 
    to={to} 
    className="flex items-center space-x-3 p-3 hover:bg-blue-700 rounded-lg transition-all duration-200"
    onClick={onClick}
  >
    {icon}
    <span>{text}</span>
  </Link>
);