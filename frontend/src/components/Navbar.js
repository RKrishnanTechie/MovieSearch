import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faMicrophone } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [listening, setListening] = useState(false); // State to track if voice recognition is active
  const navigate = useNavigate();

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleSearch = async (e, searchQuery) => {
    if (e) {
      e.preventDefault();
    }

    const finalQuery = searchQuery || query;

    if (!isAuthenticated) {
      setError('You need to be logged in to search for movies.');
      return;
    }

    try {
      await axios.get(`http://localhost:8000/movies/search?query=${finalQuery}`, {
        withCredentials: true,
      });

      // Redirect to the search results page
      navigate(`/search?query=${finalQuery}`);
    } catch (err) {
      setError('Something went wrong with the search. Please try again.');
    }
  };

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setError("Voice search is not supported in your browser.");
      return;
    }

    setListening(true); // Indicate that voice recognition has started
  
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
  
    recognition.start();
  
    recognition.onresult = (event) => {
      let voiceQuery = event.results[0][0].transcript.trim();
      console.log("Recognized query:", voiceQuery);

      if (!voiceQuery) {
        setError("Voice recognition did not capture a valid query. Please try again.");
        setListening(false); // Stop indicating listening
        return;
      }

      setQuery(voiceQuery); // Set the query state with the recognized voice query
      handleSearch(null, voiceQuery); // Directly pass the recognized voice query to handleSearch
    };
  
    recognition.onerror = (event) => {
      setError("Voice recognition error: " + event.error);
      setListening(false); // Stop indicating listening on error
    };
  
    recognition.onend = () => {
      console.log("Voice search ended.");
      setListening(false); // Stop indicating listening when recognition ends
    };
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
              onChange={(e) => setQuery(e.target.value)}  // Update query on input change
              placeholder="Search for movies..."
              required
              style={{ flex: 1 }}
            />
            <button className="btn btn-outline-success" type="submit">Search</button>
            <button
              type="button"
              className={`btn btn-outline-danger ms-2 ${listening ? 'listening' : ''}`}  // Add a class when listening
              onClick={startVoiceSearch}
              style={{ color: listening ? 'red' : '' }} // Change color when listening
            >
              <FontAwesomeIcon icon={faMicrophone} />
            </button>
          </form>
          {listening && <p style={{ color: 'red', marginTop: '10px' }}>Listening...</p>}  {/* Show listening message */}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          <button onClick={toggleTheme} className="btn btn-outline-info ms-3">
            Toggle Theme
          </button>
        </div>
      </div>
      
    </nav>
  );
};

export default Navbar;
