import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Wrapper component to handle redirect from 404.html
const AppWithRedirectHandler: React.FC = () => {
  // After the app mounts, check if there's a redirect path stored in sessionStorage
  useEffect(() => {
    const redirectPath = sessionStorage.getItem('redirectPath');
    
    if (redirectPath) {
      // Clear the redirect path from sessionStorage
      sessionStorage.removeItem('redirectPath');
      
      // Get the base path for the GitHub Pages site
      const basePath = '/home';
      
      // If we have a redirect path, navigate to that route inside the app
      // This needs to be done after a slight delay to allow the router to initialize
      setTimeout(() => {
        window.history.pushState({}, '', basePath + redirectPath);
        // Dispatch a popstate event so the router can detect the change
        window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
      }, 100);
    }
  }, []);

  return <App />;
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AppWithRedirectHandler />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
