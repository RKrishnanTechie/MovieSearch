import React, { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ movieId, onReviewAdded }) => {
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post(`http://localhost:8000/reviews/add`, {
                movieId,
                comment,
                rating
            }, {
                withCredentials: true,
            });
    
            const newReview = response.data.data;
            console.log("New Review Added:", newReview);
    
            // Ensure the user data is correctly attached to the review before updating the list
            onReviewAdded(newReview);

    
            setComment('');
            setRating(0);
        } catch (err) {
            setError('Failed to add review. Please try again.');
        }
    };
    

    return (
        <div>
            <h3>Add a Review</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Rating:</label>
                    <input
                        type="number"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        min="0"
                        max="10"
                        required
                    />
                </div>
                <div>
                    <label>Comment:</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit">Submit Review</button>
            </form>
        </div>
    );
};

export default ReviewForm;
