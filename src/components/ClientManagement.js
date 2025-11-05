import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { LogOut, UserCheck, ArrowLeft, Plus, Edit, Trash2, Save, X, Building, MapPin } from 'lucide-react';
import { useClients } from '../contexts/ClientsContext';

const ClientManagement = ({ user, onLogout }) => {
  const { clients, addClient, updateClient, removeClient } = useClients();
  const [staff, setStaff] = useState([]);
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', company: '', address: '', assignedStaff: '' });
  const [editingClient, setEditingClient] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (user.role === 'Admin' || user.role === 'Staff') fetchStaff();
  }, [user]);

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/users/staff', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStaff(response.data);
    } catch (err) {
      console.error('Error fetching staff:', err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await addClient(newClient);
      setNewClient({ name: '', email: '', phone: '', company: '', address: '', assignedStaff: '' });
      setShowCreateForm(false);
      toast.success('✅ Client created successfully');
    } catch {
      toast.error('❌ Could not create client.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateClient(editingClient._id, editingClient);
      setEditingClient(null);
      toast.success('✅ Client updated successfully');
    } catch {
      toast.error('❌ Could not update client.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await removeClient(id);
        toast.success('🗑 Deleted');
      } catch {
        toast.error('❌ Could not delete client.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  return (
    <div className="min-h-screen w-full bg-[#0E1114] text-gray-200">

      {/* Header */}
      <header className="bg-[#1A1D22] border-b border-gray-800 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/" className="px-4 py-2 rounded-md bg-[#272B31] hover:bg-[#32363D] transition flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="text-2xl font-semibold">Client Management</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">{user.username}</p>
            <p className="text-xs text-gray-400">{user.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="px-10 py-10 w-full max-w-screen-2xl mx-auto">

        {/* Create Button */}
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition mb-8 shadow"
        >
          <Plus className="w-5 h-5" /> Add Client
        </button>

        {/* Form Section */}
        {(showCreateForm || editingClient) && (
          <div className="bg-[#1A1D22] border border-gray-700 p-6 rounded-xl mb-10">
            <h3 className="text-lg font-semibold mb-6">{editingClient ? "Edit Client" : "Create Client"}</h3>

            <form onSubmit={editingClient ? handleUpdate : handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Inputs */}
              {[
                { label: "Name", key: "name" },
                { label: "Email", key: "email", type: "email" },
                { label: "Phone", key: "phone" },
                { label: "Company", key: "company" }
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="text-sm text-gray-400">{label}</label>
                  <input
                    type={type || "text"}
                    className="mt-1 w-full bg-[#0E1114] border border-gray-700 rounded-lg px-3 py-2"
                    required={key !== "company"}
                    value={(editingClient ? editingClient[key] : newClient[key])}
                    onChange={(e) =>
                      editingClient
                        ? setEditingClient({ ...editingClient, [key]: e.target.value })
                        : setNewClient({ ...newClient, [key]: e.target.value })
                    }
                  />
                </div>
              ))}

              {/* Address */}
              <div className="md:col-span-2">
                <label className="text-sm text-gray-400">Address</label>
                <input
                  type="text"
                  className="mt-1 w-full bg-[#0E1114] border border-gray-700 rounded-lg px-3 py-2"
                  value={editingClient ? editingClient.address : newClient.address}
                  onChange={(e) =>
                    editingClient
                      ? setEditingClient({ ...editingClient, address: e.target.value })
                      : setNewClient({ ...newClient, address: e.target.value })
                  }
                />
              </div>

              {/* Assigned Staff */}
              {(user.role === "Admin" || user.role === "Staff") && (
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-400">Assigned Staff</label>
                  <select
                    className="mt-1 w-full bg-[#0E1114] border border-gray-700 rounded-lg px-3 py-2"
                    value={editingClient ? editingClient.assignedStaff : newClient.assignedStaff}
                    onChange={(e) =>
                      editingClient
                        ? setEditingClient({ ...editingClient, assignedStaff: e.target.value })
                        : setNewClient({ ...newClient, assignedStaff: e.target.value })
                    }
                  >
                    <option value="">Select Staff</option>
                    {staff.map(s => <option key={s._id} value={s._id}>{s.username}</option>)}
                  </select>
                </div>
              )}

              {/* Buttons */}
              <div className="md:col-span-2 flex gap-4 mt-4">
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2">
                  <Save className="w-4 h-4" /> {editingClient ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center gap-2"
                  onClick={() => { setEditingClient(null); setShowCreateForm(false); }}
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Table */}
        <div className="bg-[#1A1D22] border border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#22262C] text-gray-400 text-sm">
              <tr>
                {["Name", "Email", "Phone", "Company", "Address", "Assigned", "Actions"].map(h => (
                  <th key={h} className="px-6 py-3 text-left uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {clients.map(c => (
                <tr key={c._id} className="hover:bg-[#24282F] transition">
                  <td className="px-6 py-4">{c.name}</td>
                  <td className="px-6 py-4 text-gray-400">{c.email}</td>
                  <td className="px-6 py-4 text-gray-400">{c.phone}</td>
                  <td className="px-6 py-4 text-gray-400">{c.company || "-"}</td>
                  <td className="px-6 py-4 text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.address || "-"}</td>
                  <td className="px-6 py-4 text-gray-400">{c.assignedStaff?.username || "Unassigned"}</td>
                  <td className="px-6 py-4 flex gap-3">
                    <button className="text-blue-400 hover:text-blue-300" onClick={() => setEditingClient(c)}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-500 hover:text-red-400" onClick={() => handleDelete(c._id)}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </main>
    </div>
  );
};

export default ClientManagement;
