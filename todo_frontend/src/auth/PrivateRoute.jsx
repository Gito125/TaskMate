import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
// This component checks if the user is authenticated by looking for an access token in localStorage.
// If the token is not present, it redirects the user to the login page.