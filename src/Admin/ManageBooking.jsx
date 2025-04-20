import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  FaTrash, 
  FaEye, 
  FaSpinner, 
  FaArrowLeft,
  FaSearch,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaAmbulance
} from "react-icons/fa";
import { Link } from "react-router-dom";
import config from "../context/config";

const ManageBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBookings();
    fetchDrivers();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${config.BASE_URL}api/bookings/`);
      const filteredBookings = data.filter(
        (booking) => booking.status !== "Completed"
      );
      setBookings(filteredBookings);
    } catch (error) {
      toast.error("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}api/ambulance/`);
      const availableAmbulances =
        response.data.ambulances?.filter(
          (item) => item.status === "Available"
        ) || [];

      const formattedDrivers = availableAmbulances.map((item) => ({
        _id: item.driverId?._id || "",
        name: item.driverId?.name || "N/A",
        numberPlate: item.numberPlate || "N/A",
        ambulanceId: item._id || "",
        userId: item.driverId?.userId || "",
        status: item.status || "Available",
      }));

      setDrivers(formattedDrivers);
    } catch (error) {
      toast.error("Failed to load drivers.");
    }
  };

  const updateBooking = async (bookingId, updateData) => {
    setAssigning(bookingId);
    try {
      await axios.put(
        `${config.BASE_URL}api/bookings/${bookingId}`,
        updateData
      );
      toast.success("Booking updated successfully!");
      fetchBookings();
      fetchDrivers();
    } catch (error) {
      toast.error("Failed to update booking.");
    } finally {
      setAssigning(null);
    }
  };

  const assignDriver = async (bookingId, driverId) => {
    const selectedDriver = drivers.find((driver) => driver._id === driverId);
    if (!selectedDriver) return;

    const updateData = {
      assignedDriverId: selectedDriver.userId,
      ambulanceId: selectedDriver.ambulanceId,
      driverId: selectedDriver._id,
      status: "Confirmed",
    };

    try {
      await updateBooking(bookingId, updateData);
      await axios.put(
        `${config.BASE_URL}api/ambulance/${selectedDriver.ambulanceId}`,
        { status: "Assigned" }
      );

      toast.success("Ambulance assigned and booking confirmed!");
    } catch (error) {
      toast.error("Failed to update booking.");
    }
  };

  const deleteBooking = async (bookingId, ambulanceId) => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;

    try {
      await axios.delete(`${config.BASE_URL}api/bookings/${bookingId}`);
      toast.success("Booking deleted successfully!");
      fetchBookings();

      if (ambulanceId) {
        await axios.put(`${config.BASE_URL}api/ambulance/${ambulanceId}`, {
          status: "Available",
        });
        fetchDrivers();
      }
    } catch (error) {
      toast.error("Failed to delete booking.");
    }
  };

  const handleStatusChange = async (bookingId, newStatus, ambulanceId) => {
    await updateBooking(bookingId, { status: newStatus });

    if (newStatus === "Canceled") {
      if (ambulanceId) {
        await axios.put(`${config.BASE_URL}api/ambulance/${ambulanceId}`, {
          status: "Available",
        });
        fetchDrivers();
      }
    }
  };

  const openModal = (booking) => {
    setSelectedBooking(booking);
  };

  const closeModal = () => {
    setSelectedBooking(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      booking.userId?.name?.toLowerCase().includes(searchTermLower) ||
      booking.userId?.phoneNo?.toLowerCase().includes(searchTermLower) ||
      booking.userId?.email?.toLowerCase().includes(searchTermLower) ||
      booking.pickupLocation?.toLowerCase().includes(searchTermLower) ||
      booking.dropLocation?.toLowerCase().includes(searchTermLower) ||
      booking.status?.toLowerCase().includes(searchTermLower) ||
      booking.driverId?.name?.toLowerCase().includes(searchTermLower) ||
      booking.ambulanceId?.numberPlate?.toLowerCase().includes(searchTermLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:ml-64">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="ml-6">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-700">
              Manage Bookings
            </h1>
            <p className="text-gray-600">Manage and assign ambulance bookings</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <Link to="/view-all-bookings" className="w-full sm:w-auto">
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 w-full">
                <FaArrowLeft className="h-4 w-4" />
                <span>All Bookings</span>
              </button>
            </Link>
          </div>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />

        {loading && (
          <div className="flex justify-center items-center py-8">
            <FaSpinner className="animate-spin text-blue-600 text-2xl" />
            <p className="ml-2 text-blue-600">Loading bookings...</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Locations
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-6 text-gray-600">
                      {searchTerm ? "No matching bookings found" : "No bookings found"}
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="hover:bg-gray-50 transition duration-200"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaUser className="flex-shrink-0 h-4 w-4 text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{booking.userId?.name || "N/A"}</p>
                            <p className="text-xs text-gray-500">{booking.userId?.email || "N/A"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaPhone className="flex-shrink-0 h-4 w-4 text-green-500 mr-2" />
                          <p className="text-sm text-gray-900">{booking.userId?.phoneNo || "N/A"}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="flex-shrink-0 h-3 w-3 text-red-500 mr-1" />
                            <p className="text-xs text-gray-500">Pickup: {booking.pickupLocation || "N/A"}</p>
                          </div>
                          <div className="flex items-center mt-1">
                            <FaMapMarkerAlt className="flex-shrink-0 h-3 w-3 text-blue-500 mr-1" />
                            <p className="text-xs text-gray-500">Drop: {booking.dropLocation || "N/A"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {assigning === booking._id ? (
                          <FaSpinner className="animate-spin text-blue-600 mx-auto" />
                        ) : (
                          <select
                            value={booking.status}
                            onChange={(e) =>
                              handleStatusChange(
                                booking._id,
                                e.target.value,
                                booking.ambulanceId?._id
                              )
                            }
                            className={`text-xs border px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(booking.status)}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Canceled">Canceled</option>
                          </select>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {booking.driverId?.name ? (
                          <div className="flex items-center">
                            <FaAmbulance className="flex-shrink-0 h-4 w-4 text-purple-500 mr-2" />
                            <div>
                              <p className="text-xs font-medium">{booking.driverId?.name}</p>
                              <p className="text-xs text-gray-500">{booking.ambulanceId?.numberPlate || "Not Assigned"}</p>
                            </div>
                          </div>
                        ) : (
                          <select
                            className="border px-2 py-1 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs w-full"
                            onChange={(e) => assignDriver(booking._id, e.target.value)}
                          >
                            <option value="">Assign Driver</option>
                            {drivers.map((driver) => (
                              <option key={driver._id} value={driver._id}>
                                {driver.name} ({driver.numberPlate})
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openModal(booking)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition duration-150"
                            title="View"
                          >
                            <FaEye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              deleteBooking(booking._id, booking.ambulanceId?._id)
                            }
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition duration-150"
                            title="Delete"
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
              <div className="flex justify-between items-center border-b border-gray-200 p-4">
                <h2 className="text-xl font-bold text-gray-800">Booking Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition duration-150"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaUser className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{selectedBooking.userId?.name || "N/A"}</h3>
                    <p className="text-sm text-gray-500">Booking #{selectedBooking._id.slice(-6).toUpperCase()}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedBooking.userId?.phoneNo || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedBooking.userId?.email || "N/A"}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Location Information</h4>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="flex-shrink-0 h-4 w-4 text-red-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Pickup Location</p>
                        <p className="text-sm text-gray-500">{selectedBooking.pickupLocation || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="flex-shrink-0 h-4 w-4 text-blue-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Drop Location</p>
                        <p className="text-sm text-gray-500">{selectedBooking.dropLocation || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Booking Status</h4>
                  <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                    <div className={`p-2 rounded-full ${getStatusColor(selectedBooking.status)}`}>
                      <span className="text-xs font-semibold">{selectedBooking.status || "N/A"}</span>
                    </div>
                  </div>
                </div>
                
                {selectedBooking.driverId && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned Driver</h4>
                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <FaUser className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">{selectedBooking.driverId?.name || "Not Assigned"}</p>
                        <p className="text-sm text-gray-500">Ambulance: {selectedBooking.ambulanceId?.numberPlate || "Not Assigned"}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={closeModal}
                  className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBooking;