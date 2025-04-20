import React, { Component } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from "chart.js";
import { ClipLoader } from "react-spinners";
import { 
  Users, 
  UserCog, 
  Ambulance, 
  CalendarCheck, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  Activity,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import config from "../context/config";

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
);

export default class AdminDashboard extends Component {
  state = {
    totalUsers: 0,
    totalDrivers: 0,
    totalAmbulances: 0,
    totalAssignedAmbulances: 0,
    totalAvailableAmbulances: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    canceledBookings: 0,
    pendingBookings: 0,
    monthlyBookingsData: [],
    weeklyBookingsData: [],
    loading: true,
    error: null,
    activeTab: "overview",
    timeRange: "monthly"
  };

  async componentDidMount() {
    try {
      const [
        usersResponse, 
        driversResponse, 
        ambulancesResponse, 
        bookingsResponse
      ] = await Promise.all([
        axios.get(`${config.BASE_URL}api/auth/`),
        axios.get(`${config.BASE_URL}api/auth/drivers`),
        axios.get(`${config.BASE_URL}api/ambulance/`),
        axios.get(`${config.BASE_URL}api/bookings/`)
      ]);

      // Process data
      const users = usersResponse.data.users.filter(user => user.role === "User").length;
      const drivers = driversResponse.data.drivers.length;
      const ambulances = ambulancesResponse.data.ambulances;
      const assignedAmbulances = ambulances.filter(ambulance => ambulance.status === "Assigned").length;
      const availableAmbulances = ambulances.length - assignedAmbulances;
      const bookings = bookingsResponse.data;
      
      // Booking status counts
      const bookingStatusCounts = bookings.reduce((acc, booking) => {
        acc[booking.status] = (acc[booking.status] || 0) + 1;
        return acc;
      }, {});

      // Monthly bookings
      const monthlyBookings = Array(12).fill(0);
      bookings.forEach((booking) => {
        const month = new Date(booking.createdAt).getMonth();
        monthlyBookings[month]++;
      });

      // Weekly bookings (last 4 weeks)
      const weeklyBookings = Array(4).fill(0);
      const now = new Date();
      bookings.forEach((booking) => {
        const bookingDate = new Date(booking.createdAt);
        const diffInDays = Math.floor((now - bookingDate) / (1000 * 60 * 60 * 24));
        if (diffInDays <= 28) {
          const week = Math.floor(diffInDays / 7);
          if (week >= 0 && week < 4) {
            weeklyBookings[3 - week]++;
          }
        }
      });

      this.setState({
        totalUsers: users,
        totalDrivers: drivers,
        totalAmbulances: ambulances.length,
        totalAssignedAmbulances: assignedAmbulances,
        totalAvailableAmbulances: availableAmbulances,
        totalBookings: bookings.length,
        confirmedBookings: bookingStatusCounts.Confirmed || 0,
        completedBookings: bookingStatusCounts.Completed || 0,
        canceledBookings: bookingStatusCounts.Canceled || 0,
        pendingBookings: bookingStatusCounts.Pending || 0,
        monthlyBookingsData: monthlyBookings,
        weeklyBookingsData: weeklyBookings,
        loading: false
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      this.setState({ 
        loading: false,
        error: "Failed to load dashboard data. Please try again later."
      });
    }
  }

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab });
  };

  handleTimeRangeChange = (range) => {
    this.setState({ timeRange: range });
  };

  render() {
    const { 
      loading, 
      error,
      totalUsers, 
      totalDrivers, 
      totalAmbulances, 
      totalAssignedAmbulances, 
      totalAvailableAmbulances, 
      totalBookings, 
      confirmedBookings, 
      completedBookings, 
      canceledBookings,
      pendingBookings,
      monthlyBookingsData,
      weeklyBookingsData,
      activeTab,
      timeRange
    } = this.state;

    // Chart data and options
    const bookingChartData = {
      monthly: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        data: monthlyBookingsData
      },
      weekly: {
        labels: ["3 weeks ago", "2 weeks ago", "Last week", "This week"],
        data: weeklyBookingsData
      }
    };

    const chartData = {
      labels: bookingChartData[timeRange].labels,
      datasets: [
        {
          label: "Bookings",
          data: bookingChartData[timeRange].data,
          borderColor: "#3B82F6",
          backgroundColor: timeRange === "weekly" ? "rgba(59, 130, 246, 0.7)" : "rgba(59, 130, 246, 0.1)",
          fill: timeRange !== "weekly",
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 5,
          pointBackgroundColor: "#3B82F6",
          pointHoverRadius: 7,
          ...(timeRange === "weekly" && { type: 'bar' })
        },
      ],
    };
    
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 12
          },
          padding: 12,
          cornerRadius: 8
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 12
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(229, 231, 235, 0.5)'
          },
          ticks: {
            font: {
              size: 12
            },
            stepSize: 1
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <main className="flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 lg:ml-64">
          {/* Header */}
          <div className="mb-6 md:mb-8 mt-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Monitor your emergency management system</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`px-4 py-2 font-medium text-sm flex items-center ${activeTab === "overview" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => this.handleTabChange("overview")}
            >
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm flex items-center ${activeTab === "analytics" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => this.handleTabChange("analytics")}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm flex items-center ${activeTab === "alerts" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => this.handleTabChange("alerts")}
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Alerts
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <ClipLoader color="#3B82F6" size={60} />
              <p className="mt-4 text-gray-600 text-lg">Loading dashboard data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard 
                  title="Total Users" 
                  value={totalUsers} 
                  icon={<Users className="h-5 w-5" />}
                  color="blue"
                  trend="up"
                  percentage="12%"
                />
                <StatCard 
                  title="Total Drivers" 
                  value={totalDrivers} 
                  icon={<UserCog className="h-5 w-5" />}
                  color="green"
                  trend="up"
                  percentage="8%"
                />
                <StatCard 
                  title="Total Ambulances" 
                  value={totalAmbulances} 
                  icon={<Ambulance className="h-5 w-5" />}
                  color="purple"
                  trend="neutral"
                />
                <StatCard 
                  title="Total Bookings" 
                  value={totalBookings} 
                  icon={<CalendarCheck className="h-5 w-5" />}
                  color="orange"
                  trend="up"
                  percentage="24%"
                />
              </div>

              {/* Ambulance Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <StatCard 
                  title="Available Ambulances" 
                  value={totalAvailableAmbulances} 
                  icon={<CheckCircle className="h-5 w-5" />}
                  color="green"
                />
                <StatCard 
                  title="Assigned Ambulances" 
                  value={totalAssignedAmbulances} 
                  icon={<AlertTriangle className="h-5 w-5" />}
                  color="yellow"
                />
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-500 mb-4 flex items-center">
                    <Ambulance className="h-4 w-4 mr-2" />
                    Ambulance Status
                  </h3>
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{totalAvailableAmbulances}</div>
                      <div className="text-xs text-gray-500 mt-1">Available</div>
                    </div>
                    <div className="h-10 w-px bg-gray-200 mx-2"></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{totalAssignedAmbulances}</div>
                      <div className="text-xs text-gray-500 mt-1">Assigned</div>
                    </div>
                    <div className="h-10 w-px bg-gray-200 mx-2"></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">{totalAmbulances}</div>
                      <div className="text-xs text-gray-500 mt-1">Total</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bookings Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard 
                  title="Pending Bookings" 
                  value={pendingBookings} 
                  icon={<Clock className="h-5 w-5" />}
                  color="gray"
                />
                <StatCard 
                  title="Confirmed Bookings" 
                  value={confirmedBookings} 
                  icon={<CheckCircle className="h-5 w-5" />}
                  color="blue"
                />
                <StatCard 
                  title="Completed Bookings" 
                  value={completedBookings} 
                  icon={<CalendarCheck className="h-5 w-5" />}
                  color="green"
                />
                <StatCard 
                  title="Canceled Bookings" 
                  value={canceledBookings} 
                  icon={<XCircle className="h-5 w-5" />}
                  color="red"
                />
              </div>

              {/* Chart Section */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {timeRange === "monthly" ? "Monthly" : "Weekly"} Bookings Trend
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => this.handleTimeRangeChange("weekly")}
                      className={`px-3 py-1 text-sm rounded-md ${timeRange === "weekly" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                      Weekly
                    </button>
                    <button
                      onClick={() => this.handleTimeRangeChange("monthly")}
                      className={`px-3 py-1 text-sm rounded-md ${timeRange === "monthly" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>
                <div className="h-80">
                  {timeRange === "weekly" ? (
                    <Bar data={chartData} options={chartOptions} />
                  ) : (
                    <Line data={chartData} options={chartOptions} />
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Utilization Rate</h3>
                  <div className="text-2xl font-bold text-blue-600">
                    {totalAmbulances > 0 
                      ? `${Math.round((totalAssignedAmbulances / totalAmbulances) * 100)}%` 
                      : '0%'}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{
                        width: `${totalAmbulances > 0 
                          ? (totalAssignedAmbulances / totalAmbulances) * 100 
                          : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Completion Rate</h3>
                  <div className="text-2xl font-bold text-green-600">
                    {totalBookings > 0 
                      ? `${Math.round((completedBookings / totalBookings) * 100)}%` 
                      : '0%'}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{
                        width: `${totalBookings > 0 
                          ? (completedBookings / totalBookings) * 100 
                          : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Cancellation Rate</h3>
                  <div className="text-2xl font-bold text-red-600">
                    {totalBookings > 0 
                      ? `${Math.round((canceledBookings / totalBookings) * 100)}%` 
                      : '0%'}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                    <div 
                      className="bg-red-600 h-2.5 rounded-full" 
                      style={{
                        width: `${totalBookings > 0 
                          ? (canceledBookings / totalBookings) * 100 
                          : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    );
  }
}

// Enhanced StatCard component with trend indicator
const StatCard = ({ title, value, icon, color, trend, percentage }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      iconBg: 'bg-blue-100'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      iconBg: 'bg-green-100'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      iconBg: 'bg-purple-100'
    },
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      iconBg: 'bg-orange-100'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      iconBg: 'bg-red-100'
    },
    yellow: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
      iconBg: 'bg-yellow-100'
    },
    gray: {
      bg: 'bg-gray-50',
      text: 'text-gray-600',
      iconBg: 'bg-gray-100'
    }
  };

  const trendIcons = {
    up: (
      <span className="flex items-center text-green-500 text-xs">
        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        {percentage}
      </span>
    ),
    down: (
      <span className="flex items-center text-red-500 text-xs">
        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
        {percentage}
      </span>
    ),
    neutral: (
      <span className="flex items-center text-gray-500 text-xs">
        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
        </svg>
        -
      </span>
    )
  };

  return (
    <div className={`${colorClasses[color].bg} p-5 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md`}>
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
        <div className={`${colorClasses[color].iconBg} p-2 rounded-lg`}>
          {React.cloneElement(icon, { className: `h-4 w-4 ${colorClasses[color].text}` })}
        </div>
      </div>
      <div className={`mt-2 text-2xl font-bold ${colorClasses[color].text}`}>{value}</div>
      {trend && (
        <div className="mt-1">
          {trendIcons[trend]}
        </div>
      )}
    </div>
  );
};