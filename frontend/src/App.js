import './App.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Favorites from './pages/Favorites';
import MovieDetails from './pages/MovieDetails';
import SearchResults from './pages/SearchResults';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/authContext';
import ProtectedRoute from './components/ProtectedRoute'; 

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();

  return <AuthProvider navigate={navigate}>{children}</AuthProvider>;
};

function App() {
  return (
    <Router>
      <AuthWrapper>
    
  
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/favorites" element={<ProtectedRoute element={Favorites}/>}/>
      </Routes>
      </AuthWrapper>
      </Router>
    
  );
}

export default App;
