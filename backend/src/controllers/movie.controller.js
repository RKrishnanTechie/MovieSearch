import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import axios from 'axios';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Movie } from '../models/movie.model.js';

const tmdbApiKey = process.env.TMDB_API_KEY;

const searchMovies = asyncHandler(async (req, res) => {
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

// Helper function to fetch movie details and director from TMDB
const fetchMovieDetails = async (movieId) => {
    const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}`;
    const providersUrl = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`;

    // Append credits to the movie details request
    const [movieResponse, providersResponse] = await Promise.all([
        axios.get(movieUrl, {
            params: {
                api_key: tmdbApiKey,
                append_to_response: 'credits' // Appends credits to the movie details
            }
        }),
        axios.get(providersUrl, { params: { api_key: tmdbApiKey } })
    ]);

    if (!movieResponse.data) {
        throw new ApiError(404, "Movie not found");
    }

    const movieDetails = movieResponse.data;
    const watchProviders = providersResponse.data.results;

    // Extract the director's name from the appended credits
    const director = movieDetails.credits.crew.find(person => person.job === 'Director')?.name || 'Unknown';

    // Extract OTT providers, for example from the UK region
    const ottProviders = watchProviders?.GB?.flatrate?.map(provider => ({
        platform: provider.provider_name,
        url: `https://www.themoviedb.org/movie/${movieId}/watch`
    })) || [];

    

    return {
        tmdbId: movieDetails.id,
        title: movieDetails.title,
        overview: movieDetails.overview,
        posterPath: movieDetails.poster_path,
        releaseDate: movieDetails.release_date,
        genres: movieDetails.genres.map(genre => genre.name),
        runtime: movieDetails.runtime,
        director: director, // Store the director's name
        ottProviders: ottProviders, // Store OTT providers data
    };
};

// Get movie details along with OTT availability
const getMovieDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Movie ID is required");
    }

    // Check if the movie is already in the database
    let movie = await Movie.findOne({ tmdbId: id });

    if (!movie) {
        // Movie not found in the database, fetch it from TMDB API
        const movieDetails = await fetchMovieDetails(id);

        // Save the fetched movie details to the database
        movie = new Movie(movieDetails);
        await movie.save();
    }
 
    // console.log(" movie with OTT", movie)
    return res.status(200).json(new ApiResponse(200, movie, "Movie details fetched successfully"));
});


export {
    searchMovies,
    getMovieDetails,
};
