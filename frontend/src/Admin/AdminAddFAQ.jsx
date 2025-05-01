import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FaQuestionCircle, FaRegCommentDots } from "react-icons/fa";

function AddFAQ() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question || !answer) {
      toast.error("Please fill in both fields.");
      return;
    }

    try {
      setLoading(true);//// Set loading to true while request is being made
      const response = await axios.post("http://localhost:5000/api/faqs", {
        question,
        answer,
      });

      if (response.status === 201) {
        toast.success("FAQ added successfully!");
        setQuestion("");// Reset fields
        setAnswer("");
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add FAQ</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 bg-white">
              <FaQuestionCircle className="text-gray-500 mr-2" />
              <input
                type="text"
                name="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full bg-transparent outline-none"
                placeholder="Enter the question"
                required
              />
            </div>
          </div>

          {/* Answer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Answer
            </label>
            <div className="flex items-start border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 bg-white">
              <FaRegCommentDots className="text-gray-500 mt-1 mr-2" />
              <textarea
                name="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full bg-transparent outline-none resize-none h-28"
                placeholder="Enter the answer"
                required
              />
            </div>
          </div>

          <div className="flex justify-center">
  <button
    type="submit"
    disabled={loading}
    className="w-40 bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
  >
    {loading ? "Adding..." : "Add FAQ"}
  </button>
</div>

        </form>

        <p className="mt-6 text-sm text-gray-600">
          View all FAQs?{" "}
          <Link to="/adminDisplayFAQ" className="text-blue-600 hover:underline">
            Click here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AddFAQ;
