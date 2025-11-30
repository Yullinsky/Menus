import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Utensils, Settings } from 'lucide-react';
import Home from './pages/Home';
import Admin from './pages/Admin';

function App() {
  const location = useLocation();

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="container navbar-content">
          <div className="logo-section">
            <Link to="/" className="logo">
              <Utensils className="icon" />
              <span>Yullinsky Menú SMAE</span>
            </Link>
          </div>
          <div className="nav-links">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Menú
            </Link>
            <Link 
              to="/admin" 
              className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
            >
              <Settings className="icon-small" />
              Administrar
            </Link>
          </div>
        </div>
      </nav>

      <main className="container main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
