/**
 * SettingsPage Component
 * Main settings page that integrates all settings components
 */

import React, { useState } from 'react';
import { Settings, User, Globe, Palette, Bell, SaveAll } from 'lucide-react';
import UserProfile, { UserProfileData } from './profile/UserProfile';
import Preferences, { PreferenceSettings } from './preferences/Preferences';
// Import other components once they're created
// import ThemeSettings from './theme/ThemeSettings';
// import NotificationSettings from './notifications/NotificationSettings';

export interface SettingsPageProps {
  user: UserProfileData;
  onUserSave?: (user: UserProfileData) => void;
  onPreferencesSave?: (prefs: PreferenceSettings) => void;
  onThemeSave?: (theme: any) => void;
  onNotificationsSave?: (notifications: any) => void;
  onAllSave?: () => void;
}

const tabItems = [
  { id: 'profile', label: 'Profile', icon: User, color: 'text-blue-500' },
  { id: 'preferences', label: 'Preferences', icon: Globe, color: 'text-green-500' },
  { id: 'theme', label: 'Theme', icon: Palette, color: 'text-purple-500' },
  { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-yellow-500' },
];

export default function SettingsPage({
  user,
  onUserSave,
  onPreferencesSave,
  onThemeSave,
  onNotificationsSave,
  onAllSave,
}: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleTabClick = (tabId: string) => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm('You have unsaved changes. Are you sure you want to switch tabs?');
      if (!confirm) return;
    }
    setActiveTab(tabId);
    setHasUnsavedChanges(false);
  };

  const handleUserSave = (updatedUser: UserProfileData) => {
    onUserSave?.(updatedUser);
    setHasUnsavedChanges(false);
  };

  const handlePreferencesSave = (prefs: PreferenceSettings) => {
    onPreferencesSave?.(prefs);
    setHasUnsavedChanges(false);
  };

  const handleAllSave = () => {
    onAllSave?.();
    setHasUnsavedChanges(false);
  };

  return (
    <div className=min-h-screen
