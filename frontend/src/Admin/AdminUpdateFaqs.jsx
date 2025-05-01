import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaEdit, FaTrashAlt, FaArrowLeft, FaQuestionCircle, FaCommentAlt } from "react-icons/fa";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/faqs"
    : "/api/faqs";

function UpdateFaqs() {
  const location = useLocation();
  const navigate = useNavigate();
  const faq = location.state?.faq || {};

  const [question, setQuestion] = useState(faq.question || "");
  const [answer, setAnswer] = useState(faq.answer || "");

  // Handle FAQ Update
  const handleUpdate = async (e) => {
    e.preventDefault();

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
        <p>Are you sure you want to update this FAQ?</p>
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
                // Perform update request
                await axios.put(`${API_URL}/${faq._id}`, { question, answer });

                // Success toast
                toast.success("FAQ updated successfully!");
                navigate("/adminDisplayFAQ");
              } catch (error) {
                toast.error("Error updating FAQ");
              }
            }}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              backgroundColor: "#38a169",
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
              backgroundColor: "#e53e3e",
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

  // Handle FAQ Delete
  const handleDelete = async () => {
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
                // Perform delete request
                await axios.delete(`${API_URL}/${faq._id}`);

                // Success toast
                toast.success("FAQ deleted successfully!");
                navigate("/adminDisplayFAQ");
              } catch (error) {
                toast.error("Error deleting FAQ");
              }
            }}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              backgroundColor: "#38a169",
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
              backgroundColor: "#e53e3e",
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

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f7fafc", padding: "16px" }}>
      <div
        style={{
          maxWidth: "900px", // Reduced max-width for a smaller form
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "0.75rem", // Slightly reduced border radius
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "24px", // Reduced padding inside the form
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "16px", color: "#2d3748" }}>
          <FaEdit style={{ marginRight: "8px", verticalAlign: "middle" }} />
          Update FAQ
        </h2>
        <form onSubmit={handleUpdate}>
          <label style={{ fontSize: "1rem", fontWeight: "500", color: "#4a5568" }}>
            <FaQuestionCircle style={{ marginRight: "8px", verticalAlign: "middle" }} />
            Question:
          </label>
          <br />
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px", // Reduced padding
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              fontSize: "0.875rem", // Smaller font size
              marginBottom: "12px", // Reduced margin
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <br />
          <br />

          <label style={{ fontSize: "1rem", fontWeight: "500", color: "#4a5568" }}>
            <FaCommentAlt style={{ marginRight: "8px", verticalAlign: "middle" }} />
            Answer:
          </label>
          <br />
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px", // Reduced padding
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              fontSize: "0.875rem", // Smaller font size
              height: "100px", // Reduced height
              resize: "none",
              marginBottom: "16px", // Reduced margin
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <br />
          <br />

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="submit"
              className="update-button"
              style={{
                backgroundColor: "#38a169",
                color: "white",
                fontWeight: "600",
                padding: "8px 16px", // Reduced padding
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#2f855a")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#38a169")}
            >
              <FaEdit style={{ marginRight: "8px" }} />
              Update
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="delete-button"
              style={{
                backgroundColor: "#e53e3e",
                color: "white",
                fontWeight: "600",
                padding: "8px 16px", // Reduced padding
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#c53030")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#e53e3e")}
            >
              <FaTrashAlt style={{ marginRight: "8px" }} />
              Delete
            </button>

            <button
              type="button"
              onClick={() => navigate("/adminDisplayFAQ")}
              className="cancel-button"
              style={{
                backgroundColor: "#e2e8f0",
                color: "#4a5568",
                fontWeight: "500",
                padding: "8px 16px", // Reduced padding
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#cbd5e0")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#e2e8f0")}
            >
              <FaArrowLeft style={{ marginRight: "8px" }} />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateFaqs;
