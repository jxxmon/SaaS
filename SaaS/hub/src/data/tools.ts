// 마스터 도구 데이터 레지스트리 - Single Source of Truth
// 신규 도구 추가 시 여기에 등록만 하면 자동으로 메인 페이지, 라우팅, SEO 적용

export interface Tool {
  id: string;
  name: {
    ko: string;
    ja: string;
    en: string;
  };
  description: {
    ko: string;
    ja: string;
    en: string;
  };
  category: 'text' | 'image' | 'pdf' | 'converter' | 'developer' | 'seo';
  path: string; // 라우팅 경로: /tools/[toolId]
  icon: string; // 아이콘 이름 또는 URL
  color: string; // 카드 배경색
  requiresWorker: boolean; // Worker 컨테이너 필요 여부
  workerEndpoint?: string; // Worker API 엔드포인트 (requiresWorker=true일 때)
  port?: number; // Worker 컨테이너 포트
  tags: string[]; // 검색 태그
  seoKeywords: {
    ko: string[];
    ja: string[];
  };
  createdAt: string; // 도구 추가 날짜 (YYYY-MM-DD)
  featured: boolean; // 메인 페이지 Featured 도구 여부
}

// 도구 데이터베이스
export const tools: Tool[] = [
  {
    id: 'text-counter',
    name: {
      ko: '텍스트 카운터',
      ja: 'テキストカウンター',
      en: 'Text Counter'
    },
    description: {
      ko: '텍스트의 글자수, 단어수, 줄수를 실시간으로 계산합니다',
      ja: 'テキストの文字数、単語数、行数をリアルタイムで計算します',
      en: 'Real-time text character, word, and line counter'
    },
    category: 'text',
    path: '/tools/text-counter',
    icon: '📝',
    color: 'bg-blue-50',
    requiresWorker: false,
    tags: ['텍스트', '카운터', '분석', 'text', 'counter', 'analysis'],
    seoKeywords: {
      ko: ['텍스트 카운터', '글자수 세기', '단어수 계산', '텍스트 분석'],
      ja: ['テキストカウンター', '文字数カウント', '単語数計算', 'テキスト分析']
    },
    createdAt: '2025-03-01',
    featured: true
  },
  {
    id: 'pdf-merger',
    name: {
      ko: 'PDF 병합기',
      ja: 'PDFマージャー',
      en: 'PDF Merger'
    },
    description: {
      ko: '여러 PDF 파일을 하나로 병합합니다',
      ja: '複数のPDFファイルを1つに結合します',
      en: 'Merge multiple PDF files into one'
    },
    category: 'pdf',
    path: '/tools/pdf-merger',
    icon: '📄',
    color: 'bg-red-50',
    requiresWorker: true,
    workerEndpoint: '/api/workers/pdf-merger',
    port: 5001,
    tags: ['PDF', '병합', '변환', 'pdf', 'merge', 'converter'],
    seoKeywords: {
      ko: ['PDF 병합', 'PDF 합치기', 'PDF 변환', '문서 처리'],
      ja: ['PDF結合', 'PDFマージ', 'PDF変換', 'ドキュメント処理']
    },
    createdAt: '2025-03-02',
    featured: true
  },
  {
    id: 'image-compressor',
    name: {
      ko: '이미지 압축기',
      ja: '画像圧縮ツール',
      en: 'Image Compressor'
    },
    description: {
      ko: '이미지 파일을 압축하여 용량을 줄입니다',
      ja: '画像ファイルを圧縮して容量を削減します',
      en: 'Compress image files to reduce file size'
    },
    category: 'image',
    path: '/tools/image-compressor',
    icon: '🖼️',
    color: 'bg-green-50',
    requiresWorker: true,
    workerEndpoint: '/api/workers/image-compressor',
    port: 5002,
    tags: ['이미지', '압축', '최적화', 'image', 'compress', 'optimize'],
    seoKeywords: {
      ko: ['이미지 압축', '사진 용량 줄이기', '웹 이미지 최적화'],
      ja: ['画像圧縮', '写真容量削減', 'Web画像最適化']
    },
    createdAt: '2025-03-03',
    featured: true
  },
  {
    id: 'json-formatter',
    name: {
      ko: 'JSON 포맷터',
      ja: 'JSONフォーマッター',
      en: 'JSON Formatter'
    },
    description: {
      ko: 'JSON 데이터를 보기 좋게 정렬하고 검증합니다',
      ja: 'JSONデータを見やすく整列し検証します',
      en: 'Format and validate JSON data beautifully'
    },
    category: 'developer',
    path: '/tools/json-formatter',
    icon: '{}',
    color: 'bg-purple-50',
    requiresWorker: false,
    tags: ['JSON', '포맷터', '개발자', 'json', 'formatter', 'developer'],
    seoKeywords: {
      ko: ['JSON 포맷터', 'JSON 정렬', 'JSON 검증', '개발자 도구'],
      ja: ['JSONフォーマッター', 'JSON整列', 'JSON検証', '開発者ツール']
    },
    createdAt: '2025-03-04',
    featured: false
  },
  {
    id: 'url-encoder',
    name: {
      ko: 'URL 인코더',
      ja: 'URLエンコーダー',
      en: 'URL Encoder'
    },
    description: {
      ko: 'URL을 인코딩/디코딩합니다',
      ja: 'URLをエンコード/デコードします',
      en: 'Encode and decode URLs'
    },
    category: 'developer',
    path: '/tools/url-encoder',
    icon: '🔗',
    color: 'bg-yellow-50',
    requiresWorker: false,
    tags: ['URL', '인코더', '디코더', 'url', 'encoder', 'decoder'],
    seoKeywords: {
      ko: ['URL 인코더', 'URL 디코더', '퍼센트 인코딩', '웹 개발'],
      ja: ['URLエンコーダー', 'URLデコーダー', 'パーセントエンコーディング', 'Web開発']
    },
    createdAt: '2025-03-05',
    featured: false
  }
];

// 카테고리별 도구 조회
export function getToolsByCategory(category: Tool['category']): Tool[] {
  return tools.filter(tool => tool.category === category);
}

// Featured 도구 조회
export function getFeaturedTools(): Tool[] {
  return tools.filter(tool => tool.featured);
}

// ID로 도구 조회
export function getToolById(id: string): Tool | undefined {
  return tools.find(tool => tool.id === id);
}

// 검색 기능
export function searchTools(query: string, lang: 'ko' | 'ja' | 'en'): Tool[] {
  const lowerQuery = query.toLowerCase();
  return tools.filter(tool => 
    tool.name[lang].toLowerCase().includes(lowerQuery) ||
    tool.description[lang].toLowerCase().includes(lowerQuery) ||
    tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
