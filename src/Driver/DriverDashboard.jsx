import React, { Component } from "react";
import { FaSpinner, FaCheckCircle, FaClock, FaCarAlt, FaUser, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import config from "../context/config";

export default class DriverDashboard extends Component {
  state = {
    totalRides: 0,
    completedRides: 0,
    pendingRides: 0,
    pendingBookings: [],
    driverId: "",
    loading: true,
    error: null
  };

  componentDidMount() {
    const driverId = localStorage.getItem('userdata') 
      ? JSON.parse(localStorage.getItem('userdata')).id 
      : null;
    
    if (driverId) {
      this.setState({ driverId }, this.fetchBookings);
    } else {
      this.setState({ 
        error: "Driver ID not found. Please login again.",
        loading: false 
      });
    }
  }

  fetchBookings = async () => {
    const { driverId } = this.state;
    if (!driverId) return;

    try {
      const response = await fetch(`${config.BASE_URL}api/bookings/driver/${driverId}`);
      if (!response.ok) throw new Error("Failed to fetch bookings");
      
      const bookings = await response.json();

      const totalRides = bookings.filter(ride => ride.driverId?._id === driverId).length;
      const completedRides = bookings.filter(ride => 
        ride.driverId?._id === driverId && ride.status === "Completed"
      ).length;
      const pendingRides = bookings.filter(ride => 
        ride.driverId?._id === driverId && ride.status === "Confirmed"
      ).length;

      this.setState({
        totalRides,
        completedRides,
        pendingRides,
        pendingBookings: bookings.filter(ride => 
          ride.driverId?._id === driverId && ride.status === "Confirmed"
        ),
        loading: false,
        error: null
      });

    } catch (error) {
      console.error("Error fetching bookings:", error);
      this.setState({ 
        error: "Failed to load bookings. Please try again later.",
        loading: false 
      });
    }
  };

  render() {
    const { 
      totalRides, 
      completedRides, 
      pendingRides, 
      pendingBookings, 
      loading, 
      error 
    } = this.state;

    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:ml-64">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Driver Dashboard</h1>
          <p className="text-gray-600 text-sm md:text-base">Overview of your rides and activities</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Total Rides Card */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6 flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FaCarAlt className="text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Rides</p>
              <p className="text-2xl font-bold text-gray-800">
                {loading ? <FaSpinner className="animate-spin inline-block" /> : totalRides}
              </p>
            </div>
          </div>

          {/* Completed Rides Card */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6 flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FaCheckCircle className="text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Completed Rides</p>
              <p className="text-2xl font-bold text-gray-800">
                {loading ? <FaSpinner className="animate-spin inline-block" /> : completedRides}
              </p>
            </div>
          </div>

          {/* Pending Rides Card */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6 flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FaClock className="text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Rides</p>
              <p className="text-2xl font-bold text-gray-800">
                {loading ? <FaSpinner className="animate-spin inline-block" /> : pendingRides}
              </p>
            </div>
          </div>
        </div>

        {/* Pending Rides Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center">
              <FaClock className="mr-2 text-yellow-500" />
              Pending Rides
            </h2>
            <p className="text-gray-600 text-xs md:text-sm mt-1">
              Rides that need to be completed
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <FaSpinner className="animate-spin text-blue-500 text-2xl mx-auto" />
              <p className="mt-2 text-gray-600">Loading pending rides...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              {error}
            </div>
          ) : pendingBookings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No pending rides found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingBookings.map((ride) => (
                    <tr key={ride._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                        {ride._id.substring(0, 6)}...
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaUser className="text-blue-600 text-sm md:text-base" />
                          </div>
                          <div className="ml-2 md:ml-4">
                            <div className="text-xs md:text-sm font-medium text-gray-900">
                              {ride.userId?.name || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaPhone className="text-gray-400 mr-1 md:mr-2 text-xs md:text-sm" />
                          {ride.userId?.phoneNo || "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="text-red-400 mr-1 md:mr-2 text-xs md:text-sm" />
                          <div>
                            <div className="font-medium">Pickup: {ride.pickupLocation}</div>
                            <div className="text-xs text-gray-400">Drop: {ride.dropLocation}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {ride.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Responsive Footer Note */}
        <div className="mt-6 md:mt-8 text-center text-xs md:text-sm text-gray-500">
          <p>Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    );
  }
}