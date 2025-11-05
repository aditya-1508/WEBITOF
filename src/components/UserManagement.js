import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { LogOut, Users, ArrowLeft, Plus, Edit, Trash2, Save, X } from 'lucide-react';

const UserManagement = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', email: '', role: 'Client' });
  const [editingUser, setEditingUser] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://webitofbackend-1.onrender.com/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://webitofbackend-1.onrender.com/users', newUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewUser({ username: '', password: '', email: '', role: 'Client' });
      setShowCreateForm(false);
      fetchUsers();
      toast.success('User created successfully!');
    } catch (err) {
      console.error('Error creating user:', err);
      toast.error('Failed to create user. Please try again.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://webitofbackend-1.onrender.com/users/${editingUser._id}`, editingUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingUser(null);
      fetchUsers();
      toast.success('User updated successfully!');
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error('Failed to update user. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://webitofbackend-1.onrender.com/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
        toast.success('User deleted successfully!');
      } catch (err) {
        console.error('Error deleting user:', err);
        toast.error('Failed to delete user. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-[#0E1114] text-gray-200">

      {/* Header */}
      <header className="bg-[#1A1D21] border-b border-gray-700 shadow-lg sticky top-0 z-50">
        <div className="w-full px-10 py-4 flex justify-between items-center">

          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md transition-all">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Link>
            <img
              src="https://cdn-icons-png.flaticon.com/128/9131/9131529.png"
              alt="logo"
              className="w-9 h-9"
            />
            <h1 className="text-xl font-semibold tracking-wide">User Management</h1>
          </div>

          {/* User Info + Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">{user.username}</p>
              <p className="text-xs text-gray-400">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-all shadow-md hover:shadow-lg"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-10 py-10">
        {/* Create User Button */}
        {user.role === 'Admin' && (
          <div className="mb-8">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5" />
              Create New User
            </button>
          </div>
        )}

        {/* Create/Edit Form */}
        {(showCreateForm || editingUser) && user.role === 'Admin' && (
          <div className="mb-8">
            <div className="bg-[#1A1D21] rounded-xl p-6 shadow-lg border border-gray-700">
              <h3 className="text-xl font-semibold text-gray-200 mb-6">
                {editingUser ? 'Edit User' : 'Create New User'}
              </h3>
              <form onSubmit={editingUser ? handleUpdate : handleCreate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                    <input
                      type="text"
                      placeholder="Username"
                      value={editingUser ? editingUser.username : newUser.username}
                      onChange={(e) => editingUser ? setEditingUser({...editingUser, username: e.target.value}) : setNewUser({...newUser, username: e.target.value})}
                      className="w-full px-3 py-2 bg-[#2A2D31] border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  {!editingUser && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                      <input
                        type="password"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        className="w-full px-3 py-2 bg-[#2A2D31] border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="Email"
                      value={editingUser ? editingUser.email : newUser.email}
                      onChange={(e) => editingUser ? setEditingUser({...editingUser, email: e.target.value}) : setNewUser({...newUser, email: e.target.value})}
                      className="w-full px-3 py-2 bg-[#2A2D31] border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                    <select
                      value={editingUser ? editingUser.role : newUser.role}
                      onChange={(e) => editingUser ? setEditingUser({...editingUser, role: e.target.value}) : setNewUser({...newUser, role: e.target.value})}
                      className="w-full px-3 py-2 bg-[#2A2D31] border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Client">Client</option>
                      <option value="Staff">Staff</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
                  >
                    <Save className="w-4 h-4" />
                    {editingUser ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingUser(null);
                      setShowCreateForm(false);
                      setNewUser({ username: '', password: '', email: '', role: 'Client' });
                    }}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-gray-200 rounded-lg transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-[#1A1D21] rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-xl font-semibold text-gray-200">All Users</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#2A2D31]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map(userItem => (
                  <tr key={userItem._id} className="hover:bg-[#2A2D31] transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{userItem.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{userItem.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        userItem.role === 'Admin' ? 'bg-red-900/50 text-red-300' :
                        userItem.role === 'Staff' ? 'bg-blue-900/50 text-blue-300' :
                        'bg-gray-900/50 text-gray-300'
                      }`}>
                        {userItem.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user.role === 'Admin' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingUser(userItem)}
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(userItem._id)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;
