import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Movie } from "../models/movie.model.js";

// Add a movie to favorites
const addFavoriteMovie = asyncHandler(async (req, res) => {
    const { movieId } = req.body;
    const user = await User.findById(req.user._id);

    // Check if the movie is already in the user's favorites
    const favoriteMovie = await Movie.findOne({ tmdbId: movieId });

    if (favoriteMovie && user.favorites.includes(favoriteMovie._id)) {
        throw new ApiError(400, "Movie already in favorites");
    }

    if (!favoriteMovie) {
        throw new ApiError(404, "Movie details not found in the database. Please fetch the movie details first.");
    }

    // Add movie to user's favorites
    user.favorites.push(favoriteMovie._id);
    await user.save();

    return res.status(200).json(new ApiResponse(200, user.favorites, "Movie added to favorites"));
});

// Remove a movie from favorites
const removeFavoriteMovie = asyncHandler(async (req, res) => {
    const { movieId } = req.body;
    const user = await User.findById(req.user._id);

    // Find the movie in the user's favorites
    const favoriteMovie = await Movie.findOne({ tmdbId: movieId });

    if (!favoriteMovie || !user.favorites.includes(favoriteMovie._id)) {
        throw new ApiError(400, "Movie not in favorites");
    }

    user.favorites.pull(favoriteMovie._id);
    await user.save();

    return res.status(200).json(new ApiResponse(200, user.favorites, "Movie removed from favorites"));
});

// Get all favorite movies for the current user
const getFavoriteMovies = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('favorites');

    return res.status(200).json(new ApiResponse(200, user.favorites, "Favorites fetched successfully"));
});

export {
    addFavoriteMovie,
    removeFavoriteMovie,
    getFavoriteMovies
};
