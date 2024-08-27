import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import  AuthContext  from '../context/authContext';

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? <Element {...rest} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
