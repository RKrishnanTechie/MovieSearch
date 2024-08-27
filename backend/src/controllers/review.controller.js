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

    // Check if the movie exists by tmdbId
    const movie = await Movie.findOne({ tmdbId: movieId });
    if (!movie) {
        throw new ApiError(404, "Movie not found");
    }

    // Create and save the new review
    let review = new Review({
        user,
        movie: movie._id, // Store the ObjectId of the movie
        comment,
        rating,
    });

    await review.save();
    
    // Populate user data
     review = await review.populate('user', 'username');

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

// Like a review
const likeReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.body;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    // Ensure the user hasn't already liked the review
    if (!review.likes.includes(userId)) {
        review.likes.push(userId);
        review.dislikes = review.dislikes.filter(id => id.toString() !== userId.toString());  // Remove user from dislikes if present
    }

    await review.save();

    // Populate the user field after saving
    const populatedReview = await Review.findById(reviewId).populate('user', 'username');

    return res.status(200).json(new ApiResponse(200, populatedReview, "Review liked successfully"));
});


// Dislike a review
const dislikeReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.body;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    // Ensure the user hasn't already disliked the review
    if (!review.dislikes.includes(userId)) {
        review.dislikes.push(userId);
        review.likes = review.likes.filter(id => id.toString() !== userId.toString());  // Remove user from likes if present
    }

    await review.save();

    // Populate the user field after saving
    const populatedReview = await Review.findById(reviewId).populate('user', 'username');

    return res.status(200).json(new ApiResponse(200, populatedReview, "Review disliked successfully"));
});

// Get all reviews for a specific movie with pagination
const getReviewsByMovie = asyncHandler(async (req, res) => {
    const { movieId } = req.params;
    const { page = 1, limit = 5 } = req.query;  // Default to page 1 and limit of 5 reviews per page

    // Find the movie by tmdbId
    const movie = await Movie.findOne({ tmdbId: movieId });
    if (!movie) {
        throw new ApiError(404, "Movie not found");
    }

    // Fetch reviews for the movie
    const reviews = await Review.find({ movie: movie._id })
        .populate('user', 'username')
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .exec();

    const totalReviews = await Review.countDocuments({ movie: movie._id });

    return res.status(200).json(new ApiResponse(200, {
        reviews,
        totalPages: Math.ceil(totalReviews / limit),
        currentPage: page,
        totalReviews
    }, "Reviews fetched successfully"));
});

export {
    addReview,
    editReview,
    deleteReview,
    getReviewsByMovie,
    likeReview,
    dislikeReview
};
