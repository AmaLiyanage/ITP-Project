import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/maintenance"
    : "/api/maintenance";

export const useMaintenanceStore = create((set) => ({
  records: [],
  filteredRecords: [],
  loading: false,
  error: null,

  // Fetch all maintenance records
  fetchRecords: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(API_URL);
      set({ records: response.data, filteredRecords: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error fetching maintenance records", loading: false });
      throw error;
    }
  },

  // Add new maintenance record
  addRecord: async (recordData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(API_URL, recordData);
      set(state => ({ 
        records: [...state.records, response.data],
        filteredRecords: [...state.records, response.data],
        loading: false 
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || "Error adding maintenance record", loading: false });
      throw error;
    }
  },

  // Update maintenance record
  updateRecord: async (id, recordData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/${id}`, recordData);
      set(state => ({
        records: state.records.map(record => 
          record._id === id ? response.data : record
        ),
        filteredRecords: state.filteredRecords.map(record => 
          record._id === id ? response.data : record
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || "Error updating maintenance record", loading: false });
      throw error;
    }
  },

  // Delete maintenance record
  deleteRecord: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_URL}/${id}`);
      set(state => ({
        records: state.records.filter(record => record._id !== id),
        filteredRecords: state.filteredRecords.filter(record => record._id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || "Error deleting maintenance record", loading: false });
      throw error;
    }
  },

  // Filter maintenance records
  filterRecords: (filters) => {
    set(state => {
      let filtered = [...state.records];

      if (filters.busNumber) {
        filtered = filtered.filter(record => 
          record.busNumber.toLowerCase().includes(filters.busNumber.toLowerCase())
        );
      }

      if (filters.maintenanceType) {
        filtered = filtered.filter(record => 
          record.maintenanceType === filters.maintenanceType
        );
      }

      if (filters.costMin) {
        filtered = filtered.filter(record => 
          parseFloat(record.cost) >= parseFloat(filters.costMin)
        );
      }

      if (filters.costMax) {
        filtered = filtered.filter(record => 
          parseFloat(record.cost) <= parseFloat(filters.costMax)
        );
      }

      return { filteredRecords: filtered };
    });
  }
})); 
