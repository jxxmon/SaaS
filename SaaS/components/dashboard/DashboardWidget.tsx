import React from 'react';

interface DashboardWidgetProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  variant?: 'default' | 'highlight' | 'minimal';
}

export default function DashboardWidget({ 
  title, 
  children, 
  icon,
  actionButton,
  variant = 'default'
}: DashboardWidgetProps) {
  const variantClasses = {
    default: 'bg-white border border-gray-200 shadow-lg',
    highlight: 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-lg',
    minimal: 'bg-gray-50 border border-gray-200'
  };

  return (
    <div className={}>
      {/* 위젯 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {icon && (
            <div className="mr-3 p-2 rounded-lg bg-gray-100 text-gray-700">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        </div>
        
        {actionButton && (
          <button
            onClick={actionButton.onClick}
            className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            {actionButton.icon && (
              <span className="mr-2">{actionButton.icon}</span>
            )}
            {actionButton.label}
          </button>
        )}
      </div>

      {/* 위젯 내용 */}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
EOF && echo 'DashboardWidget 생성 완료' && echo '' && echo '2. 통계 카드 컴포넌트 생성...' && cat > components/dashboard/StatsCard.tsx << 'EOF'
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'gray';
}

export default function StatsCard({ 
  title, 
  value, 
  change,
  icon,
  color = 'blue' 
}: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    gray: 'bg-gray-50 text-gray-700 border-gray-200'
  };

  const changeColor = change?.isPositive ? 'text-green-600' : 'text-red-600';
  const changeIcon = change?.isPositive ? '↗' : '↘';

  return (
    <div className={}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-medium opacity-80 mb-1">{title}</div>
          <div className="text-2xl font-bold">{value}</div>
          
          {change && (
            <div className="flex items-center mt-2">
              <span className={}>
                {changeIcon} {Math.abs(change.value)}%
              </span>
              <span className="text-xs text-gray-500">
                {change.label || 'from previous period'}
              </span>
            </div>
          )}
        </div>
        
        <div className="p-3 rounded-lg bg-white">
          {icon}
        </div>
      </div>
    </div>
  );
}
EOF && echo 'StatsCard 생성 완료' && echo '' && echo '3. 활동 피드 컴포넌트 생성...' && cat > components/dashboard/ActivityFeed.tsx << 'EOF'
import React from 'react';

interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar?: string;
    role?: string;
  };
  action: string;
  target: string;
  timestamp: string;
  icon: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  title?: string;
  maxItems?: number;
}

export default function ActivityFeed({ 
  activities, 
  title = 'Recent Activity',
  maxItems = 5 
}: ActivityFeedProps) {
  const displayedActivities = activities.slice(0, maxItems);
  
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700'
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-700">{title}</h4>
      
      <div className="space-y-3">
        {displayedActivities.map(activity => (
          <div 
            key={activity.id}
            className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={}>
              <span className="text-sm">{activity.icon}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <span className="font-medium text-gray-800">{activity.user.name}</span>
                {activity.user.role && (
                  <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                    {activity.user.role}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mt-0.5">
                <span className="font-medium">{activity.action}</span>
                <span className="text-gray-800"> {activity.target}</span>
              </p>
              
              <div className="text-xs text-gray-500 mt-1">
                {activity.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {activities.length > maxItems && (
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2 border-t border-gray-200 mt-4">
          View all {activities.length} activities →
        </button>
      )}
    </div>
  );
}
EOF && echo 'ActivityFeed 생성 완료'
