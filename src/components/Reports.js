import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { LogOut, BarChart3, ArrowLeft, TrendingUp, Users, FileText, UserCheck, FolderKanban } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Reports = ({ user, onLogout }) => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/reports/overview', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const leadStagesData = {
    labels: stats.leadStages?.map(stage => stage._id) || [],
    datasets: [{
      data: stats.leadStages?.map(stage => stage.count) || [],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384'],
    }],
  };

  const projectStatusesData = {
    labels: ['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'],
    datasets: [{
      label: 'Projects',
      data: [
        stats.projectStatuses?.find(s => s._id === 'Planning')?.count || 0,
        stats.projectStatuses?.find(s => s._id === 'In Progress')?.count || 0,
        stats.projectStatuses?.find(s => s._id === 'On Hold')?.count || 0,
        stats.projectStatuses?.find(s => s._id === 'Completed')?.count || 0,
        stats.projectStatuses?.find(s => s._id === 'Cancelled')?.count || 0,
      ],
      backgroundColor: '#36A2EB',
    }],
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
            <h1 className="text-xl font-semibold tracking-wide">Reports & Analytics</h1>
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
        {/* Stats Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-200 mb-6">Overview Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#1A1D21] rounded-xl p-6 shadow-lg border border-gray-700 group cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Total Users</h3>
              <p className="text-3xl font-bold text-gray-200 group-hover:scale-105 transition-transform duration-200">
                {stats.totalUsers || 0}
              </p>
            </div>
            <div className="bg-[#1A1D21] rounded-xl p-6 shadow-lg border border-gray-700 group cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Total Leads</h3>
              <p className="text-3xl font-bold text-gray-200 group-hover:scale-105 transition-transform duration-200">
                {stats.totalLeads || 0}
              </p>
            </div>
            <div className="bg-[#1A1D21] rounded-xl p-6 shadow-lg border border-gray-700 group cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 shadow-lg">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Total Clients</h3>
              <p className="text-3xl font-bold text-gray-200 group-hover:scale-105 transition-transform duration-200">
                {stats.totalClients || 0}
              </p>
            </div>
            <div className="bg-[#1A1D21] rounded-xl p-6 shadow-lg border border-gray-700 group cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 shadow-lg">
                  <FolderKanban className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Total Projects</h3>
              <p className="text-3xl font-bold text-gray-200 group-hover:scale-105 transition-transform duration-200">
                {stats.totalProjects || 0}
              </p>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-200 mb-6">Recent Activity (30 days)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#1A1D21] rounded-xl p-6 shadow-lg border border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-900/50">
                  <FileText className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200">New Leads</h3>
                  <p className="text-sm text-gray-400">Last 30 days</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-200">{stats.recentLeads || 0}</p>
            </div>
            <div className="bg-[#1A1D21] rounded-xl p-6 shadow-lg border border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-green-900/50">
                  <UserCheck className="w-5 h-5 text-green-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200">New Clients</h3>
                  <p className="text-sm text-gray-400">Last 30 days</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-200">{stats.recentClients || 0}</p>
            </div>
            <div className="bg-[#1A1D21] rounded-xl p-6 shadow-lg border border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-900/50">
                  <FolderKanban className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200">New Projects</h3>
                  <p className="text-sm text-gray-400">Last 30 days</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-200">{stats.recentProjects || 0}</p>
            </div>
          </div>
        </section>

        {/* Charts */}
        <section>
          <h2 className="text-2xl font-bold text-gray-200 mb-6">Data Visualizations</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#1A1D21] rounded-xl p-6 shadow-lg border border-gray-700">
              <h3 className="text-xl font-semibold text-gray-200 mb-6">Lead Stages Distribution</h3>
              <div className="h-80">
                <Pie data={leadStagesData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
            <div className="bg-[#1A1D21] rounded-xl p-6 shadow-lg border border-gray-700">
              <h3 className="text-xl font-semibold text-gray-200 mb-6">Project Statuses</h3>
              <div className="h-80">
                <Bar data={projectStatusesData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Reports;
