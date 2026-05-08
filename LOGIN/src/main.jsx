import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import normalizeLocalUser from './utils/normalizeLocalUser'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId="1079124396680-8qe7tbhs8a16vrobka3haoe7sst68c7t.apps.googleusercontent.com">
        {
          // run quick normalization on startup to fix legacy localStorage entries
          normalizeLocalUser()
        }
        <App />
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
