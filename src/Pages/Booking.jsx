import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../context/config";

const Booking = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [emergencyType, setEmergencyType] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pickupLocation || !emergencyType) {
      toast.error("Please fill in all required fields!", { position: "top-center" });
      return;
    }

    try {
      setLoading(true);
      const userdata = JSON.parse(localStorage.getItem("userdata"));
      const userId = userdata?.id;

      if (!userId) {
        toast.error("User not found. Please log in.", { position: "top-center" });
        setLoading(false);
        return;
      }

      await axios.post(`${config.BASE_URL}api/bookings/`, {
        userId,
        pickupLocation,
        dropLocation,
        emergencyType,
      });

      toast.success("Booking successfully created!", {
        position: "top-center",
        onClose: () => navigate("/"),
      });
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error("Failed to create booking. Please try again.", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center text-red-600 mb-6">Book an Ambulance</h1>
      <p className="text-center text-gray-600 mb-6">
        In case of a medical emergency, fill in your details below, and an ambulance will be dispatched to your location immediately.
      </p>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Pickup Location"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <input
          type="text"
          placeholder="Drop Location (Optional)"
          value={dropLocation}
          onChange={(e) => setDropLocation(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <select
          value={emergencyType}
          onChange={(e) => setEmergencyType(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <option value="">Select Emergency Type</option>
          <option value="Accident">Accident</option>
          <option value="Heart Attack">Heart Attack</option>
          <option value="Pregnancy">Pregnancy</option>
          <option value="Other">Other</option>
        </select>
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
          disabled={loading}
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
};

export default Booking;