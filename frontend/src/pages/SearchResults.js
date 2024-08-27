import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

const SearchResults = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search).get('query');

    if (query) {
      const fetchMovies = async () => {
        setLoading(true);
        setError('');
        try {
          const response = await axios.get(
            `http://localhost:8000/movies/search?query=${query}`, 
            {
              withCredentials: true, // Send cookies
            }
          );
          console.log(response.data); 
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
  }, [location.search]);

  return (
    <div>
      <h1 className="search-results-heading">Search Results</h1>
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
