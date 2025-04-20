import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./Navbar/Navbar";
import AdminNavbar from "./Admin/AdminNavbar";
import DriverNavbar from "./Driver/DriverNavbar";
import Home from "./Pages/Home";
import Services from "./Pages/Services";
import Booking from "./Pages/Booking";
import Contact from "./Pages/Contact";
import Login from "./Pages/Login";
import Register from "./Pages/Regster";
import Profile from "./Pages/Profile";
import AdminDashboard from "./Admin/AdminDashboard";
import ManageUsers from "./Admin/ManageUsers";
import ManageBookings from "./Admin/ManageBooking";
import ManageDriver from "./Admin/ManageDriver";
import ManageAmbulance from "./Admin/ManageAmbulance";
import ViewAllBookings from "./Admin/ViewAllBookings";
import DriverDashboard from "./Driver/DriverDashboard";
import UpcomingRides from "./Driver/UpcomingRides";
import CompleteRides from "./Driver/CompleteRides";
import UserBooking from "./Pages/UserBooking";
import AllBookings from "./Pages/AllBookings";
import { NotificationProvider } from "./context/NotificationContext";
import { Outlet, useNavigate } from "react-router-dom";

// Public Layout
function PublicLayout() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <Outlet />
      </div>
    </>
  );
}

// Admin Layout
function AdminLayout() {
  return (
    <div className="flex">
      <AdminNavbar />
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
}

// Driver Layout
function DriverLayout() {
  return (
    <div className="flex">
      <DriverNavbar />
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
}

// Component to handle role-based redirection
const RoleBasedRedirect = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("userdata");

    if (userData) {
      const { role } = JSON.parse(userData);

      if (role === "User") {
        navigate("/home");
      } else if (role === "Admin") {
        navigate("/admindashboard");
      } else if (role === "Driver") {
        navigate("/driverdashboard");
      }
    } else {
      navigate("/login");
    }

    setLoading(false);
  }, [navigate]);

  return loading ? <p className="text-center mt-10">Checking authentication...</p> : null;
};

function App() {
  return (
    <NotificationProvider>
      <>
        <Routes>
          {/* Role-Based Redirect */}
          <Route path="/" element={<RoleBasedRedirect />} />

          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/userbookings" element={<UserBooking />} />
            <Route path="/allbookings" element={<AllBookings />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/admin/manage-users" element={<ManageUsers />} />
            <Route path="/admin/manage-bookings" element={<ManageBookings />} />
            <Route path="/admin/manage-drivers" element={<ManageDriver />} />
            <Route path="/admin/manage-ambulances" element={<ManageAmbulance />} />
            <Route path="/view-all-bookings" element={<ViewAllBookings />} />
          </Route>

          {/* Driver Routes */}
          <Route element={<DriverLayout />}>
            <Route path="/driverdashboard" element={<DriverDashboard />} />
            <Route path="/driver/upcoming-rides" element={<UpcomingRides />} />
            <Route path="/driver/completed-rides" element={<CompleteRides />} />
          </Route>

          {/* Catch-all Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </>
    </NotificationProvider>
  );
}

export default App;
