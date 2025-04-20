import React, { Component } from "react";
import config from "../context/config";

export default class CompleteRides extends Component {
  state = {
    completedRides: 0,
    completedBookings: [],
    driverId: "",
    isLoading: true,
    error: null
  };

  componentDidMount() {
    const driverId = localStorage.getItem("userdata")
      ? JSON.parse(localStorage.getItem("userdata")).id
      : null;
    if (driverId) {
      this.setState({ driverId }, this.fetchCompletedRides);
    } else {
      this.setState({ 
        error: "Driver ID not found. Please login again.",
        isLoading: false 
      });
    }
  }

  fetchCompletedRides = async () => {
    const { driverId } = this.state;
    if (!driverId) return;

    this.setState({ isLoading: true, error: null });

    try {
      const response = await fetch(
        `${config.BASE_URL}api/bookings/driver/${driverId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch rides data");
      }
      const bookings = await response.json();

      const completedRides = bookings.filter(
        (ride) => ride.driverId._id === driverId && ride.status === "Completed"
      );

      this.setState({
        completedRides: completedRides.length,
        completedBookings: completedRides,
        isLoading: false
      });
    } catch (error) {
      console.error("Error fetching completed rides:", error);
      this.setState({ 
        error: error.message,
        isLoading: false 
      });
    }
  };

  render() {
    const { completedRides, completedBookings, isLoading, error } = this.state;

    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:ml-64">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 text-gray-800">
            Completed Rides
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
            <div className="bg-white p-4 md:p-6 shadow rounded-lg">
              <h3 className="text-md md:text-lg font-semibold text-gray-700">Completed Rides</h3>
              <p className="text-2xl md:text-3xl font-bold text-green-700 mt-2">
                {isLoading ? (
                  <span className="inline-block h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  completedRides
                )}
              </p>
            </div>
            
            {/* Additional stats can be added here */}
            <div className="bg-white p-4 md:p-6 shadow rounded-lg">
              <h3 className="text-md md:text-lg font-semibold text-gray-700">Total Earnings</h3>
              <p className="text-2xl md:text-3xl font-bold text-blue-700 mt-2">
                {isLoading ? (
                  <span className="inline-block h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  `$${(completedRides * 25).toFixed(2)}` // Example calculation
                )}
              </p>
            </div>
            
            <div className="bg-white p-4 md:p-6 shadow rounded-lg">
              <h3 className="text-md md:text-lg font-semibold text-gray-700">Average Rating</h3>
              <p className="text-2xl md:text-3xl font-bold text-yellow-600 mt-2">
                {isLoading ? (
                  <span className="inline-block h-8 w-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  completedRides > 0 ? "4.8 ★" : "N/A"
                )}
              </p>
            </div>
          </div>

          {/* Completed Rides Table */}
          <div className="bg-white p-4 md:p-6 shadow rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-800">Ride History</h3>
              <button 
                onClick={this.fetchCompletedRides}
                className="px-3 py-1 md:px-4 md:py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Refreshing...
                  </>
                ) : 'Refresh'}
              </button>
            </div>
            
            {isLoading && completedBookings.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : completedBookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No completed rides found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-green-600 text-white">
                      <th className="p-2 text-left hidden sm:table-cell">ID</th>
                      <th className="p-2 text-left">Patient</th>
                      <th className="p-2 text-left hidden md:table-cell">Contact</th>
                      <th className="p-2 text-left">Location</th>
                      <th className="p-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedBookings.map((ride) => (
                      <tr
                        key={ride._id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition"
                      >
                        <td className="p-2 hidden sm:table-cell text-sm text-gray-600">
                          {ride._id.substring(0, 6)}...
                        </td>
                        <td className="p-2">
                          <div className="font-medium text-gray-800">{ride.userId.name}</div>
                          <div className="text-xs text-gray-500 sm:hidden">{ride._id.substring(0, 6)}...</div>
                        </td>
                        <td className="p-2 hidden md:table-cell text-gray-600">
                          {ride.userId.phoneNo}
                        </td>
                        <td className="p-2">
                          <div className="font-medium">To {ride.dropLocation}</div>
                          <div className="text-xs text-gray-500">From {ride.pickupLocation}</div>
                        </td>
                        <td className="p-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
        </div>
      </div>
    );
  }
}