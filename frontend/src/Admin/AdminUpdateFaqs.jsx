import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast"; 
import './UpdateFaqs.css'; 

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/faqs"
    : "/api/faqs";

function UpdateFaqs() {
  const location = useLocation();//access the current location object
  const navigate = useNavigate();
  const faq = location.state?.faq || {}; 

  const [question, setQuestion] = useState(faq.question || "");
  const [answer, setAnswer] = useState(faq.answer || "");

  // Handle FAQ Update
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Show a custom toast confirmation dialog
    const confirmationToast = toast.custom((t) => (
      <div className={`toast-confirmation ${t.visible ? "visible" : ""}`}>
        <p>Are you sure you want to update this FAQ?</p>
        <div className="toast-actions">
          <button
            onClick={async () => {
              toast.dismiss(t.id); // Dismiss the confirmation toast
              try {
                // Perform update request
                await axios.put(`${API_URL}/${faq._id}`, { question, answer });
                
                // Success toast
                toast.success("FAQ updated successfully!");
                navigate("/adminDisplayFAQ"); 
              } catch (error) {
                // Error toast
                toast.error("Error updating FAQ");
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

  //  Handle FAQ Delete
  const handleDelete = async () => {
    // Show a custom toast confirmation dialog
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
