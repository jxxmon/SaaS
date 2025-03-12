import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import DashboardWidget from '../../components/dashboard/DashboardWidget';

interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  title: string;
  description: string;
  requiresAuth: boolean;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  response: {
    status: number;
    example: string;
  };
}

export default function ApiDocsPage() {
  const [language, setLanguage] = useState('en');
  const [activeSection, setActiveSection] = useState('authentication');
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const apiEndpoints: Record<string, ApiEndpoint[]> = {
    authentication: [
      {
        id: 'auth-login',
        method: 'POST',
        path: '/api/v1/auth/login',
        title: 'User Login',
        description: 'Authenticate user and obtain access token',
        requiresAuth: false,
        parameters: [
          { name: 'email', type: 'string', required: true, description: 'User email address' },
          { name: 'password', type: 'string', required: true, description: 'User password' }
        ],
        response: {
          status: 200,
          example: 
        }
      },
      {
        id: 'auth-refresh',
        method: 'POST',
        path: '/api/v1/auth/refresh',
        title: 'Refresh Token',
        description: 'Refresh expired access token using refresh token',
        requiresAuth: true,
        response: {
          status: 200,
          example: 
        }
      }
    ],
    users: [
      {
        id: 'users-list',
        method: 'GET',
        path: '/api/v1/users',
        title: 'List Users',
        description: 'Retrieve list of users with pagination',
        requiresAuth: true,
        parameters: [
          { name: 'page', type: 'number', required: false, description: 'Page number (default: 1)' },
          { name: 'limit', type: 'number', required: false, description: 'Items per page (default: 20)' },
          { name: 'role', type: 'string', required: false, description: 'Filter by role' }
        ],
        response: {
          status: 200,
          example: 
        }
      },
      {
        id: 'users-get',
        method: 'GET',
        path: '/api/v1/users/{id}',
        title: 'Get User',
        description: 'Retrieve specific user by ID',
        requiresAuth: true,
        response: {
          status: 200,
          example: 
        }
      }
    ],
    tools: [
      {
        id: 'tools-list',
        method: 'GET',
        path: '/api/v1/tools',
        title: 'List Tools',
        description: 'Retrieve available tools with filtering',
        requiresAuth: false,
        parameters: [
          { name: 'category', type: 'string', required: false, description: 'Filter by category' },
          { name: 'search', type: 'string', required: false, description: 'Search by name or description' }
        ],
        response: {
          status: 200,
          example: 
        }
      },
      {
        id: 'tools-execute',
        method: 'POST',
        path: '/api/v1/tools/{id}/execute',
        title: 'Execute Tool',
        description: 'Execute a specific tool with parameters',
        requiresAuth: true,
        parameters: [
          { name: 'parameters', type: 'object', required: true, description: 'Tool-specific parameters' }
        ],
        response: {
          status: 200,
          example: 
        }
      }
    ],
    analytics: [
      {
        id: 'analytics-usage',
        method: 'GET',
        path: '/api/v1/analytics/usage',
        title: 'Usage Analytics',
        description: 'Retrieve platform usage statistics',
        requiresAuth: true,
        parameters: [
          { name: 'startDate', type: 'string', required: false, description: 'Start date (YYYY-MM-DD)' },
          { name: 'endDate', type: 'string', required: false, description: 'End date (YYYY-MM-DD)' }
        ],
        response: {
          status: 200,
          example: 
        }
      }
    ]
  };

  const sections = [
    { id: 'authentication', title: 'Authentication', icon: '🔐', description: 'User authentication and token management' },
    { id: 'users', title: 'Users', icon: '👥', description: 'User management and profiles' },
    { id: 'tools', title: 'Tools', icon: '🛠️', description: 'Tool execution and management' },
    { id: 'analytics', title: 'Analytics', icon: '📊', description: 'Platform analytics and metrics' },
    { id: 'webhooks', title: 'Webhooks', icon: '🔗', description: 'Event notifications and webhooks' },
    { id: 'rate-limits', title: 'Rate Limits', icon: '⏱️', description: 'API rate limiting and quotas' }
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'PATCH': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const copyToClipboard = (text: string, endpointId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpointId);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <MainLayout language={language}>
      <div className="max-w-6xl mx-auto">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">API Documentation</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Complete reference for the Global Multi-Tool Platform API
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 왼쪽: 네비게이션 */}
          <div className="lg:col-span-1">
            <DashboardWidget title="API Sections" variant="minimal">
              <div className="space-y-2">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={}
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-3">{section.icon}</span>
                      <div>
                        <div className="font-medium">{section.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          {section.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </DashboardWidget>

            {/* 빠른 시작 */}
            <DashboardWidget title="Quick Start" variant="minimal" className="mt-6">
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Base URL</div>
                  <code className="text-xs text-gray-600 dark:text-gray-400 block mt-1">
                    https://api.globaltools.com
                  </code>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Authentication</div>
                  <code className="text-xs text-gray-600 dark:text-gray-400 block mt-1">
                    Authorization: Bearer {'<token>'}
                  </code>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Rate Limit</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    100 requests per minute per API key
                  </div>
                </div>
              </div>
            </DashboardWidget>
          </div>

          {/* 오른쪽: API 문서 */}
          <div className="lg:col-span-3">
            <DashboardWidget
              title={sections.find(s => s.id === activeSection)?.title || 'API Documentation'}
              icon={sections.find(s => s.id === activeSection)?.icon || '📚'}
            >
              <div className="space-y-8">
                {/* 섹션 설명 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                    {sections.find(s => s.id === activeSection)?.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {sections.find(s => s.id === activeSection)?.description}
                  </p>
                </div>

                {/* API 엔드포인트들 */}
                {apiEndpoints[activeSection] ? (
                  <div className="space-y-6">
                    {apiEndpoints[activeSection].map(endpoint => (
                      <div key={endpoint.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                        {/* 엔드포인트 헤더 */}
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className={}>
                              {endpoint.method}
                            </span>
                            <code className="text-gray-800 dark:text-gray-200 font-mono">
                              {endpoint.path}
                            </code>
                          </div>
                          <button
                            onClick={() => copyToClipboard(, endpoint.id)}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center"
                          >
                            {copiedEndpoint === endpoint.id ? (
                              <>
                                <span className="mr-2">✅</span>
                                Copied!
                              </>
                            ) : (
                              <>
                                <span className="mr-2">📋</span>
                                Copy cURL
                              </>
                            )}
                          </button>
                        </div>

                        {/* 엔드포인트 내용 */}
                        <div className="p-6 space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                              {endpoint.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400">
                              {endpoint.description}
                            </p>
                          </div>

                          {/* 파라미터 */}
                          {endpoint.parameters && endpoint.parameters.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Parameters</h5>
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                  <thead>
                                    <tr>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Required</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Description</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {endpoint.parameters.map(param => (
                                      <tr key={param.name}>
                                        <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200 font-mono">
                                          {param.name}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                                          {param.type}
                                        </td>
                                        <td className="px-4 py-2 text-sm">
                                          <span className={}>
                                            {param.required ? 'Required' : 'Optional'}
                                          </span>
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                                          {param.description}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* 응답 예제 */}
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Response Example ({endpoint.response.status})
                            </h5>
                            <div className="relative">
                              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                                <code>{endpoint.response.example}</code>
                              </pre>
                              <button
                                onClick={() => copyToClipboard(endpoint.response.example, endpoint.id + '-response')}
                                className="absolute top-2 right-2 text-gray-400 hover:text-white text-sm"
                              >
                                📋 Copy
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">🚧</div>
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Documentation in Progress
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                      This section is currently being documented. Check back soon for updates.
                    </p>
                  </div>
                )}
              </div>
            </DashboardWidget>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
EOF && echo 'API 문서 페이지 생성 완료'
