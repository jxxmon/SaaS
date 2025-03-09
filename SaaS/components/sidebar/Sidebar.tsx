import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
  children?: NavItem[];
}

interface SidebarProps {
  currentPath: string;
  language: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ 
  currentPath, 
  language,
  collapsed = false,
  onToggleCollapse 
}: SidebarProps) {
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // 네비게이션 항목들
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/dashboard'
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: '🛠️',
      path: '/tools',
      children: [
        { id: 'all-tools', label: 'All Tools', icon: '📋', path: '/tools' },
        { id: 'ai-tools', label: 'AI Tools', icon: '🤖', path: '/tools/ai' },
        { id: 'data-tools', label: 'Data Tools', icon: '📊', path: '/tools/data' },
        { id: 'dev-tools', label: 'Dev Tools', icon: '💻', path: '/tools/dev' },
        { id: 'productivity', label: 'Productivity', icon: '⚡', path: '/tools/productivity' }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📈',
      path: '/analytics',
      badge: 3
    },
    {
      id: 'team',
      label: 'Team',
      icon: '👥',
      path: '/team'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      path: '/settings',
      children: [
        { id: 'general', label: 'General', icon: '🌐', path: '/settings/general' },
        { id: 'security', label: 'Security', icon: '🔒', path: '/settings/security' },
        { id: 'notifications', label: 'Notifications', icon: '🔔', path: '/settings/notifications' },
        { id: 'billing', label: 'Billing', icon: '💰', path: '/settings/billing' }
      ]
    },
    {
      id: 'documentation',
      label: 'Documentation',
      icon: '📚',
      path: '/docs'
    },
    {
      id: 'support',
      label: 'Support',
      icon: '💬',
      path: '/support',
      badge: 5
    }
  ];

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (path: string) => {
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.path);

    return (
      <div key={item.id} className="space-y-1">
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.id);
            } else {
              router.push(item.path);
            }
          }}
          className={}
        >
          <div className="flex items-center">
            <span className="text-lg mr-3">{item.icon}</span>
            {!collapsed && (
              <span className="font-medium">{item.label}</span>
            )}
          </div>
          
          <div className="flex items-center">
            {item.badge && !collapsed && (
              <span className="mr-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <svg 
                className={}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </button>

        {hasChildren && isExpanded && !collapsed && (
          <div className="ml-4 space-y-1 border-l border-gray-200 pl-4">
            {item.children!.map(child => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={}>
      {/* 사이드바 헤더 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3">
                G
              </div>
              <div>
                <div className="font-bold text-gray-800">Global Tools</div>
                <div className="text-xs text-gray-500">Platform v2.1</div>
              </div>
            </div>
          )}
          
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold mx-auto">
              G
            </div>
          )}

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              {collapsed ? '→' : '←'}
            </button>
          )}
        </div>
      </div>

      {/* 네비게이션 메뉴 */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map(item => renderNavItem(item))}
      </div>

      {/* 사이드바 푸터 */}
      <div className="p-4 border-t border-gray-200">
        {!collapsed ? (
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold mr-3">
                AJ
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">Alex Johnson</div>
                <div className="text-xs text-gray-500">Admin</div>
              </div>
            </div>
            <button className="w-full text-center text-sm text-gray-600 hover:text-gray-800 font-medium py-2">
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
              AJ
            </div>
            <button className="text-gray-600 hover:text-gray-800">
              ⬅
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
EOF && echo '사이드바 컴포넌트 생성 완료'
