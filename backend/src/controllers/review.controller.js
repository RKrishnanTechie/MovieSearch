import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Review } from "../models/review.model.js";
import { Movie } from "../models/movie.model.js";
import { User } from "../models/user.model.js";

// Add a review/comment to a movie
const addReview = asyncHandler(async (req, res) => {
    const { movieId, comment, rating } = req.body;

    const user = req.user._id;

    // Check if the movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
        throw new ApiError(404, "Movie not found");
    }

    // Create and save the new review
    const review = new Review({
        user,
        movie: movieId,
        comment,
        rating,
    });

    await review.save();

    return res.status(201).json(new ApiResponse(201, review, "Review added successfully"));
});

// Edit an existing review/comment
const editReview = asyncHandler(async (req, res) => {
    const { reviewId, comment, rating } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    // Ensure the review belongs to the user
    if (review.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to edit this review");
    }

    // Update the review
    review.comment = comment;
    review.rating = rating;

    await review.save();

    return res.status(200).json(new ApiResponse(200, review, "Review updated successfully"));
});

// Delete a review/comment
const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    // Ensure the review belongs to the user
    if (review.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this review");
    }

   // Delete the review using deleteOne or findByIdAndDelete
   await Review.deleteOne({ _id: reviewId });

    return res.status(200).json(new ApiResponse(200, null, "Review deleted successfully"));
});

// Get all reviews for a specific movie
const getReviewsByMovie = asyncHandler(async (req, res) => {
    const { movieId } = req.params;

    const reviews = await Review.find({ movie: movieId }).populate('user', 'username');

    return res.status(200).json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

export {
    addReview,
    editReview,
    deleteReview,
    getReviewsByMovie
};
