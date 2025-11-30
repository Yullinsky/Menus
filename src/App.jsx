import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Utensils, Settings, LogOut } from 'lucide-react';
import { supabase } from './supabaseClient';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';

function App() {
  const location = useLocation();
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const ProtectedRoute = ({ children }) => {
    if (!session) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

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
            {session ? (
              <>
                <Link 
                  to="/admin" 
                  className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                >
                  <Settings className="icon-small" />
                  Administrar
                </Link>
                <button 
                  onClick={handleLogout}
                  className="nav-link"
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                >
                  <LogOut className="icon-small" />
                  Salir
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
              >
                <Settings className="icon-small" />
                Acceso Admin
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="container main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!session ? <Login /> : <Navigate to="/admin" />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
