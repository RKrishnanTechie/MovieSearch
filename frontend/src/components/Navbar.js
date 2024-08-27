import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';
import axios from 'axios';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Load theme from localStorage
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <div className="container-fluid">
      <Link className="navbar-brand" to="/">Movie Search App</Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/favorites">Favorites</Link>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-light" onClick={logout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
        <form className="d-flex" onSubmit={handleSearch}>
          <input
            className="form-control me-2"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies..."
            required
          />
          <button className="btn btn-outline-success" type="submit">Search</button>
        </form>
        <button onClick={toggleTheme} className="btn btn-outline-info ms-3">
          Toggle Theme
        </button>
      </div>
    </div>
    {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
  </nav>
  );
};

export default Navbar;
