import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  PlusCircle, 
  Edit, 
  Eye, 
  Trash2, 
  X, 
  Check, 
  Ambulance,
  User,
  Shield,
  AlertCircle
} from "lucide-react";
import { ClipLoader } from "react-spinners";
import config from "../context/config";

const ManageAmbulance = () => {
  const [ambulances, setAmbulances] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState({ 
    numberPlate: "", 
    type: "Basic", 
    status: "Available", 
    driverId: "" 
  });
  const [editId, setEditId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchAmbulances();
    fetchDrivers();
  }, []);

  const fetchAmbulances = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${config.BASE_URL}api/ambulance`);
      setAmbulances(res.data.ambulances || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching ambulances", err);
      setError("Failed to fetch ambulances. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await axios.get(`${config.BASE_URL}api/auth/drivers`);
      setDrivers(res.data.drivers || []);
    } catch (err) {
      console.error("Error fetching drivers", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editId) {
        await axios.put(`${config.BASE_URL}api/ambulance/${editId}`, form);
      } else {
        await axios.post(`${config.BASE_URL}api/ambulance`, form);
      }
      await fetchAmbulances();
      closeModal();
    } catch (err) {
      console.error("Error saving ambulance", err);
      setError("Failed to save ambulance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (ambulance = null) => {
    if (ambulance) {
      setForm({
        numberPlate: ambulance.numberPlate || "",
        type: ambulance.type || "Basic",
        status: ambulance.status || "Available",
        driverId: ambulance.driverId ? ambulance.driverId._id : "",
      });
      setEditId(ambulance._id);
    } else {
      setForm({ numberPlate: "", type: "Basic", status: "Available", driverId: "" });
      setEditId(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditId(null);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${config.BASE_URL}api/ambulance/${id}`);
      await fetchAmbulances();
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting ambulance", err);
      setError("Failed to delete ambulance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openViewModal = (ambulance) => {
    setViewData(ambulance);
  };

  const closeViewModal = () => {
    setViewData(null);
  };

  const filteredAmbulances = ambulances.filter(ambulance =>
    ambulance.numberPlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ambulance.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ambulance.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ambulance.driverId && ambulance.driverId.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800";
      case "Assigned":
        return "bg-blue-100 text-blue-800";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className=" bg-gray-50 min-h-screen flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 lg:ml-64">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 ml-9">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Ambulance Management</h2>
            <p className="text-gray-600">Manage your ambulance fleet efficiently</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Add New Ambulance</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search ambulances..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="flex justify-center items-center py-12">
            <ClipLoader color="#3B82F6" size={50} />
          </div>
        )}

        {/* Ambulance Table */}
        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Number Plate
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Driver
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAmbulances.length > 0 ? (
                    filteredAmbulances.map((amb) => (
                      <tr key={amb._id} className="hover:bg-gray-50 transition duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Ambulance className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2" />
                            <span className="text-sm font-medium text-gray-900">{amb.numberPlate}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {amb.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(amb.status)}`}>
                            {amb.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {amb.driverId ? (
                              <>
                                <User className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-500">{amb.driverId.name}</span>
                              </>
                            ) : (
                              <span className="text-sm text-gray-400">Not Assigned</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => openModal(amb)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition duration-150"
                              title="Edit"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => openViewModal(amb)}
                              className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50 transition duration-150"
                              title="View"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(amb._id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition duration-150"
                              title="Delete"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No ambulances found {searchTerm && `matching "${searchTerm}"`}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b border-gray-200 p-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editId ? "Edit Ambulance" : "Add New Ambulance"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition duration-150"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label htmlFor="numberPlate" className="block text-sm font-medium text-gray-700 mb-1">
                  Number Plate *
                </label>
                <input
                  type="text"
                  id="numberPlate"
                  name="numberPlate"
                  value={form.numberPlate}
                  onChange={handleChange}
                  placeholder="e.g. ABC123"
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Basic">Basic</option>
                  <option value="Advanced">Advanced</option>
                  <option value="ICU">ICU</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Available">Available</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="driverId" className="block text-sm font-medium text-gray-700 mb-1">
                  Assign Driver
                </label>
                <select
                  id="driverId"
                  name="driverId"
                  value={form.driverId}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Driver</option>
                  {drivers.map((driver) => (
                    <option key={driver._id} value={driver._id}>
                      {driver.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <ClipLoader color="#ffffff" size={20} />
                  ) : (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      {editId ? "Update" : "Save"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b border-gray-200 p-4">
              <h2 className="text-xl font-bold text-gray-800">Ambulance Details</h2>
              <button
                onClick={closeViewModal}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition duration-150"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Ambulance className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{viewData.numberPlate}</h3>
                  <p className="text-sm text-gray-500">Ambulance</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{viewData.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(viewData.status)}`}>
                    {viewData.status}
                  </span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Driver Information</h4>
                {viewData.driverId ? (
                  <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <User className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">{viewData.driverId.name}</p>
                      <p className="text-sm text-gray-500">Assigned Driver</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                    <div className="bg-gray-200 p-2 rounded-full">
                      <Shield className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">No driver assigned</p>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={closeViewModal}
                className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-4">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Delete Ambulance</h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                Are you sure you want to delete this ambulance? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <ClipLoader color="#ffffff" size={20} />
                  ) : (
                    <>
                      <Trash2 className="h-5 w-5 mr-2" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAmbulance;