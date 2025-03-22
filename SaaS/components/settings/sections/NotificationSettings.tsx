'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  NotificationSettingsData,
  NotificationFrequency,
  DEFAULT_USER_SETTINGS,
} from '@/types/settings';
import ToggleSwitch from '../forms/ToggleSwitch';
import SelectDropdown from '../forms/SelectDropdown';
import SectionHeader from '../forms/SectionHeader';
import TimeRangePicker from '../forms/TimeRangePicker';

interface NotificationSettingsProps {
  settings?: NotificationSettingsData;
  onChange?: (settings: NotificationSettingsData) => void;
}

type BrowserPermissionStatus = 'default' | 'granted' | 'denied' | 'unsupported';

const FREQUENCY_OPTIONS = [
  { value: 'immediately', label: '즉시' },
  { value: 'hourly', label: '매시간' },
  { value: 'daily', label: '매일' },
  { value: 'weekly', label: '매주' },
];

export default function NotificationSettings({
  settings = DEFAULT_USER_SETTINGS.notifications,
  onChange,
}: NotificationSettingsProps) {
  const [localSettings, setLocalSettings] = useState<NotificationSettingsData>(settings);
  const [browserPermission, setBrowserPermission] = useState<BrowserPermissionStatus>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setBrowserPermission(Notification.permission as BrowserPermissionStatus);
    } else {
      setBrowserPermission('unsupported');
    }
  }, []);

  const updateSettings = useCallback((updates: Partial<NotificationSettingsData>) => {
    const newSettings = { ...localSettings, ...updates };
    setLocalSettings(newSettings);
    onChange?.(newSettings);
  }, [localSettings, onChange]);

  const updateEmailSettings = useCallback((updates: Partial<typeof localSettings.email>) => {
    updateSettings({
      email: { ...localSettings.email, ...updates },
    });
  }, [localSettings.email, updateSettings]);

  const updatePushSettings = useCallback((updates: Partial<typeof localSettings.push>) => {
    updateSettings({
      push: { ...localSettings.push, ...updates },
    });
  }, [localSettings.push, updateSettings]);

  const updateInAppSettings = useCallback((updates: Partial<typeof localSettings.inApp>) => {
    updateSettings({
      inApp: { ...localSettings.inApp, ...updates },
    });
  }, [localSettings.inApp, updateSettings]);

  const updateQuietHours = useCallback((updates: Partial<typeof localSettings.quietHours>) => {
    updateSettings({
      quietHours: { ...localSettings.quietHours, ...updates },
    });
  }, [localSettings.quietHours, updateSettings]);

  const handleFrequencyChange = (value: string) => {
    if (
      value === 'immediately' ||
      value === 'hourly' ||
      value === 'daily' ||
      value === 'weekly'
    ) {
      updateSettings({ frequency: value as NotificationFrequency });
    }
  };

  const requestBrowserPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setBrowserPermission(permission as BrowserPermissionStatus);
      console.log('[NotificationSettings] Browser permission requested:', permission);
    } catch (error) {
      console.error('[NotificationSettings] Failed to request permission:', error);
    }
  };

  const getBrowserPermissionMessage = () => {
    switch (browserPermission) {
      case 'granted':
        return { text: '알림이 허용됨', color: 'text-green-600 dark:text-green-400' };
      case 'denied':
        return { 
          text: '브라우저 설정에서 권한을 허용해주세요', 
          color: 'text-red-600 dark:text-red-400' 
        };
      case 'unsupported':
        return { 
          text: '이 브라우저는 알림을 지원하지 않습니다', 
          color: 'text-gray-500 dark:text-gray-400' 
        };
      default:
        return { 
          text: '알림 권한이 필요합니다', 
          color: 'text-yellow-600 dark:text-yellow-400' 
        };
    }
  };

  const permissionMessage = getBrowserPermissionMessage();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <SectionHeader
          title="이메일 알림"
          description="이메일로 받을 알림을 선택하세요"
          icon="📧"
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">마케팅 이메일</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">프로모션 및 특별 혜택</p>
            </div>
            <ToggleSwitch
              checked={localSettings.email.marketing}
              onChange={(checked) => updateEmailSettings({ marketing: checked })}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">제품 업데이트</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">새로운 기능 및 개선사항</p>
            </div>
            <ToggleSwitch
              checked={localSettings.email.productUpdates}
              onChange={(checked) => updateEmailSettings({ productUpdates: checked })}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">보안 알림</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">로그인 및 보안 관련 알림</p>
            </div>
            <ToggleSwitch
              checked={localSettings.email.securityAlerts}
              onChange={(checked) => updateEmailSettings({ securityAlerts: checked })}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">뉴스레터</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">정기 뉴스 및 업계 소식</p>
            </div>
            <ToggleSwitch
              checked={localSettings.email.newsletter}
              onChange={(checked) => updateEmailSettings({ newsletter: checked })}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <SectionHeader
          title="푸시 알림"
          description="브라우저 및 데스크톱 알림 설정"
          icon="🚀"
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">브라우저 푸시</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">웹 브라우저 푸시 알림</p>
            </div>
            <ToggleSwitch
              checked={localSettings.push.browser}
              onChange={(checked) => updatePushSettings({ browser: checked })}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">데스크톱 알림</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">데스크톱 앱 알림</p>
            </div>
            <ToggleSwitch
              checked={localSettings.push.desktop}
              onChange={(checked) => updatePushSettings({ desktop: checked })}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">멘션 알림</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">댓글 및 멘션 알림</p>
            </div>
            <ToggleSwitch
              checked={localSettings.push.mentions}
              onChange={(checked) => updatePushSettings({ mentions: checked })}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">DM 알림</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">직접 메시지 알림</p>
            </div>
            <ToggleSwitch
              checked={localSettings.push.directMessages}
              onChange={(checked) => updatePushSettings({ directMessages: checked })}
            />
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className={`text-sm font-medium ${permissionMessage.color}`}>
                  {permissionMessage.text}
                </span>
              </div>

              {browserPermission === 'default' && (
                <button
                  type="button"
                  onClick={requestBrowserPermission}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  권한 요청
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <SectionHeader
          title="인앱 알림"
          description="애플리케이션 내 알림 설정"
          icon="🔔"
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">인앱 알림 활성화</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">애플리케이션 내 알림 표시</p>
            </div>
            <ToggleSwitch
              checked={localSettings.inApp.enabled}
              onChange={(checked) => updateInAppSettings({ enabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">소리</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">알림 수신 시 소리 재생</p>
            </div>
            <ToggleSwitch
              checked={localSettings.inApp.sound}
              onChange={(checked) => updateInAppSettings({ sound: checked })}
              disabled={!localSettings.inApp.enabled}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">배지 카운트</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">읽지 않은 알림 수 표시</p>
            </div>
            <ToggleSwitch
              checked={localSettings.inApp.badgeCount}
              onChange={(checked) => updateInAppSettings({ badgeCount: checked })}
              disabled={!localSettings.inApp.enabled}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <SectionHeader
          title="알림 빈도"
          description="알림 수신 빈도를 설정하세요"
          icon="⏰"
        />

        <SelectDropdown
          label="알림 빈도"
          value={localSettings.frequency}
          options={FREQUENCY_OPTIONS}
          onChange={handleFrequencyChange}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <SectionHeader
          title="조용한 시간"
          description="조용한 시간 동안 알림을 받지 않습니다"
          icon="🌙"
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">조용한 시간 활성화</p>
            </div>
            <ToggleSwitch
              checked={localSettings.quietHours.enabled}
              onChange={(checked) => updateQuietHours({ enabled: checked })}
            />
          </div>

          <div className={`mt-4 ${!localSettings.quietHours.enabled ? 'opacity-50' : ''}`}>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              시간 범위
            </p>
            <TimeRangePicker
              start={localSettings.quietHours.start}
              end={localSettings.quietHours.end}
              onChange={(start, end) => updateQuietHours({ start, end })}
              disabled={!localSettings.quietHours.enabled}
            />
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            조용한 시간 동안은 이메일 및 푸시 알림을 받지 않습니다. 보안 알림은 예외입니다.
          </p>
        </div>
      </div>
    </div>
  );
}
