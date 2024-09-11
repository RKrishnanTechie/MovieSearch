import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

const SearchResults = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]); // New state for genres
  const [selectedGenre, setSelectedGenre] = useState(''); // Track selected genre
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Fetch genres when component mounts
    const fetchGenres = async () => {
      try {
        const response = await axios.get('http://localhost:8000/movies/genres', {
          withCredentials: true,
        });
        setGenres(response.data.data || []);
      } catch (error) {
        console.error('Error fetching genres:', error);
        setError('Failed to fetch genres.');
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(location.search).get('query');

    if (query || selectedGenre) {
      const fetchMovies = async () => {
        setLoading(true);
        setError('');
        try {
          // If a genre is selected, include it in the request
          const response = await axios.get(
            `http://localhost:8000/movies/search?query=${query || ''}&genreId=${selectedGenre}`, 
            { withCredentials: true }
          );
          setMovies(response.data.data || []);
        } catch (error) {
          console.error('Error fetching movies:', error);
          setError('Failed to fetch movies. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      fetchMovies();
    }
  }, [location.search, selectedGenre]);

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

  return (
    <div>
      <h1 className="search-results-heading">Search Results</h1>

      <div className="genre-filter-container">
      <label htmlFor="genre-filter" className="genre-filter-label">Filter by Genre:</label>
      <select
        id="genre-filter"
        className="form-select genre-filter"
        value={selectedGenre}
        onChange={handleGenreChange}
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : movies.length > 0 ? (
        <div className="movies-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <Link to={`/movies/${movie.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
                <p>{movie.title}</p>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No movies found.</p>
      )}
    </div>
  );
};

export default SearchResults;
