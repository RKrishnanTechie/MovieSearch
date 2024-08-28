import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm } from '@fortawesome/free-solid-svg-icons';

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
      <Link className="navbar-brand" to="/" style={{ padding: '0 15px', fontWeight: 'bold', fontSize: '24px' }}>
       M <FontAwesomeIcon icon={faFilm} style={{ marginRight: '5px', color: '#ff3d00' }} />
        vieHunt
      </Link>
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
              <Link className="nav-link" to="/" style={{ padding: '0 15px' }}>Home</Link>
            </li>
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/favorites" style={{ padding: '0 15px' }}>Favorites</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light" onClick={logout} style={{ padding: '0 15px' }}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" style={{ padding: '0 15px' }}>Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register" style={{ padding: '0 15px' }}>Register</Link>
                </li>
              </>
            )}
          </ul>
          <form className="d-flex mx-auto" onSubmit={handleSearch} style={{ maxWidth: '500px', width: '100%' }}>
            <input
              className="form-control me-2"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies..."
              required
              style={{ flex: 1 }}
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
