import { Navigate } from "react-router-dom";

// Home page removed — redirect to /app
const Home = () => {
  return <Navigate to="/app" replace />;
};

export default Home;
