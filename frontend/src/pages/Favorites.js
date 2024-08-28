import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get('http://localhost:8000/favorites', {
                    withCredentials: true, // Include credentials to handle authentication
                });
                setFavorites(response.data.data); // Assuming your API response structure
            } catch (error) {
                console.error('Error fetching favorite movies:', error);
            }
        };

        fetchFavorites();
    }, []);

    return (
        <div className="favorites-container">
          <h1 className="favorites-heading">My Favorites ❤</h1>
          {favorites.length > 0 ? (
            <div className="favorites-grid">
              {favorites.map((movie) => (
                <div key={movie._id} className="favorite-card">
                  <Link to={`/movies/${movie.tmdbId}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.posterPath}`}
                      alt={movie.title}
                    />
                    <p>{movie.title}</p>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-favorites">You have no favorite movies yet.</p>
          )}
        </div>
      );
      
};

export default Favorites;
