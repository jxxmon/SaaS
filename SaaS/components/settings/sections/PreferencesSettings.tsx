'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { LanguageCode, PreferencesFormData } from '@/types/settings';
import { timezones } from '@/lib/timezones';
import SelectDropdown from '../forms/SelectDropdown';

const languages: { code: LanguageCode; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

const dateFormats = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (EU)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' },
];

const currencies = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'KRW', label: 'KRW - Korean Won' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'CNY', label: 'CNY - Chinese Yuan' },
  { value: 'GBP', label: 'GBP - British Pound' },
];

interface SectionHeaderProps {
  title: string;
  description?: string;
}

function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
  );
}

interface ToggleSwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleSwitch({ label, description, checked, onChange }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

interface PreferencesSettingsProps {
  initialData?: Partial<PreferencesFormData>;
  onChange?: (data: PreferencesFormData) => void;
}

const defaultPreferences: PreferencesFormData = {
  language: 'en',
  timezone: 'UTC',
  dateFormat: 'YYYY-MM-DD',
  timeFormat: 'HH:mm',
  currency: 'USD',
};

export default function PreferencesSettings({
  initialData,
  onChange,
}: PreferencesSettingsProps) {
  const [preferences, setPreferences] = useState<PreferencesFormData>({
    ...defaultPreferences,
    ...initialData,
  });
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [previewDate, setPreviewDate] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setPreviewDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const updatePreference = useCallback(
    <K extends keyof PreferencesFormData>(key: K, value: PreferencesFormData[K]) => {
      setSaveStatus('saving');
      const updated = { ...preferences, [key]: value };
      setPreferences(updated);

      setTimeout(() => {
        setSaveStatus('saved');
        onChange?.(updated);
      }, 500);
    },
    [preferences, onChange]
  );

  const is24Hour = preferences.timeFormat === 'HH:mm';

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    switch (preferences.dateFormat) {
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'YYYY-MM-DD':
      default:
        return `${year}-${month}-${day}`;
    }
  };

  const formatTime = (date: Date): string => {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    if (is24Hour) {
      return `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`;
    } else {
      const period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${hours}:${minutes}:${seconds} ${period}`;
    }
  };

  const getLanguageLabel = (code: LanguageCode): string => {
    const lang = languages.find(l => l.code === code);
    return lang ? `${lang.flag} ${lang.name}` : code;
  };

  const currentLanguage = languages.find(l => l.code === preferences.language);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader
          title="Preferences"
          description="Customize your language, timezone, and display preferences"
        />
        <div className="flex items-center space-x-2 text-sm">
          {saveStatus === 'saving' && (
            <>
              <svg className="h-4 w-4 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-blue-600">Saving...</span>
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-600">Saved</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Language</h3>
          <div className="grid grid-cols-2 gap-3">
            {languages.map(language => (
              <button
                key={language.code}
                onClick={() => updatePreference('language', language.code)}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                  preferences.language === language.code
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl">{language.flag}</span>
                <div className="text-left">
                  <div className="font-medium text-gray-900 text-sm">{language.name}</div>
                  <div className="text-xs text-gray-500">{language.code.toUpperCase()}</div>
                </div>
                {preferences.language === language.code && (
                  <svg className="ml-auto h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <SelectDropdown
            label="Timezone"
            value={preferences.timezone}
            options={timezones.map(tz => ({ value: tz.value, label: tz.label }))}
            onChange={value => updatePreference('timezone', value)}
            searchable
          />

          <SelectDropdown
            label="Date Format"
            value={preferences.dateFormat}
            options={dateFormats}
            onChange={value => updatePreference('dateFormat', value)}
          />

          <SelectDropdown
            label="Currency"
            value={preferences.currency}
            options={currencies}
            onChange={value => updatePreference('currency', value)}
          />

          <ToggleSwitch
            label="24-Hour Format"
            description="Use 24-hour time format instead of 12-hour"
            checked={is24Hour}
            onChange={checked => updatePreference('timeFormat', checked ? 'HH:mm' : 'hh:mm A')}
          />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 lg:col-span-2">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Preview</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Current Date & Time</span>
              <span className="text-sm font-medium text-gray-900">
                {previewDate ? formatDate(previewDate) : '--'} {' '}
                {previewDate ? formatTime(previewDate) : '--'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Language</span>
              <span className="text-sm font-medium text-gray-900">
                {getLanguageLabel(preferences.language)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Currency</span>
              <span className="text-sm font-medium text-gray-900">
                {currencies.find(c => c.value === preferences.currency)?.label}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Timezone</span>
              <span className="text-sm font-medium text-gray-900">
                {timezones.find(tz => tz.value === preferences.timezone)?.label || preferences.timezone}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
