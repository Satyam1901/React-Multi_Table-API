import React from 'react';
import { createRoot } from 'react-dom/client';  // ← NEW IMPORT
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);              // ← CREATE ROOT
root.render(                                     // ← USE root.render()
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
