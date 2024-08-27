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
        <div>
            <h1>Your Favorites</h1>
            {favorites.length > 0 ? (
                <ul>
                    {favorites.map((movie) => (
                        <li key={movie._id}>
                            <Link to={`/movies/${movie.tmdbId}`}>
                                <img src={`https://image.tmdb.org/t/p/w200${movie.posterPath}`} alt={movie.title} />
                                <p>{movie.title}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You have no favorite movies yet.</p>
            )}
        </div>
    );
};

export default Favorites;
