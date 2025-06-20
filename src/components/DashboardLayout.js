import React, { useState, useEffect } from 'react';

const DashboardLayout = ({ children, onNavigate }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('appTheme') || 'default');
  const [primaryColor, setPrimaryColor] = useState(() => localStorage.getItem('primaryColor') || '#4F46E5'); // Indigo 600
  const [secondaryColor, setSecondaryColor] = useState(() => localStorage.getItem('secondaryColor') || '#10B981'); // Emerald 500

  useEffect(() => {
    localStorage.setItem('appTheme', theme);
    localStorage.setItem('primaryColor', primaryColor);
    localStorage.setItem('secondaryColor', secondaryColor);
  }, [theme, primaryColor, secondaryColor]);

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return {
          bg: 'bg-gray-900',
          sidebarBg: 'bg-gray-800',
          text: 'text-gray-100',
          border: 'border-gray-700',
          headerBg: 'bg-gray-800',
          shadow: 'shadow-lg',
          hoverBg: 'hover:bg-gray-700',
          buttonBg: 'bg-gray-700',
          buttonHover: 'hover:bg-gray-600',
          redButtonBg: 'bg-red-700',
          redButtonHover: 'hover:bg-red-800',
        };
      case 'light':
        return {
          bg: 'bg-gray-50',
          sidebarBg: 'bg-white',
          text: 'text-gray-800',
          border: 'border-gray-200',
          headerBg: 'bg-white',
          shadow: 'shadow-md',
          hoverBg: 'hover:bg-gray-100',
          buttonBg: 'bg-gray-200 text-gray-800',
          buttonHover: 'hover:bg-gray-300',
          redButtonBg: 'bg-red-500',
          redButtonHover: 'hover:bg-red-600',
        };
      default: // default (uses custom colors)
        return {
          bg: 'bg-gray-100',
          sidebarBg: 'bg-gray-800',
          text: 'text-white',
          border: 'border-gray-700',
          headerBg: 'bg-white',
          shadow: 'shadow-md',
          hoverBg: 'hover:bg-gray-700',
          buttonBg: 'bg-gray-700',
          buttonHover: 'hover:bg-gray-600',
          redButtonBg: 'bg-red-600',
          redButtonHover: 'hover:bg-red-700',
        };
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <div className={`min-h-screen flex ${themeClasses.bg}`}>
      {/* Sidebar */}
      <div className={`w-64 ${themeClasses.sidebarBg} ${themeClasses.text} flex flex-col`}>
        <div className={`p-4 text-2xl font-bold border-b ${themeClasses.border}`}>
          Campo Inteligente
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2 p-4">
            <li>
              <button
                onClick={() => onNavigate('dashboard')}
                className={`w-full text-left px-4 py-2 rounded-lg ${themeClasses.hoverBg} transition-colors`}
                style={theme === 'default' ? { '--tw-ring-color': primaryColor } : {}}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('animalRegistration')}
                className={`w-full text-left px-4 py-2 rounded-lg ${themeClasses.hoverBg} transition-colors`}
                style={theme === 'default' ? { '--tw-ring-color': primaryColor } : {}}
              >
                Registro Animal
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('sanitaryControl')}
                className={`w-full text-left px-4 py-2 rounded-lg ${themeClasses.hoverBg} transition-colors`}
                style={theme === 'default' ? { '--tw-ring-color': primaryColor } : {}}
              >
                Control Sanitario
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('reproductiveControl')}
                className={`w-full text-left px-4 py-2 rounded-lg ${themeClasses.hoverBg} transition-colors`}
                style={theme === 'default' ? { '--tw-ring-color': primaryColor } : {}}
              >
                Control Reproductivo
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('productionControl')}
                className={`w-full text-left px-4 py-2 rounded-lg ${themeClasses.hoverBg} transition-colors`}
                style={theme === 'default' ? { '--tw-ring-color': primaryColor } : {}}
              >
                Control de Producción
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('inventory')}
                className={`w-full text-left px-4 py-2 rounded-lg ${themeClasses.hoverBg} transition-colors`}
                style={theme === 'default' ? { '--tw-ring-color': primaryColor } : {}}
              >
                Inventario
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('economicManagement')}
                className={`w-full text-left px-4 py-2 rounded-lg ${themeClasses.hoverBg} transition-colors`}
                style={theme === 'default' ? { '--tw-ring-color': primaryColor } : {}}
              >
                Gestión Económica
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('personnelManagement')}
                className={`w-full text-left px-4 py-2 rounded-lg ${themeClasses.hoverBg} transition-colors`}
                style={theme === 'default' ? { '--tw-ring-color': primaryColor } : {}}
              >
                Gestión de Personal
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('supplierClientManagement')}
                className={`w-full text-left px-4 py-2 rounded-lg ${themeClasses.hoverBg} transition-colors`}
                style={theme === 'default' ? { '--tw-ring-color': primaryColor } : {}}
              >
                Clientes y Proveedores
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('subscriptionPlans')}
                className={`w-full text-left px-4 py-2 rounded-lg ${themeClasses.hoverBg} transition-colors`}
                style={theme === 'default' ? { '--tw-ring-color': primaryColor } : {}}
              >
                Planes de Suscripción
              </button>
            </li>
            <li>
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`w-full text-left px-4 py-2 rounded-lg ${themeClasses.hoverBg} transition-colors`}
                style={theme === 'default' ? { '--tw-ring-color': primaryColor } : {}}
              >
                Configuración / Soporte
              </button>
            </li>
          </ul>
        </nav>
        <div className={`p-4 border-t ${themeClasses.border}`}>
          <button
            onClick={() => onNavigate('logout')}
            className={`w-full text-left px-4 py-2 rounded-lg ${themeClasses.redButtonBg} ${themeClasses.redButtonHover} transition-colors`}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className={`flex justify-between items-center p-4 ${themeClasses.headerBg} ${themeClasses.shadow}`}>
          <h1 className={`text-2xl font-semibold ${themeClasses.text === 'text-white' ? 'text-gray-800' : themeClasses.text}`}>Dashboard</h1>
          {/* Aquí podrías añadir un perfil de usuario o notificaciones */}
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
          {children}
        </main>
      </div>

      {/* Settings Modal/Sidebar */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className={`w-80 ${themeClasses.sidebarBg} p-6 ${themeClasses.text} shadow-lg overflow-y-auto`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Configuración</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Tema de Interfaz</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    value="default"
                    checked={theme === 'default'}
                    onChange={() => setTheme('default')}
                    className="form-radio h-4 w-4 text-black"
                  />
                  <span className="ml-2 text-gray-700">Predeterminado (Colores Personalizados)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={theme === 'light'}
                    onChange={() => setTheme('light')}
                    className="form-radio h-4 w-4 text-black"
                  />
                  <span className="ml-2 text-gray-700">Claro</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={theme === 'dark'}
                    onChange={() => setTheme('dark')}
                    className="form-radio h-4 w-4 text-black"
                  />
                  <span className="ml-2 text-gray-700">Oscuro</span>
                </label>
              </div>
            </div>

            {theme === 'default' && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Colores Personalizados</h3>
                <div className="mb-4">
                  <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-1">Color Primario</label>
                  <input
                    type="color"
                    id="primaryColor"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full h-10 rounded-lg border-none"
                  />
                </div>
                <div>
                  <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700 mb-1">Color Secundario</label>
                  <input
                    type="color"
                    id="secondaryColor"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-full h-10 rounded-lg border-none"
                  />
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Idioma</h3>
              <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black">
                <option>Español</option>
                <option>English</option>
                {/* Más opciones de idioma */}
              </select>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Soporte</h3>
              <p className="text-gray-700 text-sm mb-2">¿Necesitas ayuda? Contáctanos:</p>
              <p className="text-gray-700 text-sm">Email: soporte@campointeligente.com</p>
              <p className="text-gray-700 text-sm">Teléfono: +52 55 1234 5678</p>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Enviar Mensaje de Soporte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;