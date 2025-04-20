import React, { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import { Link } from 'react-router-dom';
import config from '../context/config';

const UserBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [userId, setUserId] = useState(null);
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const { addNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    const userData = JSON.parse(localStorage.getItem('userdata'));
    if (userData && userData.id) {
      setUserId(userData.id);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBookings(userId);
    }
  }, [userId]);

  const fetchBookings = async (userId) => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${config.BASE_URL}api/bookings/${userId}`);
      const bookings = await response.json();

      const confirmedBookings = bookings.filter(
        (booking) => booking.status === 'Confirmed' && booking.userId._id === userId
      );
      setBookings(confirmedBookings);

      if (confirmedBookings.length > 0) {
        handleBookingNotification();
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingNotification = () => {
    addNotification('You have confirmed bookings!');
  };

  const handleDeleteBooking = async (bookingId, ambulanceId) => {
    try {
      const response = await fetch(`${config.BASE_URL}api/bookings/${bookingId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await updateAmbulanceStatus(ambulanceId);
        setBookings(bookings.filter((booking) => booking._id !== bookingId));
        addNotification('Booking deleted successfully!');
      } else {
        addNotification('Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      addNotification('Error deleting booking');
    }
  };

  const updateAmbulanceStatus = async (ambulanceId) => {
    try {
      const response = await fetch(`${config.BASE_URL}api/ambulance/${ambulanceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Available' }),
      });
      if (!response.ok) {
        throw new Error('Failed to update ambulance status');
      }
    } catch (error) {
      console.error('Error updating ambulance status:', error);
    }
  };

  const toggleBookingDetails = (bookingId) => {
    setExpandedBookingId(expandedBookingId === bookingId ? null : bookingId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Your Ambulance Bookings
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600">
            {bookings.length > 0 
              ? 'Manage your active ambulance bookings' 
              : 'No active bookings found. Book an ambulance when you need emergency care.'}
          </p>
          
          <div className="mt-8 flex justify-center space-x-4">
            <Link
              to="/book-ambulance"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-md"
            >
              <svg
                className="-ml-1 mr-3 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Book New Ambulance
            </Link>
            
            <Link
              to="/allbookings"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-md"
            >
              <svg
                className="-ml-1 mr-3 h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              View All Bookings
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            <span className="ml-4 text-lg text-gray-600">Loading your bookings...</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && bookings.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm max-w-2xl mx-auto">
            <svg
              className="mx-auto h-24 w-24 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-6 text-2xl font-medium text-gray-900">No active bookings</h3>
            <p className="mt-3 text-lg text-gray-500">
              You don't have any confirmed ambulance bookings at this time.
            </p>
            <div className="mt-8">
              <Link
                to="/book-ambulance"
                className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform hover:scale-105"
              >
                <svg
                  className="-ml-1 mr-3 h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Book an Ambulance Now
              </Link>
            </div>
          </div>
        )}

        {/* Bookings Grid */}
        {!isLoading && bookings.length > 0 && (
          <div className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white overflow-hidden shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Status Header */}
                  <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white text-blue-600">
                        {booking.status}
                      </span>
                      <span className="ml-3 text-sm font-medium text-blue-100">
                        Booking ID: {booking._id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteBooking(booking._id, booking.ambulanceId._id)}
                      className="text-blue-100 hover:text-white transition-colors duration-200"
                      title="Cancel Booking"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Content */}
                  <div className="px-6 py-5">
                    {/* Emergency Info */}
                    <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-8 w-8 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Emergency Contact
                          </h3>
                          <div className="mt-2 text-sm text-gray-700">
                            <p className="font-medium">Call Driver: {booking.driverId.phoneNo}</p>
                            <p className="mt-1 text-xs text-gray-500">
                              For immediate assistance, contact the driver directly
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ambulance Card */}
                    <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-8 w-8 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Ambulance Details
                          </h3>
                          <div className="mt-2 text-sm text-gray-700 space-y-1">
                            <p>
                              <span className="font-medium">Type:</span> {booking.ambulanceId.type}
                            </p>
                            <p>
                              <span className="font-medium">Plate:</span> {booking.ambulanceId.numberPlate}
                            </p>
                            <p>
                              <span className="font-medium">Facilities:</span> Oxygen, First Aid, Stretcher
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Driver Card */}
                    <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-8 w-8 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Driver Details
                          </h3>
                          <div className="mt-2 text-sm text-gray-700 space-y-1">
                            <p>
                              <span className="font-medium">Name:</span> {booking.driverId.name}
                            </p>
                            <p>
                              <span className="font-medium">Phone:</span> {booking.driverId.phoneNo}
                            </p>
                            <p>
                              <span className="font-medium">Experience:</span> 5+ years
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Show More Button */}
                    <button
                      onClick={() => toggleBookingDetails(booking._id)}
                      className="w-full flex items-center justify-between px-5 py-3 border border-gray-200 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      <span className="font-medium">
                        {expandedBookingId === booking._id ? 'Hide Details' : 'Show More Details'}
                      </span>
                      <svg
                        className={`ml-2 h-5 w-5 text-gray-500 transform transition-transform ${expandedBookingId === booking._id ? 'rotate-180' : ''}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {/* Expanded Details */}
                    {expandedBookingId === booking._id && (
                      <div className="mt-6 space-y-4">
                        {/* Booking Time */}
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <svg
                                className="h-6 w-6 text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-gray-900">Booking Time</h4>
                              <p className="mt-1 text-sm text-gray-700">
                                {new Date(booking.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Pickup Location */}
                        <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <svg
                                className="h-6 w-6 text-purple-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-gray-900">Pickup Location</h4>
                              <p className="mt-1 text-sm text-gray-700">{booking.pickupLocation}</p>
                            </div>
                          </div>
                        </div>

                        {/* Drop Location */}
                        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <svg
                                className="h-6 w-6 text-indigo-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                                />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-gray-900">Drop Location</h4>
                              <p className="mt-1 text-sm text-gray-700">{booking.dropLocation}</p>
                            </div>
                          </div>
                        </div>

                        {/* Estimated Time */}
                        <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <svg
                                className="h-6 w-6 text-yellow-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-gray-900">Estimated Arrival</h4>
                              <p className="mt-1 text-sm text-gray-700">8-12 minutes</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* View All Bookings Button */}
            <div className="mt-12 text-center">
              <Link
                to="/allbookings"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                View Complete Booking History
                <svg
                  className="ml-3 -mr-1 h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBooking;