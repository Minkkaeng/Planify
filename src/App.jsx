import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';

function App() {
   return (
      <ThemeProvider>
         <BrowserRouter>
            <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/tasks" element={<Tasks />} />
               <Route path="/calendar" element={<Calendar />} />
               <Route path="/settings" element={<Settings />} />
            </Routes>
         </BrowserRouter>
      </ThemeProvider>
   );
}

export default App;
