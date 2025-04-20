import React, { Component } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaSpinner
} from 'react-icons/fa';
import config from '../context/config';

export default class ManageDriver extends Component {
  state = {
    drivers: [],
    name: '',
    email: '',
    phoneNo: '',
    password: '',
    editMode: false,
    editDriverId: null,
    isModalOpen: false,
    modalType: '', // 'add', 'edit', or 'view'
    selectedDriver: null,
    loading: false,
    searchTerm: '',
  };

  componentDidMount() {
    this.fetchDrivers();
  }

  fetchDrivers = async () => {
    this.setState({ loading: true });
    try {
      const res = await axios.get(`${config.BASE_URL}api/auth/drivers`);
      this.setState({ drivers: res.data.drivers || [] });
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast.error('Failed to load drivers');
    } finally {
      this.setState({ loading: false });
    }
  };

  openModal = (type, driver = null) => {
    if (type === 'edit' || type === 'view') {
      this.setState({
        name: driver?.name || '',
        email: driver?.email || '',
        phoneNo: driver?.phoneNo || '',
        editMode: type === 'edit',
        editDriverId: driver?._id || null,
        modalType: type,
        selectedDriver: driver,
      });
    } else {
      this.setState({ 
        name: '', 
        email: '', 
        phoneNo: '', 
        password: '', 
        editMode: false, 
        editDriverId: null, 
        modalType: 'add' 
      });
    }
    this.setState({ isModalOpen: true });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false, modalType: '', selectedDriver: null });
  };

  addOrUpdateDriver = async (e) => {
    e.preventDefault();
    const { name, email, phoneNo, password, editMode, editDriverId } = this.state;

    try {
      this.setState({ loading: true });
      if (editMode) {
        await axios.put(`${config.BASE_URL}api/auth/${editDriverId}`, { 
          name, 
          email, 
          phoneNo, 
          role: 'Driver' 
        });
        toast.success('Driver updated successfully!');
      } else {
        await axios.post(`${config.BASE_URL}api/auth/register`, { 
          name, 
          email, 
          phoneNo, 
          password, 
          role: 'Driver' 
        });
        toast.success('Driver added successfully!');
      }
      this.closeModal();
      this.fetchDrivers();
    } catch (error) {
      console.error('Error adding/updating driver:', error);
      toast.error(error.response?.data?.message || 'Something went wrong!');
    } finally {
      this.setState({ loading: false });
    }
  };

  deleteDriver = async (id) => {
    if (!window.confirm('Are you sure you want to delete this driver?')) return;

    try {
      this.setState({ loading: true });
      await axios.delete(`${config.BASE_URL}api/auth/${id}`);
      toast.success('Driver deleted successfully!');
      this.fetchDrivers();
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast.error('Failed to delete driver!');
    } finally {
      this.setState({ loading: false });
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  getFilteredDrivers = () => {
    const { drivers, searchTerm } = this.state;
    if (!searchTerm) return drivers;

    const term = searchTerm.toLowerCase();
    return drivers.filter(driver => 
      driver.name.toLowerCase().includes(term) ||
      driver.email.toLowerCase().includes(term) ||
      driver.phoneNo.toLowerCase().includes(term)
    );
  };

  render() {
    const { 
      isModalOpen, 
      modalType, 
      selectedDriver, 
      name, 
      email, 
      phoneNo, 
      password, 
      editMode, 
      loading,
      searchTerm 
    } = this.state;

    const filteredDrivers = this.getFilteredDrivers();

    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:ml-64">
        <div className="max-w-6xl mx-auto">
          <ToastContainer position="top-right" autoClose={3000} />
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manage Drivers</h1>
              <p className="text-gray-600">Add, edit, and manage driver accounts</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {/* <FaSearch className="text-gray-400" /> */}
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search drivers..."
                  value={searchTerm}
                  onChange={(e) => this.setState({ searchTerm: e.target.value })}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
              </div>
              
              <button 
                onClick={() => this.openModal('add')} 
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                <FaPlus className="h-4 w-4" />
                <span>Add Driver</span>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <FaSpinner className="animate-spin text-blue-600 text-2xl" />
              <p className="ml-2 text-blue-600">Loading drivers...</p>
            </div>
          )}

          {/* Drivers Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDrivers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center p-6 text-gray-600">
                        {searchTerm ? "No matching drivers found" : "No drivers found"}
                      </td>
                    </tr>
                  ) : (
                    filteredDrivers.map(driver => (
                      <tr key={driver._id} className="hover:bg-gray-50 transition duration-200">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaUser className="flex-shrink-0 h-4 w-4 text-blue-500 mr-2" />
                            <span className="text-sm font-medium text-gray-900">{driver.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {driver.email}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {driver.phoneNo}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => this.openModal('view', driver)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition duration-150"
                              title="View"
                            >
                              <FaEye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => this.openModal('edit', driver)}
                              className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-50 transition duration-150"
                              title="Edit"
                            >
                              <FaEdit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => this.deleteDriver(driver._id)}
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
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
              <div className="flex justify-between items-center border-b border-gray-200 p-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {modalType === 'view' 
                    ? 'Driver Details' 
                    : editMode 
                      ? 'Edit Driver' 
                      : 'Add Driver'}
                </h2>
                <button
                  onClick={this.closeModal}
                  className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition duration-150"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
              
              {modalType === 'view' ? (
                <div className="p-4 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaUser className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{selectedDriver.name}</h3>
                      <p className="text-sm text-gray-500">Driver Details</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaEnvelope className="flex-shrink-0 h-4 w-4 text-gray-500 mr-2" />
                      <p className="text-sm text-gray-700">{selectedDriver.email}</p>
                    </div>
                    <div className="flex items-center">
                      <FaPhone className="flex-shrink-0 h-4 w-4 text-gray-500 mr-2" />
                      <p className="text-sm text-gray-700">{selectedDriver.phoneNo}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={this.addOrUpdateDriver} className="p-4 space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input 
                      type="text" 
                      id="name"
                      name="name" 
                      placeholder="Driver name" 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      onChange={this.handleChange} 
                      value={name} 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input 
                      type="email" 
                      id="email"
                      name="email" 
                      placeholder="Driver email" 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      onChange={this.handleChange} 
                      value={email} 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input 
                      type="text" 
                      id="phoneNo"
                      name="phoneNo" 
                      placeholder="Phone number" 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      onChange={this.handleChange} 
                      value={phoneNo} 
                      required 
                    />
                  </div>
                  
                  {!editMode && (
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password *
                      </label>
                      <input 
                        type="password" 
                        id="password"
                        name="password" 
                        placeholder="Password" 
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        onChange={this.handleChange} 
                        value={password} 
                        required 
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={this.closeModal}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit" 
                      className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                      disabled={loading}
                    >
                      {loading ? (
                        <FaSpinner className="animate-spin mr-2" />
                      ) : null}
                      {editMode ? "Update Driver" : "Add Driver"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}