import React, { useState } from 'react';

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  bio: string;
  joinDate: string;
  lastActive: string;
  stats: {
    projects: number;
    toolsUsed: number;
    contributions: number;
    hoursLogged: number;
  };
  skills: string[];
  contact: {
    phone?: string;
    location?: string;
    website?: string;
    github?: string;
    linkedin?: string;
  };
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    twoFactorAuth: boolean;
    theme: 'light' | 'dark' | 'system';
  };
}

interface UserProfileProps {
  user: UserProfileData;
  onEdit?: () => void;
  onMessage?: () => void;
  onFollow?: () => void;
  isCurrentUser?: boolean;
}

export default function UserProfile({
  user,
  onEdit,
  onMessage,
  onFollow,
  isCurrentUser = false
}: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'projects' | 'settings'>('overview');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* 프로필 헤더 */}
      <div className="relative">
        {/* 배경 이미지 */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        
        {/* 프로필 정보 */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end -mt-16">
            {/* 아바타 */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {getInitials(user.name)}
              </div>
            </div>

            {/* 사용자 정보 */}
            <div className="flex-1 md:ml-6 mt-4 md:mt-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
                      {user.role}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">{user.email}</span>
                  </div>
                </div>

                {/* 액션 버튼들 */}
                <div className="flex items-center space-x-3 mt-4 md:mt-0">
                  {isCurrentUser ? (
                    <button
                      onClick={onEdit}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center"
                    >
                      <span className="mr-2">✏️</span>
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={onMessage}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center"
                      >
                        <span className="mr-2">💬</span>
                        Message
                      </button>
                      <button
                        onClick={onFollow}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                      >
                        Follow
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* 바이오 */}
              <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl">
                {user.bio}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'activity', label: 'Activity', icon: '📈' },
              { id: 'projects', label: 'Projects', icon: '🚀' },
              { id: 'settings', label: 'Settings', icon: '⚙️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 통계 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(user.stats).map(([key, value]) => (
                <div key={key} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 capitalize mt-1">
                    {key.replace(/([A-Z])/g, ' ').trim()}
                  </div>
                </div>
              ))}
            </div>

            {/* 스킬 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map(skill => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* 연락처 정보 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(user.contact).map(([key, value]) => (
                  value && (
                    <div key={key} className="flex items-center">
                      <span className="text-gray-500 dark:text-gray-400 mr-3">
                        {key === 'phone' ? '📱' : 
                         key === 'location' ? '📍' : 
                         key === 'website' ? '🌐' : 
                         key === 'github' ? '💻' : 
                         key === 'linkedin' ? '💼' : '📧'}
                      </span>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {key}
                        </div>
                        <div className="text-gray-900 dark:text-white">
                          {value}
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📈</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Activity Timeline
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              View recent activity, contributions, and engagement metrics.
            </p>
            <p className="text-gray-400 dark:text-gray-500 mt-4 text-sm">
              Activity tracking is under development.
            </p>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Projects & Contributions
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Browse projects this user is working on or has contributed to.
            </p>
            <p className="text-gray-400 dark:text-gray-500 mt-4 text-sm">
              Project management features are coming soon.
            </p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Account Settings</h3>
            
            <div className="space-y-4">
              {Object.entries(user.preferences).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-200 capitalize">
                      {key.replace(/([A-Z])/g, ' ').trim()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {typeof value === 'boolean' 
                        ? (value ? 'Enabled' : 'Disabled')
                        : 
                      }
                    </div>
                  </div>
                  
                  {typeof value === 'boolean' ? (
                    <button
                      className={}
                    >
                      <span
                        className={}
                      />
                    </button>
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full">
                      {value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 푸터 */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div>
            Member since {formatDate(user.joinDate)}
          </div>
          <div>
            Last active {formatDate(user.lastActive)}
          </div>
        </div>
      </div>
    </div>
  );
}
EOF && echo '사용자 프로필 컴포넌트 생성 완료'
