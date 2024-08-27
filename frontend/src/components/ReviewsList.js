import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/authContext';

const ReviewsList = ({ movieId, reviews, onReviewAdded }) => {
    const [localReviews, setLocalReviews] = useState(reviews);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState('');
    const { isAuthenticated, user } = useContext(AuthContext);

    const fetchReviews = useCallback(async (pageNumber) => {
        try {
            const response = await axios.get(`http://localhost:8000/reviews/movie/${movieId}?page=${pageNumber}`);
            setLocalReviews((prevReviews) => {
                const newReviews = response.data.data.reviews;
                const allReviews = [...prevReviews];
                newReviews.forEach(newReview => {
                    const index = allReviews.findIndex(r => r._id === newReview._id);
                    if (index !== -1) {
                        allReviews[index] = newReview;
                    } else {
                        allReviews.push(newReview);
                    }
                });
                return allReviews;
            });
            setTotalPages(response.data.data.totalPages);
        } catch (err) {
            setError('Failed to fetch reviews.');
        }
    }, [movieId]);

    useEffect(() => {
        fetchReviews(page);
    }, [page, fetchReviews]);

    useEffect(() => {
        if (reviews && reviews.length > 0) {
            setLocalReviews(prevReviews => {
                const updatedReviews = [...prevReviews];
                reviews.forEach(newReview => {
                    const index = updatedReviews.findIndex(r => r._id === newReview._id);
                    if (index !== -1) {
                        updatedReviews[index] = newReview;
                    } else {
                        updatedReviews.unshift(newReview);
                    }
                });
                return updatedReviews;
            });
        }
    }, [reviews]);

    const loadMoreReviews = () => {
        if (page < totalPages) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const handleLike = async (reviewId) => {
        if (!isAuthenticated) {
            setError('You need to be logged in to like a review.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8000/reviews/like', { reviewId }, {
                withCredentials: true
            });
            const updatedReview = { ...response.data.data, user: localReviews.find(r => r._id === reviewId).user };
            updateReviewInState(updatedReview);
        } catch (err) {
            setError('Failed to like the review.');
        }
    };

    const handleDislike = async (reviewId) => {
        if (!isAuthenticated) {
            setError('You need to be logged in to dislike a review.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8000/reviews/dislike', { reviewId }, {
                withCredentials: true
            });
            const updatedReview = { ...response.data.data, user: localReviews.find(r => r._id === reviewId).user };
            updateReviewInState(updatedReview);
        } catch (err) {
            setError('Failed to dislike the review.');
        }
    };

    const handleEdit = async (reviewId, newComment, newRating) => {
        try {
            const response = await axios.put('http://localhost:8000/reviews/edit', {
                reviewId,
                comment: newComment,
                rating: newRating
            }, {
                withCredentials: true
            });
            updateReviewInState(response.data.data);
        } catch (err) {
            setError('Failed to edit the review.');
        }
    };

    const handleDelete = async (reviewId) => {
        try {
            await axios.delete('http://localhost:8000/reviews/delete', {
                data: { reviewId },
                withCredentials: true
            });
            setLocalReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId));
        } catch (err) {
            setError('Failed to delete the review.');
        }
    };

    const updateReviewInState = (updatedReview) => {
        setLocalReviews((prevReviews) =>
            prevReviews.map((review) =>
                review._id === updatedReview._id
                    ? { ...review, ...updatedReview, user: review.user }
                    : review
            )
        );
    };

    return (
        <div>
            <h3>Reviews</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {localReviews.map((review) => (
                    <li key={review._id}>
                        <strong>{review.user?.username || 'Unknown User'}</strong>
                        <p>{review.comment}</p>
                        <small>Rating: {review.rating}/10</small>
                        <div>
                            <button onClick={() => handleLike(review._id)}>Like ({review.likes?.length || 0})</button>
                            <button onClick={() => handleDislike(review._id)}>Dislike ({review.dislikes?.length || 0})</button>
                            {isAuthenticated && user?._id === review.user?._id && (
                                <>
                                    <button onClick={() => handleEdit(review._id, prompt('Edit your comment:', review.comment), prompt('Edit your rating:', review.rating))}>Edit</button>
                                    <button onClick={() => handleDelete(review._id)}>Delete</button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            {page < totalPages && (
                <button onClick={loadMoreReviews}>Load More</button>
            )}
        </div>
    );
};

export default ReviewsList;