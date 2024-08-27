import React, { createContext, useState , useEffect} from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children, navigate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('authToken'));
  const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = Cookies.get('user'); // Assume you store user data in cookies
//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser)); // Parse the user data if stored as JSON string
//       } catch (error) {
//         console.error('Error parsing user data from cookies:', error);
//       }
//     }
//   }, []);
  
  const login = (token, userData) => {
    Cookies.set('authToken', token, { expires: 1 });
    Cookies.set('user', JSON.stringify(userData), { expires: 1 }); // Store user data in cookies
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    Cookies.remove('authToken');
    Cookies.remove('user'); // Remove user data from cookies
    setIsAuthenticated(false);
    setUser(null);
    navigate('/'); // Redirect to Home after logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
