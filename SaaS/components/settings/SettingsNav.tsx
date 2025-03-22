'use client';

import React, { useState } from 'react';

export type SettingsSection =
  | 'profile'
  | 'preferences'
  | 'theme'
  | 'notifications'
  | 'security'
  | 'billing';

interface NavItem {
  id: SettingsSection;
  icon: string;
  title: string;
  titleKo: string;
  description: string;
}

const navItems: NavItem[] = [
  {
    id: 'profile',
    icon: '👤',
    title: 'Profile',
    titleKo: '프로필',
    description: 'Personal information and avatar',
  },
  {
    id: 'preferences',
    icon: '🌐',
    title: 'Preferences',
    titleKo: '환경설정',
    description: 'Language, timezone, and defaults',
  },
  {
    id: 'theme',
    icon: '🎨',
    title: 'Theme',
    titleKo: '테마',
    description: 'Appearance and color scheme',
  },
  {
    id: 'notifications',
    icon: '🔔',
    title: 'Notifications',
    titleKo: '알림',
    description: 'Email, push, and alerts',
  },
  {
    id: 'security',
    icon: '🔒',
    title: 'Security',
    titleKo: '보안',
    description: 'Password and authentication',
  },
  {
    id: 'billing',
    icon: '💰',
    title: 'Billing',
    titleKo: '결제',
    description: 'Payment and subscription',
  },
];

interface SettingsNavProps {
  currentSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

export default function SettingsNav({
  currentSection,
  onSectionChange,
}: SettingsNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentItem = navItems.find((item) => item.id === currentSection);

  return (
    <div className="w-full">
      <div className="lg:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            <span className="text-xl mr-3">{currentItem?.icon}</span>
            <div className="text-left">
              <div className="font-medium text-gray-900">{currentItem?.title}</div>
              <div className="text-xs text-gray-500">{currentItem?.description}</div>
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${
              isMobileMenuOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isMobileMenuOpen && (
          <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                  currentSection === item.id
                    ? 'bg-blue-50 border-l-4 border-blue-500'
                    : 'hover:bg-gray-50 border-l-4 border-transparent'
                }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <div>
                  <div
                    className={`font-medium ${
                      currentSection === item.id ? 'text-blue-700' : 'text-gray-900'
                    }`}
                  >
                    {item.title}
                  </div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <nav className="hidden lg:block bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-start p-3 rounded-lg text-left transition-all duration-200 ${
                currentSection === item.id
                  ? 'bg-blue-50 border border-blue-200 shadow-sm'
                  : 'hover:bg-gray-100 border border-transparent'
              }`}
            >
              <span className="text-2xl mr-3 flex-shrink-0">{item.icon}</span>
              <div className="min-w-0 flex-1">
                <div
                  className={`font-semibold text-sm ${
                    currentSection === item.id ? 'text-blue-700' : 'text-gray-900'
                  }`}
                >
                  {item.title}
                </div>
                <div
                  className={`text-xs mt-0.5 truncate ${
                    currentSection === item.id ? 'text-blue-600' : 'text-gray-500'
                  }`}
                >
                  {item.description}
                </div>
              </div>
              {currentSection === item.id && (
                <svg
                  className="w-5 h-5 text-blue-500 flex-shrink-0 ml-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      </nav>

      <div className="hidden md:flex lg:hidden overflow-x-auto pb-2 -mx-2 px-2 space-x-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`flex-shrink-0 flex flex-col items-center p-3 rounded-lg min-w-[80px] transition-all ${
              currentSection === item.id
                ? 'bg-blue-50 border-2 border-blue-500'
                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
            }`}
          >
            <span className="text-2xl mb-1">{item.icon}</span>
            <span
              className={`text-xs font-medium ${
                currentSection === item.id ? 'text-blue-700' : 'text-gray-700'
              }`}
            >
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
