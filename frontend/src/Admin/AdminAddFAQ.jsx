import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import "./AddFAQ.css"; // Import CSS

function AddFAQ() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Initialize navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question || !answer) {
      toast.error("Please fill in both fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/faqs", {
        question,
        answer,
      });

      if (response.status === 201) {
        toast.success("FAQ added successfully!");
        setQuestion("");
        setAnswer("");

        // Navigate to the FAQ list page after success
        navigate("/adminDisplayFAQ");
      }
    } catch (error) {
      toast.error("Error adding FAQ.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-faq-page">
      <div className="add-faq-container">
        <h2>Add FAQ</h2>
        <form onSubmit={handleSubmit}>
          <label>Question:</label><br />
          <input 
            type="text" 
            name="question" 
            value={question} 
            onChange={(e) => setQuestion(e.target.value)} 
            required 
          /><br /><br />

          <label>Answer:</label><br />
          <textarea 
            name="answer" 
            value={answer} 
            onChange={(e) => setAnswer(e.target.value)} 
            required 
          /><br /><br />

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add FAQ"}
          </button>
        </form>

        {/* Back to FAQs */}
        <p className="add-faq-link-text">View all FAQs? <Link to="/adminDisplayFAQ" className="faq-link">Click here</Link></p>
      </div>
    </div>
  );
}

export default AddFAQ;
