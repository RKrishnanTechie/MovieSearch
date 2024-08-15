import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import axios from 'axios';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Movie } from "../models/movie.model.js";

const tmdbApiKey = process.env.TMDB_API_KEY;

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

// Add a movie to favorites
const addFavoriteMovie = asyncHandler(async (req, res) => {
    const { movieId } = req.body;
    const user = await User.findById(req.user._id);

    // Check if the movie is already in the user's favorites
    const favoriteMovie = await Movie.findOne({ tmdbId: movieId });

    if (favoriteMovie && user.favorites.includes(favoriteMovie._id)) {
        throw new ApiError(400, "Movie already in favorites");
    }

    let movie;
    if (!favoriteMovie) {
        // Fetch movie details from TMDB and save to the database
        const movieDetails = await fetchMovieDetails(movieId);
        movie = new Movie(movieDetails);
        await movie.save();
        // console.log("Movie saved to database:", movie);
    } else {
        movie = favoriteMovie;
    }

    // Add movie to user's favorites
    user.favorites.push(movie._id);
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, user.favorites, "Movie added to favorites"));
});

// Remove a movie from favorites
const removeFavoriteMovie = asyncHandler(async (req, res) => {
    const { movieId } = req.body;
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
