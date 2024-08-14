import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { User} from "../models/user.model.js";

// Add a movie to favorites
const addFavoriteMovie = asyncHandler(async (req, res) => {
    const {
        movieId
    } = req.body;
    const user = await User.findById(req.user._id);

    if (user.favorites.includes(movieId)) {
        throw new ApiError(400, "Movie already in favorites");
    }

    user.favorites.push(movieId);
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, user.favorites, "Movie added to favorites"));
});

// Remove a movie from favorites
const removeFavoriteMovie = asyncHandler(async (req, res) => {
    const {
        movieId
    } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.favorites.includes(movieId)) {
        throw new ApiError(400, "Movie not in favorites");
    }

    user.favorites.pull(movieId);
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, user.favorites, "Movie removed from favorites"));
});

// Get all favorite movies for the current user
const getFavoriteMovies = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('favorites');

    return res
        .status(200)
        .json(new ApiResponse(200, user.favorites, "Favorites fetched successfully"));
});

export {
    addFavoriteMovie,
    removeFavoriteMovie,
    getFavoriteMovies
};