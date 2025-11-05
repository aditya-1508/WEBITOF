import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const StatsContext = createContext();

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};

export const StatsProvider = ({ children }) => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://webitofbackend-1.onrender.com/reports/overview', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchStats();
    }
  }, []);

  // Make fetchStats available globally for components that need to refresh stats
  useEffect(() => {
    window.fetchStats = fetchStats;
    return () => {
      delete window.fetchStats;
    };
  }, [fetchStats]);

  return (
    <StatsContext.Provider value={{
      stats,
      loading,
      fetchStats
    }}>
      {children}
    </StatsContext.Provider>
  );
};
