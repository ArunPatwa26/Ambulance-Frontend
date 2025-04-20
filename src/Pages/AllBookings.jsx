import React, { Component } from 'react';
import config from '../context/config';

export default class AllBookings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
      userId: '',
      isLoading: true,
      error: null
    };
  }

  componentDidMount() {
    const userData = JSON.parse(localStorage.getItem('userdata'));
    if (userData && userData.id) {
      this.setState({ userId: userData.id }, () => {
        this.fetchAllBookings(userData.id);
      });
    } else {
      this.setState({ 
        error: 'User not authenticated. Please login again.',
        isLoading: false 
      });
    }
  }

  fetchAllBookings = async (userId) => {
    try {
      const response = await fetch(`${config.BASE_URL}api/bookings/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await response.json();
      const completedBookings = data.filter((booking) => booking.status === 'Completed');
      this.setState({ 
        bookings: completedBookings,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      this.setState({ 
        error: error.message,
        isLoading: false 
      });
    }
  };

  formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  render() {
    const { bookings, isLoading, error } = this.state;

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Booking History
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {bookings.length > 0 
                ? 'Review your completed ambulance bookings' 
                : 'Your completed bookings will appear here'}
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              <span className="ml-4 text-lg text-gray-600">Loading your bookings...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading bookings</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && bookings.length === 0 && (
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
              <h3 className="mt-6 text-2xl font-medium text-gray-900">No completed bookings yet</h3>
              <p className="mt-3 text-lg text-gray-500">
                Your completed ambulance bookings will appear here when available.
              </p>
            </div>
          )}

          {/* Bookings Grid */}
          {!isLoading && !error && bookings.length > 0 && (
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white overflow-hidden shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Booking Header */}
                  <div className="px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-700">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-white">
                        Booking #{booking._id.slice(-6).toUpperCase()}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {booking.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-300">
                      {this.formatDate(booking.createdAt)}
                    </p>
                  </div>

                  {/* Booking Content */}
                  <div className="px-6 py-5">
                    {/* Ambulance Card */}
                    <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-6 w-6 text-blue-500"
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
                        <div className="ml-3">
                          <h4 className="text-base font-medium text-gray-900">Ambulance Details</h4>
                          <div className="mt-2 text-sm text-gray-700 space-y-1">
                            <p><span className="font-medium">Type:</span> {booking.ambulanceId.type}</p>
                            <p><span className="font-medium">Plate:</span> {booking.ambulanceId.numberPlate}</p>
                            <p><span className="font-medium">Facilities:</span> Oxygen, First Aid</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Driver Card */}
                    <div className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h4 className="text-base font-medium text-gray-900">Driver Details</h4>
                          <div className="mt-2 text-sm text-gray-700 space-y-1">
                            <p><span className="font-medium">Name:</span> {booking.driverId.name}</p>
                            <p>
                              <span className="font-medium">Phone:</span>{' '}
                              <a 
                                href={`tel:${booking.driverId.phoneNo}`} 
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                {booking.driverId.phoneNo}
                              </a>
                            </p>
                            <p><span className="font-medium">Experience:</span> 5+ years</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Locations Section */}
                    <div className="space-y-4">
                      {/* Pickup Location */}
                      <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-6 w-6 text-green-500"
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
                      <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-6 w-6 text-red-500"
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}