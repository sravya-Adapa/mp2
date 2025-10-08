// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import 'normalize.css';       // keep only if this file exists in your project
import './index.css';
import './App.css';
import 'normalize.css';

import App from './App';
import reportWebVitals from './reportWebVitals';
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/mp2">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();






