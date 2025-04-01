import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/vehicle-documents"
    : "/api/vehicle-documents";

export const useVehicleDocumentStore = create((set) => ({
  documents: [],
  filteredDocuments: [],
  loading: false,
  error: null,

  // Fetch all documents
  fetchDocuments: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(API_URL);
      set({ documents: response.data, filteredDocuments: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error fetching documents", loading: false });
      throw error;
    }
  },

  // Add new document
  addDocument: async (formData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      set(state => ({ 
        documents: [...state.documents, response.data],
        filteredDocuments: [...state.documents, response.data],
        loading: false 
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || "Error adding document", loading: false });
      throw error;
    }
  },

  // Update document
  updateDocument: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      set(state => ({
        documents: state.documents.map(doc => 
          doc._id === id ? response.data : doc
        ),
        filteredDocuments: state.filteredDocuments.map(doc => 
          doc._id === id ? response.data : doc
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || "Error updating document", loading: false });
      throw error;
    }
  },

  // Delete document
  deleteDocument: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_URL}/${id}`);
      set(state => ({
        documents: state.documents.filter(doc => doc._id !== id),
        filteredDocuments: state.filteredDocuments.filter(doc => doc._id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || "Error deleting document", loading: false });
      throw error;
    }
  },

  // Filter documents
  filterDocuments: (filters) => {
    set(state => {
      let filtered = [...state.documents];

      if (filters.busNumber) {
        filtered = filtered.filter(doc => 
          doc.busNumber.toLowerCase().includes(filters.busNumber.toLowerCase())
        );
      }

      if (filters.documentType) {
        filtered = filtered.filter(doc => doc.documentType === filters.documentType);
      }

      if (filters.status) {
        filtered = filtered.filter(doc => doc.status === filters.status);
      }

      return { filteredDocuments: filtered };
    });
  }
}));