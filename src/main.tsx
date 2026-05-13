import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// CRITICAL: Add logging to verify React mounting
console.log('=== REACT MAIN.TSX LOADED ===');
console.log('React version:', React.version);
console.log('Looking for root element...');

const rootElement = document.getElementById('root');
console.log('Root element found:', rootElement);

if (rootElement) {
  console.log('Creating React root...');
  const root = ReactDOM.createRoot(rootElement);
  console.log('React root created, rendering App...');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  console.log('App rendered successfully');
} else {
  console.error('ERROR: Root element not found!');
}

console.log('=== REACT MAIN.TSX COMPLETE ===');
