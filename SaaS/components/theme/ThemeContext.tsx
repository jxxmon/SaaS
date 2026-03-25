import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ColorTheme = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink' | 'teal';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  accentColor: ColorTheme;
  customCSS: string;
  enableCustomCSS: boolean;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: ColorTheme) => void;
  setCustomCSS: (css: string) => void;
  setEnableCustomCSS: (enabled: boolean) => void;
  toggleTheme: () => void;
}

const COLOR_THEMES: Record<ColorTheme, { [key: string]: string }> = {
  blue: {
    '--color-primary': '#3b82f6',
    '--color-primary-hover': '#2563eb',
    '--color-primary-light': '#dbeafe',
    '--color-primary-dark': '#1e40af',
  },
  purple: {
    '--color-primary': '#8b5cf6',
    '--color-primary-hover': '#7c3aed',
    '--color-primary-light': '#ede9fe',
    '--color-primary-dark': '#5b21b6',
  },
  green: {
    '--color-primary': '#22c55e',
    '--color-primary-hover': '#16a34a',
    '--color-primary-light': '#dcfce7',
    '--color-primary-dark': '#166534',
  },
  orange: {
    '--color-primary': '#f97316',
    '--color-primary-hover': '#ea580c',
    '--color-primary-light': '#ffedd5',
    '--color-primary-dark': '#9a3412',
  },
  red: {
    '--color-primary': '#ef4444',
    '--color-primary-hover': '#dc2626',
    '--color-primary-light': '#fee2e2',
    '--color-primary-dark': '#991b1b',
  },
  pink: {
    '--color-primary': '#ec4899',
    '--color-primary-hover': '#db2777',
    '--color-primary-light': '#fce7f3',
    '--color-primary-dark': '#9d174d',
  },
  teal: {
    '--color-primary': '#14b8a6',
    '--color-primary-hover': '#0d9488',
    '--color-primary-light': '#ccfbf1',
    '--color-primary-dark': '#115e59',
  },
};

function injectCustomCSS(css: string) {
  let styleTag = document.getElementById('theme-custom-css') as HTMLStyleElement | null;
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'theme-custom-css';
    document.head.appendChild(styleTag);
  }
  styleTag.textContent = css;
}

function removeCustomCSS() {
  const styleTag = document.getElementById('theme-custom-css');
  if (styleTag) {
    styleTag.remove();
  }
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [accentColor, setAccentColor] = useState<ColorTheme>('blue');
  const [customCSS, setCustomCSS] = useState<string>('');
  const [enableCustomCSS, setEnableCustomCSS] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  useEffect(() => {
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setResolvedTheme(isDark ? 'dark' : 'light');
    } else {
      setResolvedTheme(theme);
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme === 'dark' ? 'dark' : 'light');
    root.setAttribute('data-theme', resolvedTheme);
    localStorage.setItem('theme', theme);
  }, [resolvedTheme, theme]);

  useEffect(() => {
    const root = document.documentElement;
    const colorTheme = COLOR_THEMES[accentColor as ColorTheme];
    
    (Object.entries(colorTheme) as [string, string][]).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    
    localStorage.setItem('accentColor', accentColor);
  }, [accentColor]);

  useEffect(() => {
    if (enableCustomCSS && customCSS) {
      injectCustomCSS(customCSS);
    } else {
      removeCustomCSS();
    }
    
    localStorage.setItem('enableCustomCSS', String(enableCustomCSS));
    localStorage.setItem('customCSS', customCSS);
  }, [enableCustomCSS, customCSS]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme);
    }

    const savedAccentColor = localStorage.getItem('accentColor') as ColorTheme | null;
    if (savedAccentColor && Object.keys(COLOR_THEMES).includes(savedAccentColor)) {
      setAccentColor(savedAccentColor);
    }

    const savedCustomCSS = localStorage.getItem('customCSS');
    if (savedCustomCSS !== null) {
      setCustomCSS(savedCustomCSS);
    }

    const savedEnableCustomCSS = localStorage.getItem('enableCustomCSS');
    if (savedEnableCustomCSS !== null) {
      setEnableCustomCSS(savedEnableCustomCSS === 'true');
    }
  }, []);

  const toggleTheme = () => {
    setTheme((current: Theme) => {
      if (current === 'light') return 'dark';
      if (current === 'dark') return 'system';
      return 'light';
    });
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      resolvedTheme,
      accentColor,
      customCSS,
      enableCustomCSS,
      setTheme,
      setAccentColor,
      setCustomCSS,
      setEnableCustomCSS,
      toggleTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

