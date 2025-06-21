/** @type {import('tailwindcss').Config} */
      module.exports = {
        content: [
          "./src/**/*.{js,jsx,ts,tsx}",
        ],
        theme: {
          extend: {
            colors: {
              'brand-primary': '#4F46E5',    // Indigo 600
              'brand-secondary': '#10B981',  // Emerald 500
              'brand-background': '#F3F4F6', // Gray 100 (light mode default)
              'brand-text': '#1F2937',       // Gray 800 (light mode default)
              'brand-primary-dark': '#818CF8', // Indigo 400 (for primary text on dark mode)
              'brand-secondary-dark': '#34D399', // Emerald 400 (for secondary elements in dark mode)
              'dark-background': '#111827',  // Gray 900 (dark mode default)
              'dark-text': '#F3F4F6',         // Gray 100 (dark mode default)
            },
            borderRadius: {
              'card': '0.75rem', // 12px
              'input': '0.5rem',  // 8px
              'button': '0.5rem', // 8px
            }
          },
        },
        plugins: [],
      }