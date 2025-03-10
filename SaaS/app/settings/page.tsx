import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import DashboardWidget from '../../components/dashboard/DashboardWidget';

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const settingSections: SettingSection[] = [
  {
    id: 'general',
    title: 'General Settings',
    description: 'Platform preferences, language, and display options',
    icon: '🌐'
  },
  {
    id: 'account',
    title: 'Account Settings',
    description: 'Profile information, email, and password',
    icon: '👤'
  },
  {
    id: 'security',
    title: 'Security',
    description: 'Two-factor authentication, session management',
    icon: '🔒'
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Email, push, and in-app notification preferences',
    icon: '🔔'
  },
  {
    id: 'billing',
    title: 'Billing & Subscription',
    description: 'Payment methods, invoices, and plan details',
    icon: '💰'
  },
  {
    id: 'api',
    title: 'API & Integrations',
    description: 'API keys, webhooks, and third-party integrations',
    icon: '🔌'
  },
  {
    id: 'team',
    title: 'Team Management',
    description: 'Team members, roles, and permissions',
    icon: '👥'
  },
  {
    id: 'advanced',
    title: 'Advanced',
    description: 'Developer options and experimental features',
    icon: '⚙️'
  }
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [language, setLanguage] = useState('en');
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const activeSectionData = settingSections.find(s => s.id === activeSection);

  return (
    <MainLayout language={language}>
      <div className="max-w-6xl mx-auto">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure your platform preferences and account settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 왼쪽: 설정 네비게이션 */}
          <div className="lg:col-span-1">
            <DashboardWidget title="Settings" variant="minimal">
              <div className="space-y-1">
                {settingSections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={}
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-3">{section.icon}</span>
                      <div>
                        <div className="font-medium">{section.title}</div>
                        <div className="text-sm text-gray-500 mt-0.5">
                          {section.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </DashboardWidget>
          </div>

          {/* 오른쪽: 설정 콘텐츠 */}
          <div className="lg:col-span-3">
            {activeSection === 'general' && (
              <DashboardWidget
                title="General Settings"
                icon="🌐"
                actionButton={{
                  label: 'Save Changes',
                  onClick: () => console.log('Save general settings'),
                  icon: '💾'
                }}
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Display Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-800">Dark Mode</div>
                          <div className="text-sm text-gray-500 mt-1">
                            Switch between light and dark theme
                          </div>
                        </div>
                        <button
                          onClick={() => setDarkMode(!darkMode)}
                          className={}
                        >
                          <span
                            className={}
                          />
                        </button>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="font-medium text-gray-800 mb-2">Language</div>
                        <div className="text-sm text-gray-500 mb-4">
                          Choose your preferred language for the interface
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {['en', 'ko', 'ja', 'zh', 'es', 'fr', 'de', 'ru'].map(lang => (
                            <button
                              key={lang}
                              onClick={() => setLanguage(lang)}
                              className={}
                            >
                              <div className="text-center font-medium">
                                {lang.toUpperCase()}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Notification Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-800">Email Notifications</div>
                          <div className="text-sm text-gray-500 mt-1">
                            Receive updates and announcements via email
                          </div>
                        </div>
                        <button
                          onClick={() => setEmailNotifications(!emailNotifications)}
                          className={}
                        >
                          <span
                            className={}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-800">Push Notifications</div>
                          <div className="text-sm text-gray-500 mt-1">
                            Receive real-time notifications in the browser
                          </div>
                        </div>
                        <button
                          onClick={() => setPushNotifications(!pushNotifications)}
                          className={}
                        >
                          <span
                            className={}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </DashboardWidget>
            )}

            {activeSection === 'account' && (
              <DashboardWidget
                title="Account Settings"
                icon="👤"
                actionButton={{
                  label: 'Update Profile',
                  onClick: () => console.log('Update profile'),
                  icon: '💾'
                }}
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          defaultValue="Alex"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          defaultValue="Johnson"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          defaultValue="alex.johnson@example.com"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          defaultValue="+1 (555) 123-4567"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </DashboardWidget>
            )}

            {activeSection !== 'general' && activeSection !== 'account' && (
              <DashboardWidget
                title={activeSectionData?.title || 'Settings'}
                icon={activeSectionData?.icon || '⚙️'}
              >
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">{activeSectionData?.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {activeSectionData?.title}
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {activeSectionData?.description}
                  </p>
                  <p className="text-gray-400 mt-4 text-sm">
                    This section is under development and will be available soon.
                  </p>
                </div>
              </DashboardWidget>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
EOF && echo '설정 페이지 생성 완료'
