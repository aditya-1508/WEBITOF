import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  LogOut,
  FileText,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  UserCheck,
} from "lucide-react";

const LeadManagement = ({ user, onLogout }) => {
  const [leads, setLeads] = useState([]);
  const [staff, setStaff] = useState([]);
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    stage: "New",
    notes: "",
    assignedStaff: "",
  });
  const [editingLead, setEditingLead] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchLeads();
    if (user.role === "Admin" || user.role === "Staff") fetchStaff();
  }, [user]);

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://webitofbackend-1.onrender.com/users/staff", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaff(res.data);
    } catch {}
  };

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://webitofbackend-1.onrender.com/leads", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(res.data);
    } catch {}
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("https://webitofbackend-1.onrender.com/leads", newLead, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewLead({ name: "", email: "", phone: "", stage: "New", notes: "", assignedStaff: "" });
      setShowCreateForm(false);
      fetchLeads();
      toast.success("✅ Lead created successfully");
    } catch {
      toast.error("❌ Could not create lead");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`https://webitofbackend-1.onrender.com/leads/${editingLead._id}`, editingLead, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingLead(null);
      fetchLeads();
      toast.success("✅ Updated");
    } catch {
      toast.error("❌ Could not update");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://webitofbackend-1.onrender.com/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLeads();
      toast.success("🗑 Deleted");
    } catch {
      toast.error("❌ Could not delete");
    }
  };

  const handleConvert = async (id) => {
    if (!window.confirm("Convert to client?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(`https://webitofbackend-1.onrender.com/${id}/convert`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLeads();
      toast.success("✅ Converted to client");
    } catch {
      toast.error("❌ Conversion failed");
    }
  };

  const stageStyle = {
    New: "bg-blue-600/20 text-blue-300",
    Contacted: "bg-yellow-600/20 text-yellow-300",
    Qualified: "bg-green-600/20 text-green-300",
    Proposal: "bg-purple-600/20 text-purple-300",
    Negotiation: "bg-orange-600/20 text-orange-300",
    "Closed Won": "bg-emerald-600/20 text-emerald-300",
    "Closed Lost": "bg-red-600/20 text-red-300",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout();
  };

  return (
    <div className="min-h-screen bg-[#0E1114] text-gray-200">
      
      {/* Header */}
      <header className="bg-[#1A1D22] border-b border-gray-800 px-8 py-4 flex justify-between items-center sticky top-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="px-4 py-2 rounded-md bg-[#272B31] hover:bg-[#32363D] transition flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <h1 className="text-2xl font-semibold">Lead Management</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">{user.username}</p>
            <p className="text-xs text-gray-400">{user.role}</p>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="px-10 py-10 max-w-screen-2xl mx-auto">

        {/* Create Button */}
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 mb-8 shadow"
        >
          <Plus className="w-5 h-5" /> Add Lead
        </button>

        {/* Form */}
        {(showCreateForm || editingLead) && (
          <div className="bg-[#1A1D22] border border-gray-700 rounded-xl p-6 mb-10">

            <h3 className="text-lg font-semibold mb-6">
              {editingLead ? "Edit Lead" : "Create Lead"}
            </h3>

            <form onSubmit={editingLead ? handleUpdate : handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {["name","email","phone"].map((field) => (
                <div key={field}>
                  <label className="text-sm text-gray-400 capitalize">{field}</label>
                  <input
                    type="text"
                    className="mt-1 w-full bg-[#0E1114] border border-gray-700 rounded-lg px-3 py-2"
                    required
                    value={editingLead ? editingLead[field] : newLead[field]}
                    onChange={(e) =>
                      editingLead
                        ? setEditingLead({ ...editingLead, [field]: e.target.value })
                        : setNewLead({ ...newLead, [field]: e.target.value })
                    }
                  />
                </div>
              ))}

              <div>
                <label className="text-sm text-gray-400">Stage</label>
                <select
                  className="mt-1 w-full bg-[#0E1114] border border-gray-700 rounded-lg px-3 py-2"
                  value={editingLead ? editingLead.stage : newLead.stage}
                  onChange={(e) =>
                    editingLead
                      ? setEditingLead({ ...editingLead, stage: e.target.value })
                      : setNewLead({ ...newLead, stage: e.target.value })
                  }
                >
                  {Object.keys(stageStyle).map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              {user.role !== "Client" && (
                <div>
                  <label className="text-sm text-gray-400">Assigned Staff</label>
                  <select
                    className="mt-1 w-full bg-[#0E1114] border border-gray-700 rounded-lg px-3 py-2"
                    value={editingLead ? editingLead.assignedStaff : newLead.assignedStaff}
                    onChange={(e) =>
                      editingLead
                        ? setEditingLead({ ...editingLead, assignedStaff: e.target.value })
                        : setNewLead({ ...newLead, assignedStaff: e.target.value })
                    }
                  >
                    <option value="">Select Staff</option>
                    {staff.map((s) => (
                      <option key={s._id} value={s._id}>{s.username}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="md:col-span-2">
                <label className="text-sm text-gray-400">Notes</label>
                <textarea
                  rows="3"
                  className="mt-1 w-full bg-[#0E1114] border border-gray-700 rounded-lg px-3 py-2"
                  value={editingLead ? editingLead.notes : newLead.notes}
                  onChange={(e) =>
                    editingLead
                      ? setEditingLead({ ...editingLead, notes: e.target.value })
                      : setNewLead({ ...newLead, notes: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-2 flex gap-4 mt-4">
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2">
                  <Save className="w-4 h-4" /> {editingLead ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => { setEditingLead(null); setShowCreateForm(false); }}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center gap-2"
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
                {["Name", "Email", "Phone", "Stage", "Staff", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-[#24282F] transition">
                  <td className="px-6 py-4">{lead.name}</td>
                  <td className="px-6 py-4 text-gray-400">{lead.email}</td>
                  <td className="px-6 py-4 text-gray-400">{lead.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs ${stageStyle[lead.stage]}`}>
                      {lead.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{lead.assignedStaff?.username || "Unassigned"}</td>
                  <td className="px-6 py-4 flex gap-3">
                    <button className="text-blue-400 hover:text-blue-300" onClick={() => setEditingLead(lead)}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-500 hover:text-red-400" onClick={() => handleDelete(lead._id)}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {lead.stage !== "Closed Won" && (
                      <button className="text-green-500 hover:text-green-400" onClick={() => handleConvert(lead._id)}>
                        <UserCheck className="w-4 h-4" />
                      </button>
                    )}
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

export default LeadManagement;
