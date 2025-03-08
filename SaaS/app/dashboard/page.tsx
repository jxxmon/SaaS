import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import DashboardWidget from '../../components/dashboard/DashboardWidget';
import StatsCard from '../../components/dashboard/StatsCard';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import ToolsGrid from '../../components/tools/ToolsGrid';
import LanguageSwitcher from '../../components/language/LanguageSwitcher';
import { tools } from '../../lib/tools';

// 샘플 통계 데이터
const statsData = [
  {
    title: 'Active Tools',
    value: '24',
    change: { value: 12, isPositive: true, label: 'from last month' },
    icon: '🛠️',
    color: 'blue' as const
  },
  {
    title: 'Total Users',
    value: '1,842',
    change: { value: 8, isPositive: true, label: 'from last week' },
    icon: '👥',
    color: 'green' as const
  },
  {
    title: 'API Requests',
    value: '42.5K',
    change: { value: 23, isPositive: true, label: 'from yesterday' },
    icon: '📊',
    color: 'purple' as const
  },
  {
    title: 'Uptime',
    value: '99.9%',
    change: { value: 0.1, isPositive: false, label: 'from last month' },
    icon: '🚀',
    color: 'orange' as const
  }
];

// 샘플 활동 데이터
const activities = [
  {
    id: '1',
    user: { name: 'Alex Chen', role: 'Admin' },
    action: 'deployed',
    target: 'AI Analysis Worker v2.1',
    timestamp: '10 minutes ago',
    icon: '🚀',
    color: 'green' as const
  },
  {
    id: '2',
    user: { name: 'Maria Rodriguez' },
    action: 'created',
    target: 'new data pipeline',
    timestamp: '45 minutes ago',
    icon: '➕',
    color: 'blue' as const
  },
  {
    id: '3',
    user: { name: 'System', role: 'Bot' },
    action: 'completed',
    target: 'scheduled maintenance',
    timestamp: '2 hours ago',
    icon: '✅',
    color: 'purple' as const
  },
  {
    id: '4',
    user: { name: 'James Wilson' },
    action: 'updated',
    target: 'documentation for API v3',
    timestamp: '5 hours ago',
    icon: '📝',
    color: 'orange' as const
  },
  {
    id: '5',
    user: { name: 'Sarah Kim', role: 'Developer' },
    action: 'fixed',
    target: 'bug in translation service',
    timestamp: '1 day ago',
    icon: '🐛',
    color: 'blue' as const
  }
];

export default function DashboardPage() {
  const [language, setLanguage] = React.useState('en');

  return (
    <MainLayout language={language}>
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Global Multi-Tool Platform</h1>
            <p className="text-gray-600 mt-2">
              Centralized hub for accessing and managing all your productivity tools
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <LanguageSwitcher
              currentLanguage={language}
              onLanguageChange={setLanguage}
              compact
            />
          </div>
        </div>
      </div>

      {/* 통계 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* 메인 콘텐츠 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽 열: 도구 그리드 */}
        <div className="lg:col-span-2">
          <DashboardWidget
            title="Available Tools"
            icon="🛠️"
            actionButton={{
              label: 'View All Tools',
              onClick: () => console.log('View all tools'),
              icon: '→'
            }}
          >
            <ToolsGrid
              tools={tools}
              language={language}
              onToolSelect={(tool) => console.log('Selected tool:', tool)}
            />
          </DashboardWidget>
        </div>

        {/* 오른쪽 열: 사이드바 */}
        <div className="space-y-8">
          {/* 활동 피드 */}
          <DashboardWidget
            title="Recent Activity"
            icon="📋"
            variant="minimal"
          >
            <ActivityFeed activities={activities} />
          </DashboardWidget>

          {/* 빠른 액션 */}
          <DashboardWidget
            title="Quick Actions"
            icon="⚡"
            variant="highlight"
          >
            <div className="space-y-3">
              <button className="w-full text-left p-4 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="font-medium text-gray-800">Create New Tool</div>
                <div className="text-sm text-gray-500 mt-1">Add custom tool to the platform</div>
              </button>
              <button className="w-full text-left p-4 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="font-medium text-gray-800">Invite Team Members</div>
                <div className="text-sm text-gray-500 mt-1">Collaborate with your team</div>
              </button>
              <button className="w-full text-left p-4 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="font-medium text-gray-800">View Analytics</div>
                <div className="text-sm text-gray-500 mt-1">Detailed usage reports</div>
              </button>
            </div>
          </DashboardWidget>
        </div>
      </div>
    </MainLayout>
  );
}
EOF && echo '대시보드 페이지 생성 완료'
