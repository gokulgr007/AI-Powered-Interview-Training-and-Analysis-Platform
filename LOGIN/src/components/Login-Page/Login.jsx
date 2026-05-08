import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import AuthPage from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/not-found";
import axios from "axios";

function Router({ closeModal, onGoogleSuccess }) {
  // Provide a fallback closeModal so AuthPage renders as a popup/modal
  const fallbackClose = () => {
    try {
      // navigate back to home if modal is closed
      window.location.replace("/");
    } catch (e) {}
  };

  const closeHandler = typeof closeModal === "function" ? closeModal : fallbackClose;

  return (
    <Switch>
      <Route path="/auth">{() => <AuthPage closeModal={closeHandler} onGoogleSuccess={onGoogleSuccess} />}</Route>
      <Route path="/home" component={Dashboard} />
      <Route path="/" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Login(props) {
  // Google login handler similar to the one in Login1.jsx
  const handleGoogleSuccess = async (res) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/google",
        { credential: res.credential }
      );

      const userData = response.data.user || {};
      const normalizedUser = {
        name: userData.name,
        email: userData.email,
        avatar:
          userData.picture ||
          userData.avatar ||
          userData.photoURL ||
          userData.imageUrl ||
          userData.image ||
          (userData.photos && userData.photos[0]?.value) ||
          null,
      };

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));

      try {
        if (typeof props.closeModal === "function") props.closeModal();
      } catch (e) {}

      // navigate to home
      window.location.replace("/home");
    } catch (err) {
      alert(err?.response?.data?.message || "Google Login Failed");
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router closeModal={props.closeModal} onGoogleSuccess={handleGoogleSuccess} />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default Login;


