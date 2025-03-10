import React, { useState, useEffect } from 'react';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationSystemProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  onActionClick?: (notification: Notification) => void;
  maxVisible?: number;
}

export default function NotificationSystem({
  notifications,
  onMarkAsRead,
  onClearAll,
  onActionClick,
  maxVisible = 5
}: NotificationSystemProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const sorted = [...notifications]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, expanded ? notifications.length : maxVisible);
    setVisibleNotifications(sorted);
  }, [notifications, expanded, maxVisible]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return ;
    if (diffHours < 24) return ;
    if (diffDays < 7) return ;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-xl mr-3">🔔</div>
          <div>
            <h3 className="font-bold text-gray-800">Notifications</h3>
            <div className="text-sm text-gray-500">
              {unreadCount > 0 
                ? 
                : 'All caught up'
              }
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {unreadCount > 0 && (
            <button
              onClick={onClearAll}
              className="text-sm text-gray-600 hover:text-gray-800 font-medium"
            >
              Mark all as read
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {expanded ? 'Show less' : 'View all'}
          </button>
        </div>
      </div>

      {/* 알림 목록 */}
      <div className="max-h-96 overflow-y-auto">
        {visibleNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📭</div>
            <h4 className="text-lg font-medium text-gray-700 mb-2">No notifications</h4>
            <p className="text-gray-500 max-w-xs mx-auto">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {visibleNotifications.map(notification => (
              <div
                key={notification.id}
                className={}
                onClick={() => onMarkAsRead(notification.id)}
              >
                <div className="flex items-start">
                  {/* 알림 타입 아이콘 */}
                  <div className={}>
                    <span className="text-lg">{getTypeIcon(notification.type)}</span>
                  </div>

                  {/* 알림 내용 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">{notification.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-3 flex-shrink-0 mt-2"></div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="text-xs text-gray-500">
                        {formatTime(notification.timestamp)}
                      </div>
                      
                      {notification.action && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            notification.action?.onClick();
                            onActionClick?.(notification);
                          }}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          {notification.action.label}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 푸터 */}
      {notifications.length > maxVisible && (
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div className="text-center text-sm text-gray-600">
            Showing {visibleNotifications.length} of {notifications.length} notifications
          </div>
        </div>
      )}
    </div>
  );
}
EOF && echo '알림 시스템 컴포넌트 생성 완료' && echo '' && echo '2. 알림 훅 생성...' && cat > components/notifications/useNotifications.ts << 'EOF'
import { useState, useCallback, useEffect } from 'react';
import { Notification } from './NotificationSystem';

export function useNotifications(initialNotifications: Notification[] = []) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // 자동으로 5초 후 읽음 처리 (에러는 10초)
    const timeout = notification.type === 'error' ? 10000 : 5000;
    setTimeout(() => {
      markAsRead(newNotification.id);
    }, timeout);
    
    return newNotification.id;
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const getUnreadCount = useCallback(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // 예제 알림 데이터
  const addExampleNotifications = useCallback(() => {
    const examples: Omit<Notification, 'id' | 'timestamp' | 'read'>[] = [
      {
        type: 'success',
        title: 'Deployment Successful',
        message: 'AI Analysis Worker v2.1 has been deployed to production',
        action: {
          label: 'View Details',
          onClick: () => console.log('View deployment details')
        }
      },
      {
        type: 'info',
        title: 'System Maintenance',
        message: 'Scheduled maintenance will begin in 2 hours',
        action: {
          label: 'Learn More',
          onClick: () => console.log('View maintenance details')
        }
      },
      {
        type: 'warning',
        title: 'API Rate Limit',
        message: 'You are approaching your API rate limit (85% used)',
        action: {
          label: 'Upgrade Plan',
          onClick: () => console.log('Upgrade API plan')
        }
      },
      {
        type: 'error',
        title: 'Service Disruption',
        message: 'Data processing service is experiencing issues',
        action: {
          label: 'Check Status',
          onClick: () => console.log('Check service status')
        }
      }
    ];

    examples.forEach(example => addNotification(example));
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    getUnreadCount,
    addExampleNotifications
  };
}
EOF && echo '알림 훅 생성 완료'
