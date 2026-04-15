import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './Review.css';

export default function Review() {
  const location = useLocation();
  const navigate = useNavigate();
  // We expect project info to be passed via location state
  const { project, userToReview } = location.state || {};
  
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/reviews', {
        project_id: project?.id,
        reviewed_id: userToReview?.id,
        rating: rating,
        comment: comment
      });
      setSubmitted(true);
      toast.success("Review submitted successfully!");
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      console.error("Failed to submit review", error);
      toast.error("Error submitting review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-background min-vh-100">
        <Navbar />
        <div className="review-container">
          <div className="review-card review-success">
            <h2>Thank You!</h2>
            <p>Your feedback has been submitted successfully.</p>
            <p className="text-muted">Redirecting you to the home page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-vh-100">
      <Navbar />
      <div className="review-container">
        <div className="review-card">
          <h1 className="text-center fw-bold mb-2">Leave a Review</h1>
          <p className="text-center text-muted mb-4">
            How was your experience working on <strong>{project?.title || 'this project'}</strong>?
          </p>

          <form onSubmit={handleSubmit}>
            <div className="star-rating">
              {[...Array(5)].map((_, index) => {
                index += 1;
                return (
                  <span
                    key={index}
                    className={`star ${index <= (hover || rating) ? 'active' : ''}`}
                    onClick={() => setRating(index)}
                    onMouseEnter={() => setHover(index)}
                    onMouseLeave={() => setHover(rating)}
                  >
                    ★
                  </span>
                );
              })}
            </div>

            <div className="review-comment">
              <label htmlFor="comment">Your Feedback</label>
              <textarea
                id="comment"
                placeholder="Share your thoughts about the collaboration..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="btn-submit-review"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
