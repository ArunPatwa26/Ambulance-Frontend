import React, { Component } from 'react';
import axios from 'axios';
import { FaInfoCircle } from 'react-icons/fa';
import config from '../context/config';

export default class ViewAllBookings extends Component {
  state = {
    bookings: [],
    loading: true,
    selectedBooking: null,
    showDetailsModal: false,
  };

  async componentDidMount() {
    try {
      const { data } = await axios.get(`${config.BASE_URL}api/bookings/`);
      const filteredBookings = data.filter(
        (booking) => booking.status === "Completed" || booking.status === "Canceled"
      );
      this.setState({ bookings: filteredBookings, loading: false });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      this.setState({ loading: false });
    }
  }

  render() {
    const { bookings, loading, selectedBooking, showDetailsModal } = this.state;

    return (
      <div className="min-h-screen bg-gray-100 p-4 lg:ml-65">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
            Completed and Canceled Bookings
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-blue-600 text-lg">Loading bookings...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-2 md:p-3 text-left text-xs md:text-sm text-gray-700 font-semibold">
                      User
                    </th>
                    <th className="p-2 md:p-3 text-left text-xs md:text-sm text-gray-700 font-semibold hidden sm:table-cell">
                      Phone
                    </th>
                    <th className="p-2 md:p-3 text-left text-xs md:text-sm text-gray-700 font-semibold hidden md:table-cell">
                      Email
                    </th>
                    <th className="p-2 md:p-3 text-left text-xs md:text-sm text-gray-700 font-semibold">
                      Pickup
                    </th>
                    <th className="p-2 md:p-3 text-left text-xs md:text-sm text-gray-700 font-semibold hidden lg:table-cell">
                      Drop
                    </th>
                    <th className="p-2 md:p-3 text-left text-xs md:text-sm text-gray-700 font-semibold">
                      Status
                    </th>
                    <th className="p-2 md:p-3 text-left text-xs md:text-sm text-gray-700 font-semibold hidden xl:table-cell">
                      Driver
                    </th>
                    <th className="p-2 md:p-3 text-left text-xs md:text-sm text-gray-700 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center p-4 text-gray-600">
                        No completed or canceled bookings found.
                      </td>
                    </tr>
                  ) : (
                    bookings.map((booking) => (
                      <tr
                        key={booking._id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition duration-200"
                      >
                        <td className="p-2 md:p-3 text-xs md:text-sm text-gray-600">
                          {booking.userId?.name || "N/A"}
                        </td>
                        <td className="p-2 md:p-3 text-xs md:text-sm text-gray-600 hidden sm:table-cell">
                          {booking.userId?.phoneNo || "N/A"}
                        </td>
                        <td className="p-2 md:p-3 text-xs md:text-sm text-gray-600 hidden md:table-cell">
                          {booking.userId?.email || "N/A"}
                        </td>
                        <td className="p-2 md:p-3 text-xs md:text-sm text-gray-600">
                          {booking.pickupLocation?.length > 20
                            ? `${booking.pickupLocation.substring(0, 20)}...`
                            : booking.pickupLocation || "N/A"}
                        </td>
                        <td className="p-2 md:p-3 text-xs md:text-sm text-gray-600 hidden lg:table-cell">
                          {booking.dropLocation?.length > 20
                            ? `${booking.dropLocation.substring(0, 20)}...`
                            : booking.dropLocation || "N/A"}
                        </td>
                        <td className="p-2 md:p-3 text-xs md:text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs md:text-sm font-semibold ${
                              booking.status === "Completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {booking.status || "N/A"}
                          </span>
                        </td>
                        <td className="p-2 md:p-3 text-xs md:text-sm text-gray-600 hidden xl:table-cell">
                          {booking.driverId?.name || "Not Assigned"}
                        </td>
                        <td className="p-2 md:p-3 text-xs md:text-sm">
                          <button
                            onClick={() => this.setState({
                              selectedBooking: booking,
                              showDetailsModal: true
                            })}
                            className="text-blue-500 hover:text-blue-700 transition duration-200 p-1"
                            title="View Details"
                          >
                            <FaInfoCircle size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Booking Details Modal */}
        {showDetailsModal && selectedBooking && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Booking Details
                  </h2>
                  <button
                    onClick={() => this.setState({ showDetailsModal: false })}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      User Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="text-gray-800">
                          {selectedBooking.userId?.name || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-gray-800">
                          {selectedBooking.userId?.phoneNo || "N/A"}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-800">
                          {selectedBooking.userId?.email || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Trip Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Pickup Location</p>
                        <p className="text-gray-800">
                          {selectedBooking.pickupLocation || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Drop Location</p>
                        <p className="text-gray-800">
                          {selectedBooking.dropLocation || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date & Time</p>
                        <p className="text-gray-800">
                          {selectedBooking.dateTime || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Vehicle Type</p>
                        <p className="text-gray-800">
                          {selectedBooking.vehicleType || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Status & Driver
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            selectedBooking.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {selectedBooking.status || "N/A"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Assigned Driver</p>
                        <p className="text-gray-800">
                          {selectedBooking.driverId?.name || "Not Assigned"}
                        </p>
                      </div>
                      {selectedBooking.driverId && (
                        <>
                          <div>
                            <p className="text-sm text-gray-500">Driver Phone</p>
                            <p className="text-gray-800">
                              {selectedBooking.driverId.phoneNo || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Vehicle Number</p>
                            <p className="text-gray-800">
                              {selectedBooking.driverId.vehicleNumber || "N/A"}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => this.setState({ showDetailsModal: false })}
                      className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}