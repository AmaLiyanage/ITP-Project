import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import './AdminDisplayFAQ.css'; // Import the new CSS file

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/faqs"
    : "/api/faqs";

function AdminDisplayFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await axios.get(API_URL);
      setFaqs(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch FAQs");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this FAQ?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setFaqs(faqs.filter((faq) => faq._id !== id));
      alert("FAQ deleted successfully!");
    } catch (error) {
      alert("Error deleting FAQ");
    }
  };

  const handleUpdate = (faq) => {
    navigate("/adminupdateFAQ", { state: { faq } });
  };

  // 🖨️ Function to Download FAQs as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("FAQs List", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Question", "Answer"]],
      body: faqs.map((faq) => [faq.question, faq.answer]),
    });

    doc.save("FAQs_List.pdf");
  };

  if (loading) return <p>Loading FAQs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="admin-faq-page">
      <div className="admin-faq-container">
        <h2>Admin - Manage FAQs</h2>

        {/* 📥 Download PDF Button */}
        <div className="download-button-container">
          <button onClick={downloadPDF} className="download-button">
            Download PDF
          </button>
        </div>

        <table className="faq-table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Answer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqs.length === 0 ? (
              <tr>
                <td colSpan="3" className="no-faqs">
                  No FAQs available
                </td>
              </tr>
            ) : (
              faqs.map((faq) => (
                <tr key={faq._id}>
                  <td>{faq.question}</td>
                  <td>{faq.answer}</td>
                  <td className="actions">
                    <button onClick={() => handleUpdate(faq)} className="update-button">
                      Update
                    </button>
                    <button onClick={() => handleDelete(faq._id)} className="delete-button">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDisplayFAQs;
