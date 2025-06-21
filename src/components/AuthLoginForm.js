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
    <form onSubmit={handleLogin} className="bg-white dark:bg-gray-800 p-8 rounded-card shadow-lg space-y-6 w-full max-w-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">Iniciar Sesión</h2>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
        <input
          type="email"
          id="email"
          className="input-default"
          placeholder="tu.email@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
        <input
          type="password"
          id="password"
          className="input-default"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary w-full py-3" // Added py-3 for larger click target
      >
        Iniciar Sesión
      </button>
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        ¿No tienes una cuenta?{' '}
        <button
          type="button"
          onClick={onNavigateToRegister}
          className="font-medium text-brand-primary hover:underline dark:text-brand-primary-dark"
        >
          Regístrate aquí
        </button>
      </p>
    </form>
  );
};

export default AuthLoginForm;