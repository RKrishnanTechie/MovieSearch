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
        <div className="card p-4 my-4">
            <h3 className="text-center">Write your Review</h3>
            {error && <p className="text-danger text-center">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label text-white">Rating:</label>
                    <input
                        type="number"
                        className="form-control"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        min="0"
                        max="10"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-white">Comment:</label>
                    <textarea
                        className="form-control"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-warning w-70">Post Review</button>
            </form>
        </div>
    );
    
};

export default ReviewForm;
