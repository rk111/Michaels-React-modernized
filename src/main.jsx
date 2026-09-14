import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App.jsx';
import '@fontsource/arimo/400.css';
import '@fontsource/arimo/700.css';
import '@fontsource/yellowtail/400.css';
import './styles/tokens.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
