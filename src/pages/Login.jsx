import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="card w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-indigo-100 p-3 rounded-full mb-3">
            <Lock className="text-indigo-600 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Acceso Administrativo</h1>
          <p className="text-slate-500 text-sm">Ingresa tus credenciales para continuar</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="label">Correo Electrónico</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@ejemplo.com"
            />
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-full py-2 mt-4"
            disabled={loading}
          >
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
