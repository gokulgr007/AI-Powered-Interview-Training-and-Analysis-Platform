import { Navigate } from "react-router-dom";

// Login page removed — redirect to /app
const Login = () => {
  return <Navigate to="/app" replace />;
};

export default Login;
