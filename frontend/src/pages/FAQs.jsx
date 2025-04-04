import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserDisplayFandQ.css"; 
import image13 from "./image13.png"; 

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/faqs"
    : "/api/faqs";

function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  //  Fetch FAQs
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

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (loading) return <p>Loading FAQs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="faq-page">
      <div className="faq-image">
        <img src={image13} alt="FAQ Illustration" />
      </div>

      {/* FAQ Content - Centered */}
      <div className="faq-container">
        <div className="faq-content">
          <h2>Frequently Asked Questions</h2>

          {faqs.length === 0 ? (
            <p>No FAQs available.</p>
          ) : (
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div key={faq._id} className="faq-item">
                  <div
                    className={`faq-question ${
                      activeIndex === index ? "active" : ""
                    }`}
                    onClick={() => toggleAnswer(index)}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-toggle">
                      {activeIndex === index ? "-" : "+"}
                    </span>
                  </div>

                  {activeIndex === index && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FAQs;
