import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../App.css';

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/movies/${id}`, {
                    withCredentials: true,
                });
                
                setMovie(response.data.data); //  the response format from  backend
                setLoading(false);
            } catch (error) {
                console.error('Error fetching movie details:', error);
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

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
            <div className="info-container"></div>
            <h1>{movie.title || 'N/A'}</h1>
            <p><strong>Overview:</strong> {movie.overview || 'N/A'}</p>
            <p><strong>Genres:</strong> {movie.genres?.join(', ') || 'N/A'}</p>
            <p><strong>Runtime:</strong> {movie.runtime || 'N/A'} minutes</p>
            <p><strong>Director:</strong> {movie.director || 'N/A'}</p>
            <div className="ott-providers">
            <p><strong> OTT Availability: </strong></p>
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
        
    );
};

export default MovieDetails;
