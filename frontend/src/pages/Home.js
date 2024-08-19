import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Redirect to the search results page with the query as a URL parameter
      navigate(`/search?query=${query}`);
    }
  };

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the Movie Search App!</p>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default Home;
