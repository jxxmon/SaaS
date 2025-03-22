'use client';

import React from 'react';

export type SettingsSection =
  | 'profile'
  | 'preferences'
  | 'theme'
  | 'notifications'
  | 'security'
  | 'billing';

interface SettingsLayoutProps {
  children: React.ReactNode;
  currentSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
  saveStatus?: 'saved' | 'saving' | 'unsaved' | null;
}

export default function SettingsLayout({
  children,
  currentSection,
  onSectionChange,
  saveStatus = null,
}: SettingsLayoutProps) {
  const getSaveStatusDisplay = () => {
    switch (saveStatus) {
      case 'saved':
        return (
          <span className="flex items-center text-green-600 text-sm">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Saved
          </span>
        );
      case 'saving':
        return (
          <span className="flex items-center text-blue-600 text-sm">
            <svg className="w-4 h-4 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
        );
      case 'unsaved':
        return (
          <span className="flex items-center text-amber-600 text-sm">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Unsaved changes
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">
              Manage your account preferences and platform settings
            </p>
          </div>
          {saveStatus && (
            <div className="hidden sm:block">
              {getSaveStatusDisplay()}
            </div>
          )}
        </div>
        {saveStatus && (
          <div className="sm:hidden mt-2">
            {getSaveStatusDisplay()}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-[280px] flex-shrink-0">
          <SettingsNav
            currentSection={currentSection}
            onSectionChange={onSectionChange}
          />
        </aside>

        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

import SettingsNav from './SettingsNav';
