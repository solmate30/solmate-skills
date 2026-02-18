---
name: dev-conventions
description: Apply development setup, coding conventions, and quality rules when writing code, configuring environment, or reviewing implementation. Use when the user asks about dev setup, coding standards, commit rules, env vars, DB safety, or "what to follow when developing." Includes framework-specific patterns for Next.js, React Router v7, and React (SPA/Vite). Always align with project AGENTS.md and any DEVELOPMENT_PRINCIPLES document.
---

# Development Conventions Skill

This skill defines **development setup**, **conventions to follow**, and **prohibitions** so that code and environment stay consistent, secure, and maintainable. It is intended for **global use** across projects that follow Antigravity/AGENTS-style standards. Project-specific details (e.g. stack, app directory name) live in the repo's AGENTS.md or `docs/03_Technical_Specs/00_DEVELOPMENT_PRINCIPLES.md`.

---

## 1. When to Use This Skill

- Writing or modifying application code, configs, or scripts.
- Setting up or changing development environment (env files, Node version, lint/format).
- Answering "what rules do we follow when developing?" or "how do we set up locally?"
- Before running DB migrations, schema changes, or destructive commands.
- Before committing (message format, scope).

---

## 2. Development Setup (Checklist)

| 항목 | 규칙 |
|------|------|
| **Env 파일** | `.env.development` / `.env.local` = 로컬 전용. `.env.production` = 배포 파라미터. 두 환경을 파일로 엄격히 분리한다. |
| **Env 커밋** | `.env*` 파일은 절대 Git에 커밋하지 않는다. 추가/수정 전 `.gitignore`에 `.env*` 포함 여부를 확인한다. |
| **Node / 패키지** | 프로젝트에서 지정한 Node 버전(nvm, .nvmrc, engines) 및 lockfile(package-lock.json 등)을 사용한다. |
| **린트/포맷** | 프로젝트에 eslint, prettier 등이 있으면 수정 후 규칙 위반이 없도록 한다. |
| **중요 작업 전** | 파일 생성, DB 스키마 변경, 패키지 설치 등 중요 작업 전에 현재 상태를 git commit 하거나 확인한다. |

---

## 3. Conventions to Follow

### 3.1. Git & Commit

- **커밋 메시지 형식**: `type(scope): subject`
  - **Type** (영문): `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
  - **Subject** (한글): 명확한 요약. 예: `feat(auth): 소셜 로그인 API 연동`
  - **상세**: 최소 3줄 이상, 각 줄은 `- `로 시작해 구체 내용 기술.

- **Git 루트**: 문서(docs)와 앱 코드를 함께 관리하는 경우, Git 작업은 **루트 디렉터리**에서 수행. 배포 루트는 보통 **앱 디렉터리**(예: `web`, `app`)로 지정.

### 3.2. TypeScript & Types

- **Strict 모드**: TypeScript strict 옵션을 유지한다. 프로젝트가 이미 켜 두었다면 끄지 않는다.
- **any 지양**: 타입을 모를 때는 `unknown` 또는 구체 타입을 정의해 사용. `any`는 예외적으로만 사용하고 이유를 남긴다.

### 3.3. Data & Validation

- **스키마/파싱**: API 요청·응답, env 파싱, 폼 데이터 등 검증이 필요한 곳에는 **Zod**를 사용해 스키마를 정의하고 파싱한다. `z.object()` 등으로 타입 안전하게 처리.
- **날짜/시간**: 날짜·시간 처리에는 **Luxon**을 사용한다. 네이티브 Date만 쓰지 않고 timezone·포맷을 Luxon으로 통일한다.

### 3.4. Structure & Imports

- **구조**: 프로젝트의 루트는 관리(문서, 설정), 앱 디렉터리는 구현(소스, 빌드). 프로젝트별 `AGENTS.md` 또는 `00_DEVELOPMENT_PRINCIPLES.md`에 path alias vs relative import 규칙이 있으면 그에 따른다.
- **공통 로직 수정**: 공유 컴포넌트·유틸 수정 시 **영향 범위**를 먼저 파악하고, 특정 기능만 위한 변경은 조건문/가드로 **격리**하여 다른 기능에 부작용이 없게 한다.

#### 3.4.1. 모노레포 원칙 및 앱 디렉터리 이름

- **모노레포 원칙**: 한 저장소에서 **관리(문서·Git·설정)** 와 **구현(소스·빌드)** 을 함께 둘 때 다음을 지킨다. (1) **루트 디렉터리** = 관리 영역. `docs/`, `AGENTS.md`, 설정 파일 등. (2) **앱 디렉터리** = 구현 영역. 소스 코드, `package.json`, 빌드 산출물. (3) **Git 작업**은 루트에서 수행해 문서와 코드를 통합 관리. (4) **배포** 시 빌드·서빙 루트는 앱 디렉터리로 지정(예: Vercel root = `web`).
- **앱 디렉터리 이름**: 구현용 폴더 이름은 **`web`** 으로 통일한다. 루트 바로 아래 `web/` 에 프론트엔드(또는 풀스택) 앱을 두고, 배포 루트도 `web` 으로 설정한다. 프로젝트 사정으로 다른 이름(예: `app`, `frontend`)을 쓸 경우에는 `00_DEVELOPMENT_PRINCIPLES.md` 에 "앱 디렉터리: app" 처럼 명시한다.

---

## 4. Prohibitions & Safety

### 4.1. 절대 금지

| 금지 항목 | 이유 |
|-----------|------|
| `.env*` 커밋 | 시크릿 유출. `.gitignore`로 원천 차단. |
| 임시 패치(Quick-fix) | 기술 부채·재발. 공식·표준 방식으로 해결. |
| 추측 기반 답변 | "아마 그럴 것이다" 금지. 도구로 상태 검증 후 답변. |
| 승인 없이 코드 수정 | 수정 계획 보고 후 명시적 승인을 받은 뒤 진행. |

### 4.2. Database

- **파괴적 작업 전**: 마이그레이션, 스키마 변경, DROP 등 **전체 백업(Dump)** 선행. 데이터 보존이 최우선.
- **백업 확인 전**: `DROP TABLE`, `migrate reset` 등 파괴적 명령 실행 금지.

### 4.3. Code Quality

- **console.log**: 배포/머지 전 디버깅용 로그 제거. 필요 시 로거/환경 분기 사용.
- **불필요한 주석**: 과도한 주석·죽은 코드 제거. 복잡한 로직만 의도·동작을 주석 또는 문서로 남긴다.
- **API/인증 수정 시**: 권한 검사(Guard Clause) 존재 여부를 다시 확인한다.

---

## 5. Environment Variables (Summary)

- **로컬**: `.env.development` 또는 `.env.local` — 테스트 키, localhost URL.
- **운영**: `.env.production` 또는 호스팅 대시보드/CLI — 프로덕션 도메인·키. 운영 시크릿은 파일로 서버에 올리지 않고 클라우드 시크릿으로 관리.
- **리다이렉트·Auth**: 개발 시 localhost, 배포 시 검증된 프로덕션 도메인으로 분리 설정.

---

## 6. Project References (In-Repo)

다음은 프로젝트 루트 또는 docs 내에 있을 수 있는 참고 문서다. 있으면 우선 적용한다.

| 문서 | 용도 |
|------|------|
| **AGENTS.md** (루트) | 커뮤니케이션·문서 구조·개발 표준·Git 규칙. 최상위 준칙. |
| **docs/03_Technical_Specs/00_DEVELOPMENT_PRINCIPLES.md** | 아키텍처, 패턴, 스탠다드, 도구, .gitignore 대상 등 상세 개발 원칙. |

프로젝트에 위 문서가 있으면 해당 내용을 이 스킬의 기본값보다 우선한다. 없으면 이 스킬의 규칙을 기본으로 적용한다.

---

## 7. Git 제외 대상 (Typical .gitignore)

다음은 로컬/개인용으로 Git에 넣지 않는 것이 일반적이다. 프로젝트 `00_DEVELOPMENT_PRINCIPLES.md` 또는 `.gitignore`에 정의된 내용이 있으면 그에 따른다.

| 대상 | 사유 |
|------|------|
| `.env*` | 시크릿·환경별 설정 |
| `.agent/` | AI 에이전트 스킬 (로컬 워크플로우) |
| `.claude/` | Claude 프로젝트 설정 (개인 환경) |
| `.cursor/` | Cursor IDE 에이전트 및 설정 (로컬 워크플로우) |
| `.vscode/` | 에디터 설정 (팀 정책에 따라 포함할 수도 있음) |
| `AGENTS.md` / `CLAUDE.md` | 로컬 전용으로 정한 경우 |

`docs/` 및 공유 디자인 문서는 보통 Git에 포함한다.

---

## 8. Execution Summary

- 코드/설정을 건드리기 전: **AGENTS.md** 및 **00_DEVELOPMENT_PRINCIPLES.md**(있으면) 확인.
- env 추가/변경 시: `.gitignore` 확인, 로컬/운영 분리 유지.
- DB 작업 전: 백업 후 진행, 파괴적 명령 금지.
- 커밋 시: `type(scope): subject` + 한글, 3줄 이상 상세.
- 데이터 검증: Zod. 날짜/시간: Luxon. 타입: any 지양, strict 유지.

---

## 9. Framework-Specific Patterns (Next.js / React Router v7 / React)

프로젝트 스택에 따라 **데이터 로딩·뮤테이션·라우팅·env·에러·폴더** 패턴을 아래 기준으로 적용한다. 프로젝트의 `00_DEVELOPMENT_PRINCIPLES.md`에 스택이 명시되어 있으면 그에 우선한다.

### 9.1. 패턴 요약 표

| 주제 | Next.js | React Router (v7) | React (SPA / Vite 등) |
|------|---------|-------------------|------------------------|
| **데이터 로딩** | App Router: Server Component 내 `async`·`fetch` 또는 `getServerSideProps`(Pages). 클라이언트: `use`·SWR/React Query. | `loader` + `useLoaderData`. 지연: `defer` + `Await`·`useAsyncValue`. | `useEffect` + fetch 또는 React Query/SWR. 서버 데이터는 API Route 또는 BFF 호출. |
| **뮤테이션/폼** | Server Actions 또는 API Route + `revalidatePath`/`revalidateTag`. | `action` + `useFetcher`/`useSubmit`·`useActionData`. | API 호출 후 상태 업데이트 또는 React Query mutation. |
| **라우팅** | `app/`(App Router) 또는 `pages/`(Pages) 파일 기반. `layout.tsx`·`page.tsx`. | `createBrowserRouter` + `Route` 또는 file-based(Remix 스타일). `route.tsx`·`layout.tsx`. | React Router v6 또는 단순 상태/경로 기반. Vite: 보통 React Router. |
| **Env 노출** | 클라이언트: `NEXT_PUBLIC_*` 만. 나머지는 서버(Server Component·API·getServerSideProps) 전용. | Vite: `import.meta.env.VITE_*` 만 클라이언트. 서버/loader·action 전용 변수는 빌드 시 주입·서버에서만 참조. | Vite: `import.meta.env.VITE_*`. CRA: `REACT_APP_*`. 시크릿은 클라이언트에 노출하지 않음. |
| **에러/경계** | App Router: `error.js`·`global-error.js`. Pages: `_error.tsx`. | `ErrorBoundary`·`errorElement` on Route. `route.tsx` 레벨 error boundary. | `ErrorBoundary` 컴포넌트로 감싸기. |
| **폴더/구조** | `app/`, `components/`, `lib/`, `public/`. Route = 폴더 경로. | `app/routes/`, `app/components/`, `app/root.tsx`. loaders/actions를 route 파일 또는 별도 모듈. | 프로젝트별: `src/components/`, `src/features/`, `src/lib/` 등. feature vs type 기반은 팀 규칙 따름. |

### 9.2. Next.js 요약

#### 9.2.0. 라우터 선택 (App Router vs Pages Router)

- **기본 원칙**: **신규 프로젝트 및 신규 페이지는 App Router(`app/`)를 사용한다.** Next.js 공식 방향은 App Router이며, RSC·Server Actions·레이아웃·스트리밍 등 신규 기능은 App Router 기준으로 제공된다. Pages Router(`pages/`)는 유지보수 모드이며 신규 기능은 제한적이다.
- **App Router를 쓰는 경우**: 새로 만드는 Next.js 프로젝트, 새로 추가하는 라우트·페이지. RSC·PPR·레이아웃·로딩/에러 파일 규칙을 쓰고 싶을 때.
- **Pages Router를 쓰는 경우**: 이미 `pages/` 기반으로 동작 중인 레거시 프로젝트를 유지할 때. 마이그레이션 비용이 크거나, 팀·의존성(라이브러리·문서)이 Pages에 맞춰져 있을 때만 Pages를 유지하고, 점진적 이전 시에도 새 기능은 `app/`에 두는 것을 권장.
- **혼용**: 같은 프로젝트에서 `app/`와 `pages/`를 함께 둘 수는 있으나, 라우트·데이터 패턴이 달라 유지보수 부담이 커진다. 가능하면 **한 프로젝트 내에서는 하나의 라우터만** 사용하고, 프로젝트의 `00_DEVELOPMENT_PRINCIPLES.md`에 "Next.js: App Router 사용" 또는 "Pages Router 유지"를 명시한다.

- **데이터**: 서버에서 쓸 수 있는 건 Server Component·getServerSideProps·API Route에서만. 클라이언트에 넘길 값은 직렬화 가능하게. `NEXT_PUBLIC_*`만 브라우저에 노출.
- **라우팅**: `app/` 사용 시 `layout`·`page`·`loading`·`error` 파일 규칙 준수. 동적 세그먼트 `[id]` 등.
- **폴더**: `app/` 하위가 URL 구조. 공통 UI는 `components/`, 유틸은 `lib/` 등으로 분리.

#### 9.2.1. Next.js Image (next/image) — 규칙 및 설정

- **규칙**
  - 이미지는 `next/image` 사용. 외부 URL은 `next.config.js`(또는 `next.config.mjs`)의 `images.remotePatterns`로만 허용. `domains`(deprecated) 사용 금지.
  - **안전한 remotePatterns**: 허용할 **도메인·protocol·path**를 명시. 신뢰할 수 있는 출처만 등록. 와일드카드(`**`)는 필요한 경로 범위만 사용하고, 호스트를 `*`로 열지 않음.
  - **도메인 관리**: 외부 이미지는 가능한 한 **동일 CDN·원본 도메인 1~2개**로 통일. `remotePatterns` 항목을 최소화해 감사·유지보수하기 쉽게 유지.

- **설정 (next.config)**
  - **formats**: `['image/avif', 'image/webp']`(및 기본 포맷) 포함 권장. 구형 브라우저 지원이 필요하면 프로젝트별로 조정.
  - **deviceSizes**: 디자인 시스템 breakpoint와 맞추면 불필요한 크기 생성이 줄고 유지보수에 유리. 기본값으로 두어도 동작하나, 픽셀 단위가 팀 breakpoint와 다르면 조정.
  - **imageSizes**: 작은 아이콘·썸네일용. 필요 시만 변경.

- **배포 전 체크 (이미지 최적화)**
  - [ ] 외부 이미지 모두 `next/image`로 사용하는가?
  - [ ] `remotePatterns`에 등록된 도메인이 신뢰 출처뿐이며, 항목 수가 최소인가?
  - [ ] `formats`에 avif·webp가 포함되어 있는가? (또는 프로젝트 정책에 따른 명시적 선택인가?)
  - [ ] `deviceSizes`가 디자인 breakpoint와 맞거나, 기본값 사용 이유가 있는가?

#### 9.2.2. 렌더링 전략 (CSR, SSG, ISR, RSC, PPR) — 선택 기준

Next.js(App Router 기준)에서 페이지·컴포넌트별로 어떤 전략을 쓸지 결정할 때 아래 정의와 선택 기준을 따른다.

- **정의 요약**

| 전략 | 설명 | Next.js에서의 대응 |
|------|------|---------------------|
| **CSR** (Client-Side Rendering) | HTML은 최소이고, JS 로드 후 브라우저에서 렌더·데이터 fetch. | `'use client'` 컴포넌트 + 클라이언트에서 fetch. 또는 Pages의 `getInitialProps`(클라이언트 실행). |
| **SSG** (Static Site Generation) | 빌드 시점에 HTML 생성. 배포 후 재빌드 전까지 동일 응답. | App Router: 기본이 정적. `generateStaticParams`·정적 `fetch`(캐시). Pages: `getStaticProps`·`getStaticPaths`. |
| **ISR** (Incremental Static Regeneration) | SSG + 일정 주기 또는 온디맨드로 재생성. | `revalidate`(초 단위) 또는 `revalidatePath`/`revalidateTag`. `fetch(..., { next: { revalidate: n } })`. |
| **RSC** (React Server Components) | 컴포넌트가 서버에서 렌더되고, 직렬화된 결과만 클라이언트로 전달. | App Router 기본. `async` 컴포넌트·서버 전용 모듈. 클라이언트가 필요하면 `'use client'`로 경계. |
| **PPR** (Partial Prerendering) | 같은 페이지 내에서 정적 부분은 미리 렌더, 동적 구간은 스트리밍. | `experimental_ppr: true` + `<Suspense>` 경계. 정적 shell + 동적 hole. |

- **선택 기준**

| 상황 | 권장 전략 | 비고 |
|------|-----------|------|
| 정적·거의 안 바뀌는 콘텐츠(랜딩, 약관, 블로그 글) | SSG 또는 RSC(서버에서 한 번 렌더) | 빌드 타임 생성, TTFB·LCP 유리. |
| 주기적으로 갱신 필요(목록, 카탈로그) | ISR | `revalidate` 값은 트래픽·신선도 요구에 맞게. 너무 짧으면 SSG 이점 감소. |
| 사용자별·실시간·세션 의존 UI | CSR 또는 RSC + Client Component | 로그인 상태·폼·실시간 업데이트는 클라이언트 또는 서버에서 세션 확인 후 렌더. |
| 첫 화면은 빠르게, 나머지는 스트리밍 | PPR | 정적 shell로 LCP 확보, 동적 구간은 Suspense로 점진적 표시. |
| 서버에서만 접근 가능한 데이터(DB·API 키) | RSC(Server Component) | 클라이언트로 fetch 로직을 내리지 말고, 서버 컴포넌트에서 직접 호출. |

- **주의·금지**

  - 서버에서 가져올 수 있는 데이터를 **굳이 클라이언트에서만** fetch 하지 않는다. SEO·TTFB·보안상 서버에서 처리 가능하면 RSC·loader·getServerSideProps 등으로 처리.
  - **RSC와 CSR 경계**를 명확히 한다. `'use client'`는 인터랙션·브라우저 API·클라이언트 전용 라이브러리가 필요한 컴포넌트에만. 나머지는 Server Component로 두어 번들·워터폴 감소.
  - **ISR revalidate**는 "몇 초마다 재검증"이므로, 트래픽이 높으면 부하를 고려해 설정. "실시간에 가까운" 요구가 있으면 SSR(동적) 또는 클라이언트 폴링/WebSocket 검토.
  - PPR 사용 시 동적 구간은 **Suspense 경계**로 감싸서 스켈레톤·fallback을 두면 UX가 좋다.

#### 9.2.3. 코드 스플리팅 (Code Splitting)

초기 로드에 필요 없는 코드는 **라우트·화면·무거운 컴포넌트 단위**로 분리해 지연 로드한다. 첫 화면·LCP에 필요한 것은 메인 번들에 두고, 그 외는 청크로 나눠 필요 시점에 로드한다.

- **공통 원칙**
  - **라우트 단위** 스플리팅은 기본으로 적용. 각 라우트(페이지)를 별도 청크로 두어 해당 경로 진입 시에만 로드.
  - **무거운 컴포넌트**(차트, 에디터, 모달 전용 UI 등)는 해당 화면·라우트에서만 쓰이면 `dynamic`/`lazy`로 분리. 여러 곳에서 쓰이는 공통 컴포넌트는 과도하게 쪼개지 않는다.
  - SEO·첫 화면에 중요한 구간은 지연 로드하지 않는다. 아래쪽 섹션·탭 전환·모달·경로 이동 후 화면에 적용.

- **프레임워크별**

| 스택 | 방식 | 비고 |
|------|------|------|
| **Next.js** | `next/dynamic`으로 Client Component 지연 로드. `loading`·`ssr: false` 옵션. 페이지/레이아웃은 기본이 청크 분리되므로, 무거운 클라이언트 전용 컴포넌트만 `dynamic()` 으로 감싼다. | 라우트 단위는 App Router가 처리. 차트·에디터 등만 동적 import. |
| **React Router v7** | `React.lazy()` 로 라우트 컴포넌트(또는 route element) 지연 로드. `Suspense` 로 fallback. loader는 라우트 단위라 컴포넌트만 lazy 로 감싸면 청크 분리됨. | route 파일에서 `const Page = lazy(() => import('./Page'))` + `<Suspense>` 사용. |
| **React (Vite 등)** | `React.lazy()` + `Suspense`. `import()` 가 빌드 시 청크로 나뉘므로 라우트·무거운 컴포넌트에 적용. | `Routes` 의 `element` 에 lazy 컴포넌트 + Suspense. |

- **주의**
  - **과도한 분할**을 피한다. 청크가 너무 많으면 요청 수가 늘어나 레이턴시·캐시 효율이 나빠질 수 있음. 라우트·화면·명확히 무거운 단위 위주로.
  - 지연 로드되는 컴포넌트는 **Suspense fallback**(스켈레톤·로딩 UI)을 두어 레이아웃 시프트·빈 화면을 줄인다.

#### 9.2.4. 번들 분석 (Bundle Analyzer)

번들 구성·청크 크기·모듈 비중을 시각화해 **중복 포함·과대한 의존성·불필요한 포함**을 점검한다. 코드 스플리팅 적용 전후·대형 의존성 추가 후·배포 전에 활용한다.

- **역할**
  - 청크별 크기, 어떤 모듈이 어느 청크에 들어가는지 확인.
  - 트리쉐이킹·동적 import가 의도대로 동작하는지, 동일 라이브러리가 여러 청크에 중복 들어가지는지 검사.
  - 초기 로드·라우트 청크가 목표 크기 이내인지 판단.

- **사용 시점**
  - 프로젝트 초기 또는 번들 전략 도입 후 **베이스라인** 확보.
  - 대형 라이브러리 추가·코드 스플리팅 변경 후 **영향 확인**.
  - **배포 전** 또는 정기 점검(예: 월 1회) 시.

- **프레임워크별**

| 스택 | 도구 | 비고 |
|------|------|------|
| **Next.js** | `@next/bundle-analyzer` | `next.config` 에 조건부 적용. `ANALYZE=true` 등 env 로 분석 시에만 활성화. `next build` 시 브라우저에서 treemap 확인. |
| **Vite** | `rollup-plugin-visualizer` | `vite.config` 의 build 플러그인으로 추가. `npm run build` 후 `stats.html` 등 생성. 출력 파일은 `.gitignore` 에 추가. |
| **React (Webpack)** | `webpack-bundle-analyzer` 또는 `source-map-explorer` | `BundleAnalyzerPlugin` 또는 빌드 후 `source-map-explorer dist/**/*.js`. |

- **주의**
  - 분석 시 빌드 시간이 늘고 출력(HTML/JSON)이 커질 수 있으므로, **분석 전용 스크립트 또는 env** 로만 실행. 일상적인 `build` 에는 포함하지 않는다.
  - 생성된 리포트 파일(`stats.html`, `bundle-report.html` 등)은 **Git에 커밋하지 않고** `.gitignore` 에 등록한다.

#### 9.2.5. 캐싱 (Caching)

데이터·라우트·정적 자원의 **캐시 레이어**와 **무효화 시점**을 명확히 해, 불필요한 재요청을 줄이면서 오래된 데이터 노출을 방지한다.

- **캐시 레이어 구분**

| 레이어 | Next.js | React Router v7 | React (SPA / Vite) |
|--------|---------|-----------------|---------------------|
| **서버/데이터** | fetch cache, Data Cache, `revalidate`. Server Component·route handler 내 fetch. | loader 내 서버 호출. 요청 스코프·세션에 따라 캐시 정책은 백엔드·CDN 위주. | React Query·SWR 등으로 서버 상태 캐시. `staleTime`·`cacheTime`·재검증 전략 설정. |
| **라우팅/클라이언트** | Router Cache(클라이언트 측 라우트 세그먼트 캐시). `dynamic`·정적 구간에 따라 동작 상이. | 내비게이션 시 loader 재실행 여부. `shouldRevalidate` 등으로 제어. | 라우트 전환 시 쿼리 무효화·refetch 정책으로 제어. |
| **정적 자원** | `next/static`·이미지 최적화 캐시. CDN·HTTP cache. | 빌드 산출물·에셋은 CDN·캐시 헤더. | 빌드 산출물·에셋은 CDN·캐시 헤더. |

- **공통 원칙**
  - **캐시 키**: 리소스·사용자·쿼리별로 구분. 사용자별 데이터는 세션/유저 ID를 키에 포함해 다른 유저와 섞이지 않게 한다.
  - **무효화**: 데이터가 변경된 뒤·로그아웃 시 해당 스코프 캐시를 무효화한다. Next: `revalidatePath`·`revalidateTag`. React Query: `invalidateQueries`. SWR: `mutate`·재검증.
  - **TTL/신선도**: 거의 안 바뀌는 데이터는 길게, 자주 바뀌거나 실시간에 가까우면 짧게 또는 무효화 위주로 설정.

- **주의**
  - **개인화·실시간** 데이터는 과하게 캐시하지 않는다. 사용자별·실시간 UI는 짧은 TTL 또는 이벤트 후 무효화.
  - Next.js Router Cache는 `dynamic` 라우트·revalidate 동작이 버전별로 다를 수 있으므로, 필요 시 공식 문서(Client-side Router Cache)를 확인한다.
  - 캐시할 레이어(서버 fetch vs 클라이언트 라이브러리)를 스택에 맞춰 한 가지로 정하고, 중복 캐시로 인한 신선도 꼬임을 피한다.

- **캐시 관리: Revalidation · Memoization**
  - **Revalidation(재검증)**: 캐시된 데이터를 **언제 다시 가져올지** 제어한다. (1) **시간 기반**: Next `revalidate`(초), React Query `staleTime`·SWR 재검증 주기. (2) **이벤트 기반**: 데이터 변경·뮤테이션 후 해당 스코프 무효화. Next: `revalidatePath`·`revalidateTag`. React Query: `invalidateQueries`·`refetchQueries`. SWR: `mutate`·`revalidate`. (3) **온디맨드**: 사용자 액션(새로고침 버튼 등) 시 `refetch`·`revalidate`. 원칙: **데이터가 바뀌면 해당 스코프를 revalidate 하라.**
  - **Memoization**: **캐시와는 별개**로, 컴포넌트·함수·값의 **불필요한 재생성·리렌더**를 줄인다. `useMemo`(비용 큰 계산·값), `useCallback`(자식에 넘기는 콜백), `React.memo`(리렌더 비용이 큰 컴포넌트). **필요할 때만** 사용한다. 의존 배열이 자주 바뀌거나 가벼운 계산에 남용하면 메모리·복잡도만 늘어난다. 원칙: **캐시 관리(revalidation)와 구분하고, 비용이 드는 계산·리렌더가 측정된 경우에만 메모이제이션 적용.**

| 구분 | Revalidation | Memoization |
|------|--------------|-------------|
| **대상** | 서버/클라이언트 **데이터 캐시** | 컴포넌트 **렌더 결과·함수·파생 값** |
| **목적** | 캐시를 최신 상태로 갱신·무효화 | 재계산·리렌더 감소 |
| **도구 예** | revalidatePath, invalidateQueries, mutate | useMemo, useCallback, React.memo |

### 9.3. React Router (v7) 요약

- **데이터**: 페이지/레이아웃 진입 전에 `loader`에서 데이터 준비. `useLoaderData`로 소비. 폼·뮤테이션은 `action` + `useFetcher`/`useSubmit`. Waterfall 줄이려면 필요한 데이터를 해당 route loader에서 한 번에.
- **라우팅**: `createBrowserRouter` + `Route` 트리 또는 file-based. `root.tsx`에서 `Outlet`으로 자식 렌더. 에러는 `errorElement` 또는 ErrorBoundary.
- **폴더**: `app/routes/`에 route 파일. `root.tsx`·`route.tsx`·`layout` 구분. loader/action는 route 파일 내 export 또는 별도 모듈.

### 9.4. React (SPA / Vite 등) 요약

- **데이터**: 서버 데이터는 반드시 API(BFF·백엔드) 경유. 클라이언트에서 `useEffect` + fetch 또는 React Query·SWR로 캐시·재검증. env는 빌드 도구 규칙(Vite: `VITE_*`)만 클라이언트에 노출.
- **라우팅**: React Router v6 사용 시 `BrowserRouter`·`Routes`·`Route`. 라우트 단위 코드 스플리팅은 `lazy` + `Suspense`.
- **폴더**: `src/` 하위에 `components/`, `pages/` 또는 `features/`, `hooks/`, `lib/` 등. 프로젝트별 개발 원칙 문서 우선.
