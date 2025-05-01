import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-hot-toast";
import { FaEdit, FaTrashAlt, FaDownload, FaQuestionCircle } from "react-icons/fa";

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
      toast.error("Error fetching FAQs.");
    }
  };

  const handleDelete = async (id) => {
    const confirmationToast = toast.custom((t) => (
      <div
        style={{
          backgroundColor: "#ffffff",
          color: "#2d3748",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          fontSize: "1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "400px",
          width: "100%",
          opacity: t.visible ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      >
        <p>Are you sure you want to delete this FAQ?</p>
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axios.delete(`${API_URL}/${id}`);
                toast.success("FAQ deleted successfully!");
                fetchFAQs(); // Refresh the list after deletion
              } catch (error) {
                toast.error("Error deleting FAQ");
              }
            }}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              backgroundColor: "#38a169", // Success button color
              color: "white",
              transition: "background-color 0.3s",
            }}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              backgroundColor: "#e53e3e", // Cancel button color
              color: "white",
              transition: "background-color 0.3s",
            }}
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

  const downloadPDF = () => {
    const doc = new jsPDF();

    const logoUrl = "/buisness-logo.png"; 
    const logoX = 14;
    const logoY = 10;
    const logoWidth = 30;
    const logoHeight = 20;

    doc.addImage(logoUrl, "PNG", logoX, logoY, logoWidth, logoHeight);

    const textX = logoX + logoWidth + 10;
    const textY = logoY + 5;

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("MALSHAN MOTORS", textX, textY);

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("FAQ Management Report", textX, textY + 8);

    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, textX, textY + 16);

    const tableStartY = logoY + logoHeight + 15;

    autoTable(doc, {
      startY: tableStartY,
      head: [["Question", "Answer"]],
      body: faqs.map((faq) => [faq.question, faq.answer]),
    });

    doc.save("FAQs_Report.pdf");
    toast.success("PDF downloaded successfully!");
  };

  if (loading) return <p>Loading FAQs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f7fafc", padding: "24px" }}>
      <div
        style={{
          maxWidth: "1000px",  // Decreased width
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "1rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "32px",
        }}
      >
        {/* Header with an icon */}
        <h2 style={{ fontSize: "2rem", fontWeight: "600", marginBottom: "24px", color: "#2d3748" }}>
          <FaQuestionCircle style={{ marginRight: "10px", verticalAlign: "middle" }} />
          Admin - Manage FAQs
        </h2>

        {/* Download PDF Button with an icon */}
        <div style={{ textAlign: "right" }}>
          <button
            onClick={downloadPDF}
            style={{
              backgroundColor: "#38a169",
              color: "white",
              fontWeight: "600",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2f855a")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#38a169")}
          >
            <FaDownload style={{ marginRight: "8px" }} />
            Download PDF
          </button>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "24px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "1px solid #e2e8f0",
                  backgroundColor: "#edf2f7",
                  fontWeight: "500",
                }}
              >
                Question
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "1px solid #e2e8f0",
                  backgroundColor: "#edf2f7",
                  fontWeight: "500",
                }}
              >
                Answer
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "1px solid #e2e8f0",
                  backgroundColor: "#edf2f7",
                  fontWeight: "500",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {faqs.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", color: "#4a5568", fontSize: "1rem" }}>
                  No FAQs available
                </td>
              </tr>
            ) : (
              faqs.map((faq) => (
                <tr key={faq._id}>
                  <td style={{ padding: "12px", backgroundColor: "white" }}>{faq.question}</td>
                  <td style={{ padding: "12px", backgroundColor: "white" }}>{faq.answer}</td>
                  <td
                    style={{
                      padding: "12px",
                      backgroundColor: "white",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <button
                      onClick={() => handleUpdate(faq)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        backgroundColor: "#3182ce",
                        color: "white",
                        fontWeight: "500",
                        transition: "background-color 0.3s",
                      }}
                      onMouseOver={(e) => (e.target.style.backgroundColor = "#2b6cb0")}
                      onMouseOut={(e) => (e.target.style.backgroundColor = "#3182ce")}
                    >
                      <FaEdit style={{ marginRight: "8px" }} />
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(faq._id)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        backgroundColor: "#e53e3e",
                        color: "white",
                        fontWeight: "500",
                        transition: "background-color 0.3s",
                      }}
                      onMouseOver={(e) => (e.target.style.backgroundColor = "#c53030")}
                      onMouseOut={(e) => (e.target.style.backgroundColor = "#e53e3e")}
                    >
                      <FaTrashAlt style={{ marginRight: "8px" }} />
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
