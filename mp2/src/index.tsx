// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './normalize.css';       // keep only if this file exists in your project
import './index.css';
import './App.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

// This lets the app work both locally ("/") and on GitHub Pages ("/<repo>")
const basename = process.env.PUBLIC_URL || '/';

// Grab the #root element from public/index.html
const container = document.getElementById('root') as HTMLElement;

// Create the React root and render the app with BrowserRouter
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Optional CRA performance hook
reportWebVitals();



// const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
//
// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );


