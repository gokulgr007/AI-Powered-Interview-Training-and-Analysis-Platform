import React, { useState, useEffect } from 'react';
import App from './CompanySimulation.jsx';
import Report from './Report.jsx';

export default function Router() {
  const [path, setPath] = useState(window.location.pathname || '/');

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname || '/');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (to) => {
    if (to === path) return;
    window.history.pushState({}, '', to);
    setPath(to);
  };

  if (path === '/report') return <Report navigate={navigate} />;
  return <App navigate={navigate} />;
}
