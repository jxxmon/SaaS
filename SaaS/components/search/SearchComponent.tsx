import React, { useState, useEffect, useRef } from 'react';

export interface SearchResult {
  id: string;
  type: 'tool' | 'documentation' | 'team' | 'project';
  title: string;
  description: string;
  icon: string;
  path: string;
  relevance: number;
  tags?: string[];
}

interface SearchComponentProps {
  onSearch: (query: string) => SearchResult[];
  onResultSelect: (result: SearchResult) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export default function SearchComponent({
  onSearch,
  onResultSelect,
  placeholder = 'Search tools, documentation, or team members...',
  autoFocus = false,
  className = ''
}: SearchComponentProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 검색 실행
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchTimeout = setTimeout(() => {
      setLoading(true);
      const searchResults = onSearch(query);
      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
      setSelectedIndex(-1);
      setLoading(false);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, onSearch]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleResultSelect = (result: SearchResult) => {
    onResultSelect(result);
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(-1);
  };

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'tool': return 'bg-blue-100 text-blue-800';
      case 'documentation': return 'bg-green-100 text-green-800';
      case 'team': return 'bg-purple-100 text-purple-800';
      case 'project': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'tool': return 'Tool';
      case 'documentation': return 'Documentation';
      case 'team': return 'Team';
      case 'project': return 'Project';
      default: return 'Item';
    }
  };

  // 예제 검색 함수
  const exampleSearch = (query: string): SearchResult[] => {
    const allResults: SearchResult[] = [
      {
        id: '1',
        type: 'tool',
        title: 'AI Analysis Worker',
        description: 'Advanced AI-powered data analysis tool',
        icon: '🤖',
        path: '/tools/ai-analysis',
        relevance: 95,
        tags: ['AI', 'Data', 'Analysis']
      },
      {
        id: '2',
        type: 'tool',
        title: 'Code Review Assistant',
        description: 'Automated code review and quality analysis',
        icon: '💻',
        path: '/tools/code-review',
        relevance: 85,
        tags: ['Development', 'Code', 'Quality']
      },
      {
        id: '3',
        type: 'documentation',
        title: 'API Integration Guide',
        description: 'Complete guide for API integration and usage',
        icon: '📚',
        path: '/docs/api-integration',
        relevance: 80,
        tags: ['API', 'Integration', 'Guide']
      },
      {
        id: '4',
        type: 'team',
        title: 'Alex Johnson',
        description: 'Lead Developer - Platform Architecture',
        icon: '👤',
        path: '/team/alex-johnson',
        relevance: 75,
        tags: ['Developer', 'Lead', 'Architecture']
      },
      {
        id: '5',
        type: 'project',
        title: 'Global Analytics Dashboard',
        description: 'Real-time analytics and reporting dashboard',
        icon: '📊',
        path: '/projects/analytics-dashboard',
        relevance: 70,
        tags: ['Analytics', 'Dashboard', 'Reporting']
      },
      {
        id: '6',
        type: 'tool',
        title: 'Data Pipeline Manager',
        description: 'Manage and monitor data pipelines',
        icon: '🔧',
        path: '/tools/data-pipeline',
        relevance: 65,
        tags: ['Data', 'Pipeline', 'ETL']
      }
    ];

    const lowerQuery = query.toLowerCase();
    return allResults
      .filter(result => 
        result.title.toLowerCase().includes(lowerQuery) ||
        result.description.toLowerCase().includes(lowerQuery) ||
        result.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 6);
  };

  return (
    <div ref={searchRef} className={}>
      {/* 검색 입력 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          ) : (
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
        />
        
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* 검색 결과 드롭다운 */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
          <div className="max-h-96 overflow-y-auto">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="text-sm font-medium text-gray-700">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </div>
            </div>

            {results.map((result, index) => (
              <button
                key={result.id}
                onClick={() => handleResultSelect(result)}
                className={}
              >
                <div className="flex items-start">
                  {/* 아이콘 */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-4">
                    <span className="text-lg">{result.icon}</span>
                  </div>

                  {/* 내용 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-800 truncate">{result.title}</h4>
                      <span className={}>
                        {getTypeLabel(result.type)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{result.description}</p>
                    
                    {result.tags && result.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {result.tags.map(tag => (
                          <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* 푸터 */}
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-500 flex items-center justify-between">
              <div>
                <span className="font-medium">Tip:</span> Use ↑↓ arrows to navigate, Enter to select, Esc to close
              </div>
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs font-mono mr-1">⌘K</kbd>
                  <span>to focus</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 검색 결과 없음 */}
      {isOpen && query.trim() && results.length === 0 && !loading && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔍</div>
            <h4 className="text-lg font-medium text-gray-700 mb-2">No results found</h4>
            <p className="text-gray-500 max-w-xs mx-auto">
              Try searching for tools, documentation, team members, or projects
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
EOF && echo '검색 컴포넌트 생성 완료'
