import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-hot-toast"; 
import './AdminDisplayFAQ.css'; 

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/faqs"
    : "/api/faqs";

function AdminDisplayFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);//whether the FAQ data is still being fetched from the server
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
      toast.error("Error fetching FAQs."); // Show error toast on failure
    }
  };

 
  //  Handle FAQ Delete
  const handleDelete = async () => {
    // Show a  toast confirmation dialog
    const confirmationToast = toast.custom((t) => (
      <div className={`toast-confirmation ${t.visible ? "visible" : ""}`}>
        <p>Are you sure you want to delete this FAQ?</p>
        <div className="toast-actions">
          <button
            onClick={async () => {
              toast.dismiss(t.id); // Dismiss the confirmation toast
              try {
                // Perform delete request
                await axios.delete(`${API_URL}/${faq._id}`);
                
                // Success toast
                toast.success("FAQ deleted successfully!");
                navigate("/adminDisplayFAQ"); 
              } catch (error) {
                // Error toast
                toast.error("Error deleting FAQ");
              }
            }}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)} 
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  const handleUpdate = (faq) => {
    navigate("/adminupdateFAQ", { state: { faq } });
    toast.info("Navigating to update FAQ..."); 
  };

  //  Function to Download FAQs as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("FAQs List", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Question", "Answer"]],
      body: faqs.map((faq) => [faq.question, faq.answer]),
    });

    doc.save("FAQs_List.pdf");
    toast.success("PDF downloaded successfully!"); 
  };

  if (loading) return <p>Loading FAQs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="admin-faq-page">
      <div className="admin-faq-container">
        <h2>Admin - Manage FAQs</h2>

        {/* Download PDF Button */}
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
