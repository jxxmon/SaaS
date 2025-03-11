import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // 시스템 테마 감지
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

  // 테마 결정
  useEffect(() => {
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setResolvedTheme(isDark ? 'dark' : 'light');
    } else {
      setResolvedTheme(theme);
    }
  }, [theme]);

  // HTML 클래스 적용
  useEffect(() => {
    const root = document.documentElement;
    
    // 기존 테마 클래스 제거
    root.classList.remove('light-theme', 'dark-theme');
    
    // 새 테마 클래스 추가
    root.classList.add();
    
    // 데이터 속성 설정 (CSS 변수 접근용)
    root.setAttribute('data-theme', resolvedTheme);
    
    // 로컬 스토리지에 저장
    localStorage.setItem('theme', theme);
  }, [resolvedTheme, theme]);

  // 초기 로드 시 로컬 스토리지에서 테마 불러오기
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    setTheme(current => {
      if (current === 'light') return 'dark';
      if (current === 'dark') return 'system';
      return 'light';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
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
EOF && echo '테마 컨텍스트 생성 완료' && echo '' && echo '2. 테마 전환 컴포넌트 생성...' && cat > components/theme/ThemeToggle.tsx << 'EOF'
import React from 'react';
import { useTheme } from './ThemeContext';

interface ThemeToggleProps {
  showLabel?: boolean;
  compact?: boolean;
  className?: string;
}

export default function ThemeToggle({ 
  showLabel = true, 
  compact = false,
  className = '' 
}: ThemeToggleProps) {
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  const getThemeIcon = () => {
    if (theme === 'system') return '🖥️';
    return resolvedTheme === 'dark' ? '🌙' : '☀️';
  };

  const getThemeLabel = () => {
    if (theme === 'system') return 'System';
    return resolvedTheme === 'dark' ? 'Dark' : 'Light';
  };

  const getThemeDescription = () => {
    if (theme === 'system') {
      return 'Follows your device theme';
    }
    return resolvedTheme === 'dark' ? 'Dark theme enabled' : 'Light theme enabled';
  };

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        className={}
        aria-label={}
      >
        <span className="text-lg">{getThemeIcon()}</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={}
      aria-label={}
    >
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center mr-4">
          <span className="text-xl">{getThemeIcon()}</span>
        </div>
        
        <div className="text-left">
          <div className="font-medium text-gray-800 dark:text-gray-200">
            {showLabel ?  : 'Theme'}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {getThemeDescription()}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Click to cycle
        </div>
        <div className="text-gray-400 dark:text-gray-500">→</div>
      </div>
    </button>
  );
}
EOF && echo '테마 전환 컴포넌트 생성 완료' && echo '' && echo '3. 테마 설정 컴포넌트 생성...' && cat > components/theme/ThemeSettings.tsx << 'EOF'
import React from 'react';
import { useTheme } from './ThemeContext';

interface ThemeSettingsProps {
  showTitle?: boolean;
}

export default function ThemeSettings({ showTitle = true }: ThemeSettingsProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const themes = [
    { id: 'light' as const, name: 'Light', description: 'Bright theme for daytime use', icon: '☀️' },
    { id: 'dark' as const, name: 'Dark', description: 'Dark theme for nighttime use', icon: '🌙' },
    { id: 'system' as const, name: 'System', description: 'Follows your device settings', icon: '🖥️' },
  ];

  return (
    <div className="space-y-6">
      {showTitle && (
        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Theme Settings</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Choose how the platform looks. Your preference will be saved.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((themeOption) => (
          <button
            key={themeOption.id}
            onClick={() => setTheme(themeOption.id)}
            className={}
          >
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center mr-3">
                <span className="text-2xl">{themeOption.icon}</span>
              </div>
              <div>
                <div className="font-medium text-gray-800 dark:text-gray-200">
                  {themeOption.name}
                </div>
                {theme === themeOption.id && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
                    Currently active
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {themeOption.description}
            </p>
            
            {themeOption.id === 'system' && (
              <div className="mt-3 text-xs text-gray-500 dark:text-gray-500">
                Current system: {resolvedTheme === 'dark' ? 'Dark' : 'Light'}
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-800 dark:text-gray-200">Preview</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              See how your theme looks
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-gray-800 dark:bg-gray-200 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Text</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Primary</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Background</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF && echo '테마 설정 컴포넌트 생성 완료'
