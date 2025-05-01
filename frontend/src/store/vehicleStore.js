import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/vehicles"
    : "/api/vehicles";

export const useVehicleStore = create((set) => ({
  vehicles: [],
  filteredVehicles: [],
  loading: false,
  error: null,

  // Fetch all vehicles
  fetchVehicles: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(API_URL);
      set({ vehicles: response.data, filteredVehicles: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error fetching vehicles", loading: false });
      throw error;
    }
  },

  // Add new vehicle
  addVehicle: async (vehicleData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(API_URL, vehicleData);
      set(state => ({ 
        vehicles: [...state.vehicles, response.data],
        filteredVehicles: [...state.vehicles, response.data],
        loading: false 
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || "Error adding vehicle", loading: false });
      throw error;
    }
  },

  // Update vehicle
  updateVehicle: async (id, vehicleData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/${id}`, vehicleData);
      set(state => ({
        vehicles: state.vehicles.map(vehicle => 
          vehicle._id === id ? response.data : vehicle
        ),
        filteredVehicles: state.filteredVehicles.map(vehicle => 
          vehicle._id === id ? response.data : vehicle
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || "Error updating vehicle", loading: false });
      throw error;
    }
  },

  // Delete vehicle
  deleteVehicle: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_URL}/${id}`);
      set(state => ({
        vehicles: state.vehicles.filter(vehicle => vehicle._id !== id),
        filteredVehicles: state.filteredVehicles.filter(vehicle => vehicle._id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || "Error deleting vehicle", loading: false });
      throw error;
    }
  },

  // Filter vehicles
  filterVehicles: (filters) => {
    set(state => {
      let filtered = [...state.vehicles];

      // Apply search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(vehicle => 
          vehicle.vehicleNumber.toLowerCase().includes(search) ||
          vehicle.make.toLowerCase().includes(search) ||
          vehicle.model.toLowerCase().includes(search) ||
          vehicle.vehicleType.toLowerCase().includes(search)
        );
      }

      // Apply make filter
      if (filters.make) {
        filtered = filtered.filter(vehicle => vehicle.make === filters.make);
      }

      // Apply vehicleType filter
      if (filters.vehicleType) {
        filtered = filtered.filter(vehicle => vehicle.vehicleType === filters.vehicleType);
      }

      // Apply seat count filters
      if (filters.minSeatCount || filters.maxSeatCount) {
        filtered = filtered.filter(vehicle => {
          const seatCount = vehicle.seatCount;
          const minSeatCount = parseInt(filters.minSeatCount) || 0;
          const maxSeatCount = parseInt(filters.maxSeatCount) || Number.MAX_SAFE_INTEGER;
          return seatCount >= minSeatCount && seatCount <= maxSeatCount;
        });
      }

      // Apply status filter
      if (filters.status) {
        filtered = filtered.filter(vehicle => vehicle.status === filters.status);
      }

      return { filteredVehicles: filtered };
    });
  }
}));