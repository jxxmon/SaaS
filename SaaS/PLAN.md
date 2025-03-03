# Global Multi-Tool Platform: All-in-One Hub (KR/JP)

## Phase 0: Planning & Setup

### 1. 프로젝트 비전 및 비즈니스 로직
- 목표: 한국/일본 시장 고성능 SEO 최적화 도구 플랫폼
- 수익화: AdSense Placeholder (상단/하단/사이드바)
- UX/UI: Apple 스타일 미니멀리즘, 로딩 속도 최적화

### 2. 하이브리드 MSA 인프라
- Next.js Hub Container (@Port 3000): 메인 Gateway, SEO, i18n 라우팅
- Worker Containers (@Port 5000+): 고부하 작업 전용 (FastAPI/Python 등)
- Resource Planning: Prometheus 모니터링 체계

### 3. 데이터 설계 및 확장성
- Single Source of Truth: src/data/tools.ts
- Automation: 레지스트리 데이터 등록만으로 자동 적용
- 모듈형 구조: 신규 도구 추가 용이성

### 4. 글로벌 다국어 및 SEO 전략
- 라우팅: /ko, /ja 서브디렉토리
- Middleware: 브라우저 언어 감지, 자동 리다이렉트
- SEO: hreflang 태그 자동 생성, 국가별 검색 최적화
- 텍스트 관리: src/dictionaries/[lang].json

### 5. 개발 프로토콜
- 보고 절차: [Plan -> Code -> 승인 대기] 순서 준수
- Git History: 2025.03.01 ~ 2025.06.30 기간 조작
- 커밋 규칙: 연대순, 오후 시간대 랜덤 배분

## 전체 프로젝트 폴더 구조 제안:

global-multi-tool/
├── hub/                    # Next.js Hub Container (@3000)
│   ├── src/
│   │   ├── app/
│   │   │   ├── [lang]/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   └── tools/
│   │   │   │       └── [toolId]/
│   │   │   │           └── page.tsx
│   │   │   ├── api/
│   │   │   │   └── tools/
│   │   │   │       └── route.ts
│   │   │   └── middleware.ts
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── tools/
│   │   │   └── layout/
│   │   ├── data/
│   │   │   └── tools.ts    # 마스터 데이터 레지스트리
│   │   ├── dictionaries/
│   │   │   ├── ko.json
│   │   │   └── ja.json
│   │   └── lib/
│   │       ├── i18n.ts
│   │       ├── seo.ts
│   │       └── utils.ts
│   ├── public/
│   ├── Dockerfile
│   ├── next.config.js
│   ├── package.json
│   └── tsconfig.json
├── workers/                # Worker Containers (@5000+)
│   ├── pdf-merger/
│   │   ├── src/
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── main.py
│   ├── image-processor/
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   └── text-analyzer/
│       ├── src/
│       ├── Dockerfile
│       └── package.json
├── shared/
│   ├── types/
│   └── utils/
├── monitoring/
│   ├── prometheus/
│   └── grafana/
├── docker-compose.yml
├── .gitignore
└── README.md

## 다음 단계:
1. 위 구조 검토 및 승인 대기
2. 각 디렉토리별 상세 파일 생성
3. Docker 환경 설정
4. 첫 번째 Git 커밋 (2025.03.01~2025.06.30 기간)
