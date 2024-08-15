import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import axios from 'axios';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const tmdbApiKey = process.env.TMDB_API_KEY;
// console.log("API key:", tmdbApiKey)
// console.log(process.env)

// Search for movies by query
const searchMovies = asyncHandler(async (req, res) => {
    console.log("TMDB API Key being used:", tmdbApiKey);
    const { query } = req.query;

   

    if (!query) {
        throw new ApiError(400, "Search query is required");
    }

    const apiUrl = `https://api.themoviedb.org/3/search/movie`;
    const response = await axios.get(apiUrl, {
        params: {
            api_key: tmdbApiKey,
            query,
        },
    });

    if (response.data.results.length === 0) {
        throw new ApiError(404, "No movies found");
    }

    return res.status(200).json(new ApiResponse(200, response.data.results, "Movies fetched successfully"));
});

// Get movie details along with OTT availability
const getMovieDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Movie ID is required");
    }

    // Fetch movie details
    const movieUrl = `https://api.themoviedb.org/3/movie/${id}`;
    const movieResponse = await axios.get(movieUrl, {
        params: {
            api_key: tmdbApiKey,
        },
    });

    if (!movieResponse.data) {
        throw new ApiError(404, "Movie not found");
    }

    // Fetch OTT availability
    const providersUrl = `https://api.themoviedb.org/3/movie/${id}/watch/providers`;
    const providersResponse = await axios.get(providersUrl, {
        params: {
            api_key: tmdbApiKey,
        },
    });

    const movieDetails = movieResponse.data;
    const watchProviders = providersResponse.data.results;

    return res.status(200).json(new ApiResponse(200, {
        ...movieDetails,
        watchProviders: watchProviders.UK, // we want UK providers, adjust region as needed
    }, "Movie details fetched successfully"));
});

export {
    searchMovies,
    getMovieDetails,
};
