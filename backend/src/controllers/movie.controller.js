import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import axios from 'axios';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Movie } from '../models/movie.model.js';

const tmdbApiKey = process.env.TMDB_API_KEY;

// Controller for fetching genres
const fetchGenres = asyncHandler(async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/genre/movie/list?api_key=${tmdbApiKey}&language=en-US`
        );
        return res.status(200).json(new ApiResponse(200, response.data.genres, "Genres fetched successfully"));
    } catch (error) {
        console.error('Error fetching genres:', error.response || error);
        throw new ApiError(error.response?.status || 500, 'Failed to fetch genres');
    }
});


const searchMovies = asyncHandler(async (req, res) => {
    const { query, genreId } = req.query;

    if (!query && !genreId) {
        throw new ApiError(400, "Search query or genre is required");
    }

    try {
        const apiUrl = genreId
            ? `https://api.themoviedb.org/3/discover/movie`
            : `https://api.themoviedb.org/3/search/movie`;

        const params = {
            api_key: tmdbApiKey,
            ...(query && { query }),
            ...(genreId && { with_genres: genreId }),
        };

        const response = await axios.get(apiUrl, { params });

        if (response.data.results.length === 0) {
            throw new ApiError(404, "No movies found");
        }

        return res.status(200).json(new ApiResponse(200, response.data.results, "Movies fetched successfully"));
    } catch (error) {
        console.error('Error searching movies:', error.response || error);
        throw new ApiError(error.response?.status || 500, error.response?.data?.status_message || 'Failed to search movies');
    }
});


// Helper function to fetch movie details and director from TMDB
const fetchMovieDetails = async (movieId) => {
    try {
        const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}`;
        const providersUrl = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`;

        const [movieResponse, providersResponse] = await Promise.all([
            axios.get(movieUrl, {
                params: {
                    api_key: tmdbApiKey,
                    append_to_response: 'credits'
                }
            }),
            axios.get(providersUrl, { params: { api_key: tmdbApiKey } })
        ]);

        const movieDetails = movieResponse.data;
        const watchProviders = providersResponse.data.results;

        const director = movieDetails.credits.crew.find(person => person.job === 'Director')?.name || 'Unknown';

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
            director: director,
            ottProviders: ottProviders,
        };
    } catch (error) {
        if (error.response && error.response.status === 404) {
            throw new ApiError(404, "Movie not found");
        }
        console.error('Error fetching movie details:', error.response || error);
        throw new ApiError(error.response?.status || 500, error.response?.data?.status_message || 'Failed to fetch movie details');
    }
};

// Get movie details along with OTT availability
const getMovieDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Movie ID is required");
    }

    try {
        let movie = await Movie.findOne({ tmdbId: id });

        if (!movie) {
            const movieDetails = await fetchMovieDetails(id);
            movie = new Movie(movieDetails);
            await movie.save();
        }

        return res.status(200).json(new ApiResponse(200, movie, "Movie details fetched successfully"));
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        console.error('Error in getMovieDetails:', error);
        throw new ApiError(500, 'An error occurred while fetching movie details');
    }
});

export {
    searchMovies,
    getMovieDetails,
    fetchGenres
};