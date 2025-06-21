import React, { useState, useEffect, useMemo } from 'react';
import {
  HomeIcon, DocumentPlusIcon, ShieldCheckIcon, UsersIcon, ChartBarIcon, ArchiveBoxIcon,
  BanknotesIcon, UserGroupIcon, BuildingStorefrontIcon, CreditCardIcon, Cog6ToothIcon, XMarkIcon
} from '@heroicons/react/24/outline';

const colorPalettes = [
  {
    name: 'Indigo & Emerald (Default)',
    primary: '#4F46E5', // Indigo 600
    secondary: '#10B981', // Emerald 500
    bg: 'bg-gray-100',
    bgActual: '#F3F4F6',
    text: 'text-gray-900',
    textActual: '#1F2937',
    border: 'border-gray-300',
    borderActual: '#D1D5DB',
    sidebarBg: 'bg-gray-800',
    sidebarBgActual: '#1F2937',
    sidebarText: 'text-white',
    sidebarTextActual: '#FFFFFF',
    headerBg: 'bg-white',
    headerBgActual: '#FFFFFF',
    headerText: 'text-gray-800', // Ensure header text is readable on its specific background
    headerTextActual: '#1F2937',
    shadow: 'shadow-md',
    hoverBg: 'hover:bg-gray-700', // For sidebar items on dark sidebar
    hoverText: 'hover:text-white',
    buttonBg: 'bg-gray-700',
    buttonHover: 'hover:bg-gray-600',
    ringColor: '#4F46E5', // primary
  },
  {
    name: 'Sky & Rose',
    primary: '#0EA5E9', // Sky 500
    secondary: '#F43F5E', // Rose 500
    bg: 'bg-gray-100',
    bgActual: '#F3F4F6',
    text: 'text-gray-900',
    textActual: '#1F2937',
    border: 'border-gray-300',
    borderActual: '#D1D5DB',
    sidebarBg: 'bg-gray-800',
    sidebarBgActual: '#1F2937',
    sidebarText: 'text-white',
    sidebarTextActual: '#FFFFFF',
    headerBg: 'bg-white',
    headerBgActual: '#FFFFFF',
    headerText: 'text-gray-800',
    headerTextActual: '#1F2937',
    shadow: 'shadow-md',
    hoverBg: 'hover:bg-gray-700',
    hoverText: 'hover:text-white',
    buttonBg: 'bg-gray-700',
    buttonHover: 'hover:bg-gray-600',
    ringColor: '#0EA5E9', // primary
  },
  {
    name: 'Amber & Teal',
    primary: '#F59E0B', // Amber 500
    secondary: '#14B8A6', // Teal 500
    bg: 'bg-gray-100',
    bgActual: '#F3F4F6',
    text: 'text-gray-900',
    textActual: '#1F2937',
    border: 'border-gray-300',
    borderActual: '#D1D5DB',
    sidebarBg: 'bg-gray-800',
    sidebarBgActual: '#1F2937',
    sidebarText: 'text-white',
    sidebarTextActual: '#FFFFFF',
    headerBg: 'bg-white',
    headerBgActual: '#FFFFFF',
    headerText: 'text-gray-800',
    headerTextActual: '#1F2937',
    shadow: 'shadow-md',
    hoverBg: 'hover:bg-gray-700',
    hoverText: 'hover:text-white',
    buttonBg: 'bg-gray-700',
    buttonHover: 'hover:bg-gray-600',
    ringColor: '#F59E0B', // primary
  },
];

// Helper to determine if a color is dark
const isColorDark = (hexColor) => {
  if (!hexColor) return false;
  const color = hexColor.startsWith('#') ? hexColor.substring(1) : hexColor;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  // Standard luminance calculation
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
};

const DashboardLayout = ({ children, onNavigate, currentPage }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // For animation control
  const [modalAnimatingOut, setModalAnimatingOut] = useState(false); // For exit animation

  const [themeOption, setThemeOption] = useState(() => localStorage.getItem('appThemeOption') || 'default'); // 'default', 'light', 'dark'
  const [selectedPaletteName, setSelectedPaletteName] = useState(() => localStorage.getItem('appSelectedPaletteName') || colorPalettes[0].name);

  useEffect(() => {
    localStorage.setItem('appThemeOption', themeOption);
    localStorage.setItem('appSelectedPaletteName', selectedPaletteName);
  }, [themeOption, selectedPaletteName]);

  const currentTheme = useMemo(() => {
    if (themeOption === 'dark') {
      return {
        name: 'Dark Mode',
        primary: '#60A5FA', // Blue 400 (example for dark)
        secondary: '#34D399', // Emerald 400 (example for dark)
        bg: 'bg-gray-900',
        bgActual: '#111827',
        text: 'text-gray-100',
        textActual: '#F3F4F6',
        border: 'border-gray-700',
        borderActual: '#374151',
        sidebarBg: 'bg-gray-800',
        sidebarBgActual: '#1F2937',
        sidebarText: 'text-gray-100',
        sidebarTextActual: '#F3F4F6',
        headerBg: 'bg-gray-800', // Dark header for dark mode
        headerBgActual: '#1F2937',
        headerText: 'text-gray-100',
        headerTextActual: '#F3F4F6',
        shadow: 'shadow-lg',
        hoverBg: 'hover:bg-gray-700',
        hoverText: 'hover:text-white',
        buttonBg: 'bg-gray-700',
        buttonHover: 'hover:bg-gray-600',
        ringColor: '#60A5FA',
        // Specific button colors for dark theme
        redButtonBg: 'bg-red-700',
        redButtonHover: 'hover:bg-red-800',
        settingsTextClass: 'text-gray-300', // Specific for settings modal text in dark theme
      };
    }
    if (themeOption === 'light') {
      return {
        name: 'Light Mode',
        primary: '#4F46E5', // Default primary
        secondary: '#10B981', // Default secondary
        bg: 'bg-gray-50',
        bgActual: '#F9FAFB',
        text: 'text-gray-800',
        textActual: '#1F2937',
        border: 'border-gray-200',
        borderActual: '#E5E7EB',
        sidebarBg: 'bg-white',
        sidebarBgActual: '#FFFFFF',
        sidebarText: 'text-gray-800',
        sidebarTextActual: '#1F2937',
        headerBg: 'bg-white',
        headerBgActual: '#FFFFFF',
        headerText: 'text-gray-800',
        headerTextActual: '#1F2937',
        shadow: 'shadow-md',
        hoverBg: 'hover:bg-gray-100',
        hoverText: 'hover:text-gray-900',
        buttonBg: 'bg-gray-200',
        buttonHover: 'hover:bg-gray-300',
        ringColor: '#4F46E5',
        redButtonBg: 'bg-red-500',
        redButtonHover: 'hover:bg-red-600',
        settingsTextClass: 'text-gray-700',
      };
    }
    // Default theme (uses palettes)
    const palette = colorPalettes.find(p => p.name === selectedPaletteName) || colorPalettes[0];
    return { ...palette, settingsTextClass: 'text-gray-700' }; // Default settings text for palettes
  }, [themeOption, selectedPaletteName]);

  const cssVariables = {
    '--color-primary': currentTheme.primary,
    '--color-secondary': currentTheme.secondary,
    '--color-background': currentTheme.bgActual,
    '--color-text': currentTheme.textActual,
    '--color-border': currentTheme.borderActual,
    '--color-sidebar-bg': currentTheme.sidebarBgActual,
    '--color-sidebar-text': currentTheme.sidebarTextActual,
    '--color-header-bg': currentTheme.headerBgActual,
    '--color-header-text': currentTheme.headerTextActual,
    '--color-ring': currentTheme.ringColor,
  };

  const sidebarRingStyle = { '--tw-ring-color': currentTheme.ringColor };

  const sidebarNavItems = [
    { label: 'Dashboard', page: 'dashboard', icon: HomeIcon },
    { label: 'Registro Animal', page: 'animalRegistration', icon: DocumentPlusIcon },
    { label: 'Control Sanitario', page: 'sanitaryControl', icon: ShieldCheckIcon },
    { label: 'Control Reproductivo', page: 'reproductiveControl', icon: UsersIcon }, // Placeholder, consider FaHeartbeat or similar
    { label: 'Control de Producción', page: 'productionControl', icon: ChartBarIcon },
    { label: 'Inventario', page: 'inventory', icon: ArchiveBoxIcon },
    { label: 'Gestión Económica', page: 'economicManagement', icon: BanknotesIcon },
    { label: 'Gestión de Personal', page: 'personnelManagement', icon: UserGroupIcon },
    { label: 'Clientes y Proveedores', page: 'supplierClientManagement', icon: BuildingStorefrontIcon },
    { label: 'Planes de Suscripción', page: 'subscriptionPlans', icon: CreditCardIcon },
  ];

  const isSidebarDark = isColorDark(currentTheme.sidebarBgActual);

  const openSettingsModal = () => {
    setIsSettingsOpen(true);
    setTimeout(() => setModalVisible(true), 10); // Allow time for DOM to update for transition
  };

  const closeSettingsModal = () => {
    setModalAnimatingOut(true);
    setModalVisible(false);
    setTimeout(() => {
      setIsSettingsOpen(false);
      setModalAnimatingOut(false);
    }, 300); // Match animation duration
  };

  return (
    <div className={`min-h-screen flex ${currentTheme.bg} ${currentTheme.text}`} style={cssVariables}>
      {/* Sidebar */}
      <div className={`w-64 ${currentTheme.sidebarBg} ${currentTheme.sidebarText} flex flex-col`}>
        <div className={`p-4 text-xl font-bold border-b ${currentTheme.border} ${currentTheme.sidebarText}`}>
          Campo Inteligente
        </div>
        <nav className="flex-grow">
          <ul className="space-y-1 p-3">
            {sidebarNavItems.map(item => {
              const IconComponent = item.icon;
              const isActive = item.page === currentPage;
              let activeClasses = '';
              if (isActive) {
                activeClasses = isSidebarDark
                  ? `bg-white bg-opacity-10 ${currentTheme.sidebarText}`
                  : `bg-[var(--color-primary)] text-white`;
              }

              return (
                <li key={item.page}>
                  <button
                    onClick={() => onNavigate(item.page)}
                    className={`w-full text-left px-3 py-2.5 text-sm rounded-md flex items-center
                                ${currentTheme.hoverBg} ${currentTheme.hoverText}
                                ${activeClasses || ''}
                                transition-all duration-150 ease-in-out
                                focus:outline-none focus:ring-2 focus:ring-offset-1`}
                    style={sidebarRingStyle}
                  >
                    <IconComponent className="h-5 w-5 mr-2 flex-shrink-0" />
                    {item.label}
                  </button>
                </li>
              );
            })}
            <li>
              <button
                onClick={openSettingsModal}
                className={`w-full text-left px-3 py-2.5 text-sm rounded-md flex items-center
                            ${currentTheme.hoverBg} ${currentTheme.hoverText}
                            transition-all duration-150 ease-in-out
                            focus:outline-none focus:ring-2 focus:ring-offset-1`}
                style={sidebarRingStyle}
              >
                <Cog6ToothIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                Configuración / Soporte
              </button>
            </li>
          </ul>
        </nav>
        <div className={`p-4 border-t ${currentTheme.border}`}>
          <button
            onClick={() => onNavigate('logout')}
            className={`w-full text-left px-4 py-2 rounded-lg ${currentTheme.redButtonBg || 'bg-red-600'} text-white ${currentTheme.redButtonHover || 'hover:bg-red-700'} transition-colors`}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className={`flex justify-between items-center p-4 ${currentTheme.headerBg} ${currentTheme.shadow}`}>
          <h1 className={`text-2xl font-semibold ${currentTheme.headerText}`}>Dashboard</h1>
          {/* Aquí podrías añadir un perfil de usuario o notificaciones */}
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
          {children}
        </main>
      </div>

      {/* Settings Modal/Sidebar */}
      {isSettingsOpen && (
        <div className={`fixed inset-0 bg-black flex justify-end z-50 transition-opacity duration-300 ease-in-out ${modalVisible ? 'bg-opacity-50' : 'bg-opacity-0'} ${modalAnimatingOut ? 'bg-opacity-0' : ''}`}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-modal-title"
            className={`w-80 ${currentTheme.sidebarBg} p-6 ${currentTheme.sidebarText} shadow-lg overflow-y-auto rounded-l-lg transform transition-transform duration-300 ease-in-out ${modalVisible ? 'translate-x-0' : 'translate-x-full'} ${modalAnimatingOut ? 'translate-x-full' : ''}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 id="settings-modal-title" className="text-2xl font-bold">Configuración</h2>
              <button
                onClick={closeSettingsModal}
                className={`${currentTheme.sidebarText === 'text-white' || currentTheme.sidebarText === 'text-gray-100' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}
                aria-label="Cerrar configuración"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <h3 className={`text-xl font-semibold mb-3 ${currentTheme.settingsTextClass}`}>Tema de Interfaz</h3>
              <div className="space-y-3">
                {[
                  { value: 'default', label: 'Paletas de colores' },
                  { value: 'light', label: 'Claro' },
                  { value: 'dark', label: 'Oscuro' },
                ].map(opt => (
                  <label key={opt.value} className={`flex items-center ${currentTheme.settingsTextClass}`}>
                    <input
                      type="radio"
                      name="themeOption"
                      value={opt.value}
                      checked={themeOption === opt.value}
                      onChange={() => setThemeOption(opt.value)}
                      className="form-radio h-4 w-4"
                      style={{color: currentTheme.ringColor}} // Apply ring color to radio
                    />
                    <span className="ml-2">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {themeOption === 'default' && (
              <div className="mb-6">
                <h3 className={`text-xl font-semibold mb-3 ${currentTheme.settingsTextClass}`}>Seleccionar Paleta</h3>
                <div className="space-y-2">
                  {colorPalettes.map(palette => (
                    <label key={palette.name} className={`flex items-center p-2 rounded-md hover:bg-opacity-20 ${selectedPaletteName === palette.name ? `bg-opacity-30 ${currentTheme.hoverBg}` : ''}`}
                           style={{backgroundColor: selectedPaletteName === palette.name ? currentTheme.primary + '40' : 'transparent'}} // Highlight with transparency
                    >
                      <input
                        type="radio"
                        name="selectedPaletteName"
                        value={palette.name}
                        checked={selectedPaletteName === palette.name}
                        onChange={() => setSelectedPaletteName(palette.name)}
                        className="form-radio h-4 w-4"
                        style={{color: palette.primary }}
                      />
                      <span className={`ml-3 ${currentTheme.settingsTextClass}`}>{palette.name}</span>
                      <div className="ml-auto flex space-x-1">
                        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: palette.primary }}></span>
                        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: palette.secondary }}></span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className={`text-xl font-semibold mb-3 ${currentTheme.settingsTextClass}`}>Idioma</h3>
              <select className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.border} ${currentTheme.bg === 'bg-gray-900' || currentTheme.sidebarBg === 'bg-gray-800' ? 'bg-gray-700 text-white' : 'bg-white text-black' }`}
                      style={{borderColor: currentTheme.borderActual, '--tw-ring-color': currentTheme.ringColor}}>
                <option>Español</option>
                <option>English</option>
              </select>
            </div>

            <div className="mb-6">
              <h3 className={`text-xl font-semibold mb-3 ${currentTheme.settingsTextClass}`}>Soporte</h3>
              <p className={`${currentTheme.settingsTextClass} text-sm mb-2`}>¿Necesitas ayuda? Contáctanos:</p>
              <p className={`${currentTheme.settingsTextClass} text-sm`}>Email: soporte@campointeligente.com</p>
              <p className={`${currentTheme.settingsTextClass} text-sm`}>Teléfono: +52 55 1234 5678</p>
              <button className={`mt-4 w-full text-white py-2 rounded-lg transition-colors btn btn-primary`}
                      style={{backgroundColor: currentTheme.primary, '--tw-ring-color': currentTheme.primary}}>
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