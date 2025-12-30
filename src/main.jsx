// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import './styles/tokens.css';
import { ThemeProvider } from './context/ThemeContext.jsx'; // ✅ 추가 (경로 맞춰)

ReactDOM.createRoot(document.getElementById('root')).render(
   <React.StrictMode>
      {/* ✅ 여기서 전체를 ThemeProvider로 한 번 감싼다 */}
      <ThemeProvider>
         <BrowserRouter basename={import.meta.env.BASE_URL}>
            <App />
         </BrowserRouter>
      </ThemeProvider>
   </React.StrictMode>
);
