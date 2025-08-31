なな (NANA) - Editorial Commerce Design System
🎌 Brand Identity
Core Concept
"Living Magazine meets Digital Commerce"

매거진을 읽듯 자연스럽게 쇼핑으로 이어지는 경험
일본 패션 매거진의 섬세함 × 디지털 인터랙티브의 혁신

Brand Values

Editorial First: 콘텐츠가 상품을 이끈다
Seasonal Narrative: 계절의 이야기를 담은 큐레이션
Kawaii Minimalism: 귀엽지만 세련된 절제미
Discovery Journey: 발견의 즐거움을 주는 탐색 경험

🎨 Design Language
Visual Principles
1. Layout Philosophy
Magazine Mode (Landing/Editorial):
- 전통적인 잡지 그리드 시스템
- 12 Column Grid with 3:5:4 비율
- 여백을 "숨 쉬는 공간"으로 활용
- 비대칭 레이아웃으로 리듬감 생성

Commerce Mode (Product/Shop):
- 정보 위계가 명확한 구조
- 4-6 Column Flexible Grid
- 상품 정보 가독성 최우선
- 빠른 스캐닝이 가능한 카드 시스템
2. Typography System
Editorial Headers:
- JP: A-OTF Ryumin Pro (明朝体)
- EN: Didot / Bodoni (Fashion Serif)
- Size: 72px ~ 120px (Desktop)

Body Text:
- JP: Hiragino Kaku Gothic
- EN: Helvetica Neue Light
- Size: 14px ~ 16px
- Line Height: 1.8 (일본 잡지 특유의 넓은 행간)

Product Information:
- Price: Futura Bold
- Description: Gothic A1
- Size: 12px ~ 14px
3. Color System
scss// Primary Palette - "Sakura Sky"
$nana-pink: #FFB7C5;        // 시그니처 벚꽃 핑크
$powder-pink: #FADADD;      // 파우더 터치
$morning-sky: #87CEEB;      // 아침 하늘
$cloud-white: #F8F8FF;      // 구름 화이트

// Gradient System
$hero-gradient: linear-gradient(135deg, $nana-pink 0%, $morning-sky 100%);
$bubble-gradient: radial-gradient(circle at 30% 30%, rgba(255,183,197,0.3), rgba(135,206,235,0.2));

// Seasonal Themes
$spring: { primary: $nana-pink, accent: $morning-sky };
$summer: { primary: #FFB347, accent: #40E0D0 };
$autumn: { primary: #CD853F, accent: #8B7355 };
$winter: { primary: #B695BF, accent: #E6E6FA };

// Functional Colors
$text-primary: #1A1A1A;
$text-secondary: #666666;
$border-light: rgba(0,0,0,0.06);
$shadow-soft: 0 4px 20px rgba(255,183,197,0.15);
🎭 Interaction Design
Animation Principles
javascript// Core Timing Functions
const timings = {
  pageTurn: 'cubic-bezier(0.645, 0.045, 0.355, 1)', // 종이 넘김
  bubble: 'cubic-bezier(0.23, 1, 0.32, 1)',         // 버블 움직임
  hover: 'cubic-bezier(0.4, 0, 0.2, 1)',            // 호버 효과
  reveal: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'    // 콘텐츠 등장
}

// Duration Standards
const durations = {
  instant: 150,    // ms
  fast: 300,
  normal: 600,
  slow: 900,
  pageFlip: 1200
}
Signature Interactions
1. "Magazine Flip" Navigation

좌우 스와이프/드래그로 페이지 전환
페이지 모서리 컬 효과 (curl effect)
현재 페이지 번호 우하단 표시 (p.24-25)
미리보기 썸네일 하단 표시

2. "Floating Bubble" System

MEDIA JD 레퍼런스의 3D 버블 차용
매거진 페이지 위 레이어로 부유
마우스 추적 패럴랙스 (깊이감 3단계)
버블 내부에 상품 미리보기 또는 카테고리 아이콘

3. "Editorial Reveal" Scroll

스크롤 시 콘텐츠가 아래에서 위로 페이드인
이미지와 텍스트 시차 애니메이션 (0.2초 딜레이)
일본 잡지 특유의 "뿌리기" 레이아웃 순차 등장

📐 Grid & Spacing
Spatial System
scss// Base Unit: 8px (일본 디자인의 8배수 규칙)
$space-unit: 8px;

// Spacing Scale
$space-xs: $space-unit * 1;   // 8px
$space-sm: $space-unit * 2;   // 16px
$space-md: $space-unit * 3;   // 24px
$space-lg: $space-unit * 4;   // 32px
$space-xl: $space-unit * 6;   // 48px
$space-xxl: $space-unit * 8;  // 64px
$space-xxxl: $space-unit * 12; // 96px

// Magazine Margins
$margin-spread: 120px;  // 양면 펼침 시 중앙 여백
$margin-outer: 80px;    // 외곽 여백
$margin-inner: 40px;    // 내부 컬럼 간격
Responsive Breakpoints
scss$breakpoints: (
  'mobile': 320px,      // 세로 스크롤 매거진
  'tablet': 768px,      // 단면 매거진
  'desktop': 1024px,    // 양면 펼침 시작
  'wide': 1440px,      // 풀 매거진 경험
  'ultra': 1920px      // 대형 디스플레이
);
🛍️ Commerce Integration Points
Magazine → Shopping Transition

Soft Transition: 매거진 페이지에서 상품 클릭 시 부드러운 전환
Context Preservation: 이전 페이지 컨텍스트 유지 (breadcrumb)
Dual Navigation: 매거진 모드 / 쇼핑 모드 전환 토글

Product Display Modes
Editorial Mode:
- 화보 중심
- 스토리텔링 우선
- 가격 정보 최소화
- 분위기와 컨텍스트 강조

Shopping Mode:
- 상품 정보 명확
- 가격/옵션 즉시 확인
- 빠른 카테고리 탐색
- 필터/정렬 기능 활성화
🎌 Japanese Magazine Elements
Content Patterns

Cover Story Format: 메인 특집 기사 형식
Editor's Pick: 에디터 추천 코너
Street Snap: 스트릿 패션 갤러리
How to Coordinate: 코디 제안 페이지
Brand Story: 브랜드 인터뷰/히스토리

Visual Decorations
- 손글씨 주석 (Handwritten annotations)
- 작은 일러스트 장식 (Kawaii illustrations)
- 스티커 효과 (Digital sticker effects)
- 말풍선 팁 (Speech bubble tips)
- 계절 아이콘 (Seasonal motifs)
🚀 Technical Standards
Performance Goals

First Contentful Paint: < 1.5s
Page Flip Animation: 60fps
Image Lazy Loading with blur-up effect
Prefetch next 2 magazine pages

Browser Support

Chrome 90+, Safari 14+, Firefox 88+
Mobile: iOS 14+, Android 10+
Fallback: Static magazine view for older browsers

Accessibility

ARIA labels for magazine navigation
Keyboard navigation support (←→ for page flip)
Screen reader friendly product descriptions
High contrast mode support

📝 Development Guidelines
Component Architecture
/components
  /magazine
    - PageFlip.jsx
    - SpreadLayout.jsx
    - EditorialContent.jsx
  /commerce
    - ProductGrid.jsx
    - QuickShop.jsx
    - CartBubble.jsx
  /shared
    - FloatingBubble.jsx
    - NavigationToggle.jsx
    - SeasonalTheme.jsx
State Management

Magazine reading position
Bookmarked pages
View mode (Magazine/Shopping)
Seasonal theme active
Cart items with bubble animation queue

API Structure
javascript// Magazine Content API
GET /api/magazine/current-issue
GET /api/magazine/page/:pageNumber
GET /api/magazine/archives

// Product Integration API
GET /api/products/editorial/:editorialId
GET /api/products/tagged/:pageId
POST /api/cart/add-from-magazine
🎯 Success Metrics
User Experience KPIs

Average time on magazine pages: > 3 minutes
Page flip completion rate: > 60%
Magazine to purchase conversion: > 15%
Return visitor rate: > 40%

Design Quality Checks

 매거진 느낌이 자연스러운가?
 쇼핑 전환이 부드러운가?
 일본 감성이 잘 표현되었는가?
 버블 인터랙션이 과하지 않은가?
 모바일에서도 매거진 경험이 유지되는가?

 