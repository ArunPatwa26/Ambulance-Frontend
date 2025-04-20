import React, { Component } from "react";
import config from "../context/config";

export default class UpcomingRides extends Component {
  state = {
    upcomingRides: 0,
    upcomingBookings: [],
    driverId: "",
    loading: false,
    updatingStatus: null,
    error: null
  };

  componentDidMount() {
    const driverId = localStorage.getItem("userdata")
      ? JSON.parse(localStorage.getItem("userdata")).id
      : null;
    if (driverId) {
      this.setState({ driverId }, this.fetchUpcomingRides);
    } else {
      this.setState({ 
        error: "Driver ID not found. Please login again.",
        loading: false 
      });
    }
  }

  fetchUpcomingRides = async () => {
    const { driverId } = this.state;
    if (!driverId) return;

    this.setState({ loading: true, error: null });

    try {
      const response = await fetch(
        `${config.BASE_URL}api/bookings/driver/${driverId}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch rides data");
      }
      
      const bookings = await response.json();

      const upcomingRides = bookings.filter(
        (ride) =>
          ride.driverId._id === driverId &&
          ride.status === "Confirmed" &&
          ride.status !== "Completed"
      );

      this.setState({
        upcomingRides: upcomingRides.length,
        upcomingBookings: upcomingRides,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching upcoming rides:", error);
      this.setState({ 
        error: error.message,
        loading: false 
      });
    }
  };

  markRideAsComplete = async (bookingId, ambulanceId) => {
    if (!window.confirm("Are you sure you want to mark this ride as complete?")) {
      return;
    }

    this.setState({ updatingStatus: bookingId });

    try {
      const [bookingResponse, ambulanceResponse] = await Promise.all([
        fetch(`${config.BASE_URL}api/bookings/${bookingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Completed" }),
        }),
        fetch(`${config.BASE_URL}api/ambulance/${ambulanceId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Available" }),
        })
      ]);

      if (!bookingResponse.ok || !ambulanceResponse.ok) {
        throw new Error("Failed to update status");
      }

      this.fetchUpcomingRides();
      alert("Ride marked as complete successfully!");
    } catch (error) {
      console.error("Error completing ride:", error);
      alert("Failed to mark ride as complete. Please try again.");
    } finally {
      this.setState({ updatingStatus: null });
    }
  };

  render() {
    const { 
      upcomingBookings, 
      loading, 
      updatingStatus, 
      error,
      upcomingRides 
    } = this.state;

    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2 sm:mb-0">
              Upcoming Rides
            </h1>
            <button
              onClick={this.fetchUpcomingRides}
              disabled={loading}
              className="px-3 py-1 md:px-4 md:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center text-sm md:text-base"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : 'Refresh'}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
            <div className="bg-white p-4 md:p-6 shadow rounded-lg">
              <h3 className="text-md md:text-lg font-semibold text-gray-700">Upcoming Rides</h3>
              <p className="text-2xl md:text-3xl font-bold text-blue-700 mt-2">
                {loading ? (
                  <span className="inline-block h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  upcomingRides
                )}
              </p>
            </div>
            
            <div className="bg-white p-4 md:p-6 shadow rounded-lg">
              <h3 className="text-md md:text-lg font-semibold text-gray-700">Assigned Ambulance</h3>
              <p className="text-2xl md:text-3xl font-bold text-indigo-700 mt-2">
                {loading ? (
                  <span className="inline-block h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  upcomingBookings.length > 0 ? 
                  upcomingBookings[0].ambulanceId?.numberPlate || "N/A" : 
                  "None"
                )}
              </p>
            </div>
            
            <div className="bg-white p-4 md:p-6 shadow rounded-lg">
              <h3 className="text-md md:text-lg font-semibold text-gray-700">Next Ride</h3>
              <p className="text-xl md:text-2xl font-bold text-purple-700 mt-2">
                {loading ? (
                  <span className="inline-block h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  upcomingBookings.length > 0 ? 
                  new Date(upcomingBookings[0].createdAt).toLocaleDateString() : 
                  "None scheduled"
                )}
              </p>
            </div>
          </div>

          {/* Rides Table */}
          <div className="bg-white p-4 md:p-6 shadow rounded-lg">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Ride Schedule</h3>
            
            {loading && upcomingBookings.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : upcomingBookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No upcoming rides found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="p-2 text-left hidden sm:table-cell">ID</th>
                      <th className="p-2 text-left">Patient</th>
                      <th className="p-2 text-left hidden md:table-cell">Contact</th>
                      <th className="p-2 text-left">Destination</th>
                      <th className="p-2 text-left hidden lg:table-cell">Ambulance</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingBookings.map((ride) => (
                      <tr
                        key={ride._id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition"
                      >
                        <td className="p-2 hidden sm:table-cell text-sm text-gray-600">
                          {ride._id.substring(0, 6)}...
                        </td>
                        <td className="p-2">
                          <div className="font-medium text-gray-800">
                            {ride.userId?.name || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500 sm:hidden">
                            {ride._id.substring(0, 6)}...
                          </div>
                        </td>
                        <td className="p-2 hidden md:table-cell text-gray-600">
                          {ride.userId?.phoneNo || "N/A"}
                        </td>
                        <td className="p-2">
                          <div className="font-medium">
                            {ride.dropLocation}
                          </div>
                          <div className="text-xs text-gray-500">
                            From {ride.pickupLocation}
                          </div>
                        </td>
                        <td className="p-2 hidden lg:table-cell text-gray-600">
                          {ride.ambulanceId?.numberPlate || "N/A"}
                        </td>
                        <td className="p-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            ride.status === "Confirmed" 
                              ? "bg-yellow-100 text-yellow-800" 
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {ride.status}
                          </span>
                        </td>
                        <td className="p-2">
                          <button
                            onClick={() =>
                              this.markRideAsComplete(
                                ride._id,
                                ride.ambulanceId?._id
                              )
                            }
                            disabled={updatingStatus === ride._id}
                            className={`px-2 py-1 md:px-3 md:py-1.5 rounded-md text-xs md:text-sm text-white ${
                              updatingStatus === ride._id
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                            } transition flex items-center justify-center`}
                          >
                            {updatingStatus === ride._id ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-1 h-3 w-3 md:h-4 md:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing
                              </>
                            ) : (
                              "Complete"
                            )}
                          </button>
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