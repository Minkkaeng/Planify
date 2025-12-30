// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ✅ 추가
import App from './App.jsx';
import './index.css';
import './styles/tokens.css';

ReactDOM.createRoot(document.getElementById('root')).render(
   <React.StrictMode>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
         <App />
      </BrowserRouter>
   </React.StrictMode>
);
