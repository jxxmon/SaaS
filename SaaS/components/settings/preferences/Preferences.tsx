/**
 * Preferences Component
 * User preferences for language, timezone, units, and region
 */

import React, { useState } from 'react';
import { Globe, Clock, Ruler, Map, Save, RefreshCw } from 'lucide-react';

export interface PreferenceSettings {
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  temperatureUnit: 'celsius' | 'fahrenheit';
  distanceUnit: 'metric' | 'imperial';
  currency: string;
  region: string;
}

export interface PreferencesProps {
  initialSettings?: Partial<PreferenceSettings>;
  onSave?: (settings: PreferenceSettings) => void;
  className?: string;
}

const defaultSettings: PreferenceSettings = {
  language: 'en',
  timezone: 'UTC',
  dateFormat: 'YYYY-MM-DD',
  timeFormat: '24h',
  temperatureUnit: 'celsius',
  distanceUnit: 'metric',
  currency: 'USD',
  region: 'US',
};

const languages = [
  { value: 'en', label: 'English' },
  { value: 'ko', label: 'Korean' },
  { value: 'ja', label: 'Japanese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
];

const timezones = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Seoul', label: 'Seoul (KST)' },
];

const dateFormats = [
  { value: 'YYYY-MM-DD', label: '2025-03-25' },
  { value: 'MM/DD/YYYY', label: '03/25/2025' },
  { value: 'DD/MM/YYYY', label: '25/03/2025' },
  { value: 'MMMM D, YYYY', label: 'March 25, 2025' },
];

const currencies = [
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'JPY', label: 'Japanese Yen (¥)' },
  { value: 'KRW', label: 'Korean Won (₩)' },
  { value: 'CNY', label: 'Chinese Yuan (¥)' },
];

export default function Preferences({
  initialSettings = {},
  onSave,
  className = '',
}: PreferencesProps) {
  const [settings, setSettings] = useState<PreferenceSettings>({
    ...defaultSettings,
    ...initialSettings,
  });
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = <K extends keyof PreferenceSettings>(
    key: K,
    value: PreferenceSettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
    setIsDirty(true);
  };

  const handleSave = () => {
    onSave?.(settings);
    setIsDirty(false);
  };

  const handleReset = () => {
    setSettings({
      ...defaultSettings,
      ...initialSettings,
    });
    setIsDirty(false);
  };

  return (
    <div className={}>
      <div className=flex
