import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/users/login', {
        username,
        password,
      },{
        withCredentials: true // Include credentials in the request
      });

      if (response.status === 200) {
        authContext.login(response.data.token, response.data.user); // Use the context login function
        navigate('/'); // Redirect to home
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid username or password.');
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
      {/* Headings */}
      <div className="text-center mb-4">
        <h2 className="fw-bold">Unlock a world of endless entertainment</h2>
        <p className="lead">Login to Discover, Stream, and Enjoy!</p>
      </div>
      
      {/* Login Card */}
      <div className="card p-4 login-card shadow-lg" style={{ minWidth: '400px' }}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Username or Email:</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Password:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
  
  
  
};

export default Login;
