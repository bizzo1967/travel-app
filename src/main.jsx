import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';
import { TripProvider } from './context/TripContext.jsx';
import { registerSW } from 'virtual:pwa-register';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TripProvider>
      <App />
    </TripProvider>
  </React.StrictMode>
);

registerSW({ immediate: true });