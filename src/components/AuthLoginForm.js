import React, { useState } from 'react';

const AuthLoginForm = ({ onLoginSuccess, onNavigateToRegister, registeredUsers }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    if (user) {
      onLoginSuccess(user);
    } else {
      alert('Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          id="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="tu.email@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
        <input
          type="password"
          id="password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
      >
        Iniciar Sesión
      </button>
      <p className="text-center text-gray-600">
        ¿No tienes una cuenta?{' '}
        <button
          type="button"
          onClick={onNavigateToRegister}
          className="text-blue-600 font-medium hover:underline"
        >
          Regístrate aquí
        </button>
      </p>
    </form>
  );
};

export default AuthLoginForm;