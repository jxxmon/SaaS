import React, { useState } from 'react';
import LanguageSwitcher from './language/LanguageSwitcher';

interface HeaderProps {
  language: string;
  onLanguageChange: (languageCode: string) => void;
  onToggleSidebar?: () => void;
  sidebarCollapsed?: boolean;
}

export default function Header({ 
  language, 
  onLanguageChange,
  onToggleSidebar,
  sidebarCollapsed = false
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'New tool added', message: 'AI Analysis Worker v2.1 is now available', time: '10m ago', unread: true },
    { id: 2, title: 'System update', message: 'Scheduled maintenance completed successfully', time: '2h ago', unread: true },
    { id: 3, title: 'Team invitation', message: 'Sarah invited you to join Data Analytics project', time: '1d ago', unread: false },
    { id: 4, title: 'API rate limit', message: 'You are approaching your API rate limit', time: '2d ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* 왼쪽: 사이드바 토글 및 브랜드 */}
          <div className="flex items-center space-x-4">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                )}
              </button>
            )}

            <div className="hidden md:flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3">
                G
              </div>
              <div>
                <div className="font-bold text-gray-800">Global Tools</div>
                <div className="text-xs text-gray-500">Platform v2.1</div>
              </div>
            </div>
          </div>

          {/* 중앙: 검색 */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools, documentation, or team members..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* 오른쪽: 액션 아이콘들 */}
          <div className="flex items-center space-x-3">
            {/* 언어 전환 */}
            <LanguageSwitcher
              currentLanguage={language}
              onLanguageChange={onLanguageChange}
              compact
            />

            {/* 알림 */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors relative"
                aria-label="Notifications"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-800">Notifications</h3>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Mark all as read
                      </button>
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id}
                        className={}
                      >
                        <div className="flex items-start">
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          )}
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{notification.title}</div>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <div className="text-xs text-gray-500 mt-2">{notification.time}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-4 py-3 border-t border-gray-200">
                    <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 사용자 프로필 */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex flex-col items-end">
                <div className="font-medium text-gray-800">Alex Johnson</div>
                <div className="text-xs text-gray-500">Admin</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-90 transition-opacity">
                AJ
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
EOF && echo '헤더 컴포넌트 생성 완료'
