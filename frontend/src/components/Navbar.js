import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';
import axios from 'axios';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError('You need to be logged in to search for movies.');
      return;
    }

    try {
      await axios.get(`http://localhost:8000/movies/search?query=${query}`, {
        withCredentials: true,
      });

      // Redirect to the search results page
      navigate(`/search?query=${query}`);
    } catch (err) {
      setError('Something went wrong with the search. Please try again.');
    }
  };

  return (
    <nav>
      <Link to="/">Home</Link>
      {isAuthenticated ? (
        <>
          <Link to="/favorites">Favorites</Link>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
      <form onSubmit={handleSearch} style={{ display: 'inline', marginLeft: '20px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies..."
          required
        />
        <button type="submit">Search</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </nav>
  );
};

export default Navbar;
