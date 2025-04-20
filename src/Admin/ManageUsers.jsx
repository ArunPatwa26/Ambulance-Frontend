import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaEye, FaPlus, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../context/config";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [newUserData, setNewUserData] = useState({ 
    name: "", 
    email: "", 
    phoneNo: "", 
    password: "", 
    role: "User" 
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${config.BASE_URL}api/auth/`);
      setUsers(data.users.filter((user) => user.role.toLowerCase() === "user"));
    } catch (error) {
      toast.error("Failed to fetch users.");
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${config.BASE_URL}api/auth/${userId}`);
      toast.success("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user.");
    }
  };

  const createUser = async () => {
    try {
      await axios.post(`${config.BASE_URL}api/auth/register`, newUserData);
      toast.success("User created successfully!");
      setIsCreating(false);
      setNewUserData({ name: "", email: "", phoneNo: "", password: "", role: "User" });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user.");
    }
  };

  const updateUser = async () => {
    try {
      await axios.put(`${config.BASE_URL}api/auth/${editingUser._id}`, editingUser);
      toast.success("User updated successfully!");
      setIsEditing(false);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 lg:ml-65">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4 md:mb-6">
          Manage Users
        </h1>
        <ToastContainer position="top-center" autoClose={3000} />

        {/* Create User Button */}
        <div className="flex justify-end mb-4 md:mb-6">
          <button
            onClick={() => setIsCreating(true)}
            className="px-3 py-1 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center text-sm md:text-base"
          >
            <FaPlus className="mr-1 md:mr-2" /> 
            <span className="hidden sm:inline">Create User</span>
          </button>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Email
                </th>
                <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Phone
                </th>
                <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-600">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition duration-200">
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-900 hidden sm:table-cell">
                      {user.email}
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-900 hidden md:table-cell">
                      {user.phoneNo}
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-900">
                      {user.role}
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-900">
                      <div className="flex justify-center space-x-2 md:space-x-3">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserDetails(true);
                          }}
                          className="text-blue-500 hover:text-blue-700 transition duration-300 p-1"
                          title="View"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => {
                            setEditingUser({...user});
                            setIsEditing(true);
                          }}
                          className="text-green-500 hover:text-green-700 transition duration-300 p-1"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="text-red-500 hover:text-red-700 transition duration-300 p-1"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* User Details Modal */}
        {showUserDetails && selectedUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-blue-700">User Details</h2>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-gray-900">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">{selectedUser.phoneNo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Role</p>
                  <p className="text-gray-900">{selectedUser.role}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create User Modal */}
        {isCreating && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-blue-700">Create User</h2>
                <button
                  onClick={() => setIsCreating(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={newUserData.name}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, name: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUserData.email}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, email: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="Phone No"
                    value={newUserData.phoneNo}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, phoneNo: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Password"
                    value={newUserData.password}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, password: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={newUserData.role}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, role: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createUser}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {isEditing && editingUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-blue-700">Edit User</h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, name: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editingUser.email}
                    disabled
                    className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editingUser.phoneNo}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, phoneNo: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={editingUser.role}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, role: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateUser}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;