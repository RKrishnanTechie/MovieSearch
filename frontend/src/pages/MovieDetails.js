import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReviewForm from '../components/ReviewForm';
import ReviewsList from '../components/ReviewsList';
import '../App.css';

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState({ reviews: [] }); // Initialize with an empty array for reviews
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/movies/${id}`, {
                    withCredentials: true,
                });
                console.log('Fetched Movie Details:', response.data.data); // Debugging
                setMovie({ ...response.data.data, reviews: response.data.data.reviews || [] }); // Ensure reviews is an array
                setLoading(false);
            } catch (error) {
                console.error('Error fetching movie details:', error);
                setLoading(false);
            }
        };

        const checkIfFavorite = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/favorites`, {
                    withCredentials: true, // Include credentials to handle authentication
                });
                const favorites = response.data.data || [];
                setIsFavorite(favorites.some(favMovie => favMovie.tmdbId === id));
            } catch (error) {
                console.error('Error fetching favorite movies:', error);
            }
        };

        fetchMovieDetails();
        checkIfFavorite();
    }, [id]);

    const handleFavoriteToggle = async () => {
        try {
            if (isFavorite) {
                // Remove from favorites
                await axios.post(`http://localhost:8000/favorites/remove`, { movieId: id }, {
                    withCredentials: true, // Include credentials to handle authentication
                });
                setIsFavorite(false);
            } else {
                // Add to favorites
                await axios.post(`http://localhost:8000/favorites/add`, { movieId: id }, {
                    withCredentials: true, // Include credentials to handle authentication
                });
                setIsFavorite(true);
            }
        } catch (error) {
            console.error('Error toggling favorite status:', error);
        }
    };

    const handleReviewAdded = (newReview) => {
        console.log('Added Review:', newReview); // Debugging
        setMovie((prevMovie) => ({
            ...prevMovie,
            reviews: [newReview, ...prevMovie.reviews], // Ensure the new review is at the top
        }));
    };

    if (loading) {
        return <div>Loading movie details...</div>;
    }

    if (!movie) {
        return <div>No movie details found.</div>;
    }

    return (
        <div className="movie-details">
          <div className="details-container">
            <img src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`} alt={movie.title} />
            <div className="info-container">
              <h1>{movie.title || 'N/A'}</h1>
              <p><strong>Overview:</strong> {movie.overview || 'N/A'}</p>
              <p><strong>Genres:</strong> {movie.genres?.join(', ') || 'N/A'}</p>
              <p><strong>Runtime:</strong> {movie.runtime || 'N/A'} minutes</p>
              <p><strong>Director:</strong> {movie.director || 'N/A'}</p>
              <div className="ott-providers">
                <p><strong>OTT Availability:</strong></p>
                {movie.ottProviders && movie.ottProviders.length > 0 ? (
                  <ul>
                    {movie.ottProviders.map((provider, index) => (
                      <li key={index}>
                        <a href={provider.url} target="_blank" rel="noopener noreferrer">
                          {provider.platform}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No OTT Providers available.</p>
                )}
              </div>
            </div>
          </div>
          <button onClick={handleFavoriteToggle} className="favorite-button">
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
    
          {/* Review Form */}
          <div className="add-review">
            <ReviewForm movieId={id} onReviewAdded={handleReviewAdded} />
          </div>
    
          {/* Reviews List */}
          <ReviewsList movieId={id} reviews={movie.reviews} />
        </div>
      );
};

export default MovieDetails;
