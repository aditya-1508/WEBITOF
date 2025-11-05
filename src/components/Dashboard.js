import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Users, FileText, UserCheck, FolderKanban, BarChart3 } from 'lucide-react';
import { useStats } from '../contexts/StatsContext';

const Dashboard = ({ user, onLogout }) => {
  const { stats, fetchStats } = useStats();

  useEffect(() => {
    if (user.role === 'Admin' || user.role === 'Staff') {
      fetchStats();
    }
  }, [user, fetchStats]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers || 0, icon: Users },
    { title: 'Total Leads', value: stats.totalLeads || 0, icon: FileText },
    { title: 'Total Clients', value: stats.totalClients || 0, icon: UserCheck },
    { title: 'Total Projects', value: stats.totalProjects || 0, icon: FolderKanban },
  ];

  return (
    <div className="min-h-screen bg-[#0E1114] text-gray-200">

      {/* Header */}
      <header className="bg-[#1A1D21] border-b border-gray-700 shadow-lg sticky top-0 z-50">
        <div className="w-full px-10 py-4 flex justify-between items-center">

          {/* Logo + Title */}
          <div className="flex items-center gap-3">
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

        {/* Stats Section */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-5">Overview</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="bg-[#1A1D21] border border-gray-700 rounded-xl px-6 py-5 shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="p-3 rounded-lg bg-blue-600/20 text-blue-400 w-fit mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                  <p className="text-3xl font-semibold">{stat.value}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold mb-5">Quick Actions</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {user.role === "Admin" && (
              <Link to="/users">
                <div className="action-card">
                  <Users className="icon" />
                  <div><h3>User Management</h3><p>Manage system users</p></div>
                </div>
              </Link>
            )}

            {(user.role === "Admin" || user.role === "Staff") && (
              <>
                <Link to="/leads">
                  <div className="action-card">
                    <FileText className="icon" />
                    <div><h3>Lead Management</h3><p>Track potential clients</p></div>
                  </div>
                </Link>

                <Link to="/clients">
                  <div className="action-card">
                    <UserCheck className="icon" />
                    <div><h3>Client Management</h3><p>Manage active clients</p></div>
                  </div>
                </Link>

                <Link to="/projects">
                  <div className="action-card">
                    <FolderKanban className="icon" />
                    <div><h3>Project Management</h3><p>Oversee all projects</p></div>
                  </div>
                </Link>

                <Link to="/reports">
                  <div className="action-card">
                    <BarChart3 className="icon" />
                    <div><h3>Reports</h3><p>View analytics</p></div>
                  </div>
                </Link>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
