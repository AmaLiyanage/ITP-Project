import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import './UpdateFaqs.css'; // Import the new CSS file

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/faqs"
    : "/api/faqs";

function UpdateFaqs() {
  const location = useLocation();
  const navigate = useNavigate();
  const faq = location.state?.faq || {}; // Get FAQ data from navigation state

  const [question, setQuestion] = useState(faq.question || "");
  const [answer, setAnswer] = useState(faq.answer || "");

  // ✅ Handle FAQ Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    const confirmUpdate = window.confirm("Are you sure you want to update this FAQ?");
    if (!confirmUpdate) return;

    try {
      await axios.put(`${API_URL}/${faq._id}`, { question, answer });
      alert("FAQ updated successfully!");
      navigate("/adminDisplayFAQ"); // Redirect to FAQ list
    } catch (error) {
      alert("Error updating FAQ");
    }
  };

  // ✅ Handle FAQ Delete
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this FAQ?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/${faq._id}`);
      alert("FAQ deleted successfully!");
      navigate("/adminDisplayFAQ"); // Redirect to FAQ list
    } catch (error) {
      alert("Error deleting FAQ");
    }
  };

  return (
    <div className="update-faq-page">
      <div className="update-faq-container">
        <h2>Update FAQ</h2>
        <form onSubmit={handleUpdate}>
          <label>Question:</label><br />
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          /><br /><br />

          <label>Answer:</label><br />
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          /><br /><br />

          <div className="button-group">
            <button type="submit" className="update-button">Update</button>
            <button
              type="button"
              onClick={handleDelete}
              className="delete-button"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => navigate("/adminDisplayFAQ")}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateFaqs;
