import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ClientsContext = createContext();

export const useClients = () => {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error('useClients must be used within a ClientsProvider');
  }
  return context;
};

export const ClientsProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://webitofbackend-1.onrender.com/clients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(response.data);
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (newClient) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://webitofbackend-1.onrender.com/clients', newClient, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(prev => [...prev, response.data.client]);
      return response.data.client;
    } catch (err) {
      console.error('Error adding client:', err);
      throw err;
    }
  };

  const updateClient = async (clientId, updatedClient) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`https://webitofbackend-1.onrender.com/clients/${clientId}`, updatedClient, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(prev => prev.map(client => client._id === clientId ? response.data.client : client));
      return response.data.client;
    } catch (err) {
      console.error('Error updating client:', err);
      throw err;
    }
  };

  const removeClient = async (clientId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://webitofbackend-1.onrender.com/clients/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(prev => prev.filter(client => client._id !== clientId));
    } catch (err) {
      console.error('Error removing client:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <ClientsContext.Provider value={{
      clients,
      loading,
      fetchClients,
      addClient,
      updateClient,
      removeClient
    }}>
      {children}
    </ClientsContext.Provider>
  );
};
