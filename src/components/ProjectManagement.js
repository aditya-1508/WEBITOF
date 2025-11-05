import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LogOut, FolderOpen, ArrowLeft, Plus, Edit, Trash2, Save, X, Users, AlertCircle, CheckCircle, Clock, Pause } from 'lucide-react';

const ProjectManagement = ({ user, onLogout }) => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [newProject, setNewProject] = useState({ title: '', description: '', client: '', status: 'Planning', priority: 'Medium', assignedStaff: [] });
  const [editingProject, setEditingProject] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchClients();
    if (user.role === 'Admin' || user.role === 'Staff') {
      fetchStaff();
    }
  }, [user]);

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://webitofbackend-1.onrender.com/users/staff', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStaff(response.data);
    } catch (err) {
      console.error('Error fetching staff:', err);
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://webitofbackend-1.onrender.com/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(response.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://webitofbackend-1.onrender.com/clients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(response.data);
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      const projectData = { ...newProject };
      // Ensure assignedStaff is an array
      if (!Array.isArray(projectData.assignedStaff)) {
        projectData.assignedStaff = projectData.assignedStaff ? [projectData.assignedStaff] : [];
      }
      await axios.post('https://webitofbackend-1.onrender.com/projects', projectData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewProject({ title: '', description: '', client: '', status: 'Planning', priority: 'Medium', assignedStaff: [] });
      setShowCreateForm(false);
      fetchProjects();
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://webitofbackend-1.onrender.com/projects/${editingProject._id}`, editingProject, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      console.error('Error updating project:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://webitofbackend-1.onrender.com/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProjects();
      } catch (err) {
        console.error('Error deleting project:', err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Planning': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-green-100 text-green-800';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-emerald-100 text-emerald-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low': return 'bg-gray-100 text-gray-800';
      case 'Medium': return 'bg-blue-100 text-blue-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Planning': return <Clock className="w-3 h-3" />;
      case 'In Progress': return <CheckCircle className="w-3 h-3" />;
      case 'On Hold': return <Pause className="w-3 h-3" />;
      case 'Completed': return <CheckCircle className="w-3 h-3" />;
      case 'Cancelled': return <AlertCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
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
            <h1 className="text-xl font-semibold tracking-wide">Project Management</h1>
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
        {/* Create Project Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            Create New Project
          </button>
        </div>

        {/* Create/Edit Form */}
        {(showCreateForm || editingProject) && (
          <div className="mb-8">
            <div className="bg-[#1A1D21] rounded-xl p-6 shadow-lg border border-gray-700">
              <h3 className="text-xl font-semibold text-gray-200 mb-6">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h3>
              <form onSubmit={editingProject ? handleUpdate : handleCreate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                    <input
                      type="text"
                      placeholder="Project Title"
                      value={editingProject ? editingProject.title : newProject.title}
                      onChange={(e) => editingProject ? setEditingProject({...editingProject, title: e.target.value}) : setNewProject({...newProject, title: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Client</label>
                    <select
                      value={editingProject ? editingProject.client : newProject.client}
                      onChange={(e) => editingProject ? setEditingProject({...editingProject, client: e.target.value}) : setNewProject({...newProject, client: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Client</option>
                      {clients.map(client => (
                        <option key={client._id} value={client._id}>{client.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                    <select
                      value={editingProject ? editingProject.status : newProject.status}
                      onChange={(e) => editingProject ? setEditingProject({...editingProject, status: e.target.value}) : setNewProject({...newProject, status: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Planning">Planning</option>
                      <option value="In Progress">In Progress</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                    <select
                      value={editingProject ? editingProject.priority : newProject.priority}
                      onChange={(e) => editingProject ? setEditingProject({...editingProject, priority: e.target.value}) : setNewProject({...newProject, priority: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      placeholder="Project description and details"
                      value={editingProject ? editingProject.description : newProject.description}
                      onChange={(e) => editingProject ? setEditingProject({...editingProject, description: e.target.value}) : setNewProject({...newProject, description: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows="3"
                      required
                    />
                  </div>
                  {(user.role === 'Admin' || user.role === 'Staff') && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Assigned Staff {user.role === 'Admin' ? '(hold Ctrl/Cmd to select multiple)' : ''}
                      </label>
                      {user.role === 'Admin' ? (
                        <select
                          multiple
                          value={editingProject ? editingProject.assignedStaff : newProject.assignedStaff}
                          onChange={(e) => {
                            const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                            editingProject ? setEditingProject({...editingProject, assignedStaff: selectedOptions}) : setNewProject({...newProject, assignedStaff: selectedOptions});
                          }}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {staff.map(staffMember => (
                            <option key={staffMember._id} value={staffMember._id}>
                              {staffMember.username} ({staffMember.role})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <select
                          value={editingProject ? editingProject.assignedStaff[0] || '' : newProject.assignedStaff[0] || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            editingProject ? setEditingProject({...editingProject, assignedStaff: value ? [value] : []}) : setNewProject({...newProject, assignedStaff: value ? [value] : []});
                          }}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Staff</option>
                          {staff.map(staffMember => (
                            <option key={staffMember._id} value={staffMember._id}>
                              {staffMember.username} ({staffMember.role})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
                  >
                    <Save className="w-4 h-4" />
                    {editingProject ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProject(null);
                      setShowCreateForm(false);
                      setNewProject({ title: '', description: '', client: '', status: 'Planning', priority: 'Medium', assignedStaff: [] });
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

        {/* Projects Table */}
        <div className="bg-[#1A1D21] rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-xl font-semibold text-gray-200">All Projects</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#2A2D31]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Assigned Staff</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {projects.map(project => (
                  <tr key={project._id} className="hover:bg-[#2A2D31] transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{project.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{project.client?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                        project.status === 'Planning' ? 'bg-blue-900/50 text-blue-300' :
                        project.status === 'In Progress' ? 'bg-green-900/50 text-green-300' :
                        project.status === 'On Hold' ? 'bg-yellow-900/50 text-yellow-300' :
                        project.status === 'Completed' ? 'bg-emerald-900/50 text-emerald-300' :
                        'bg-red-900/50 text-red-300'
                      }`}>
                        {getStatusIcon(project.status)}
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        project.priority === 'Low' ? 'bg-gray-900/50 text-gray-300' :
                        project.priority === 'Medium' ? 'bg-blue-900/50 text-blue-300' :
                        project.priority === 'High' ? 'bg-orange-900/50 text-orange-300' :
                        'bg-red-900/50 text-red-300'
                      }`}>
                        {project.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {project.assignedStaff && project.assignedStaff.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {project.assignedStaff.map(staff => staff.username).join(', ')}
                        </div>
                      ) : 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingProject(project)}
                          className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-200"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

export default ProjectManagement;
