import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-105">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Campo Inteligente</h1>
          <p className="text-gray-600 text-lg">Gestión Ganadera Simplificada</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;