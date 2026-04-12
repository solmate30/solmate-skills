---
name: verify-performance
description: 브라우저 성능 및 Core Web Vitals를 점검합니다. Lighthouse 기준, LCP·CLS·FID, 번들 크기, 이미지 최적화, 렌더링 전략, 불필요한 클라이언트 코드를 체계적으로 검증합니다. 배포 전 성능 점검, "Lighthouse 확인", "성능 최적화 확인" 요청 시 사용합니다.
argument-hint: "[선택사항: 점검할 페이지 경로 또는 집중 영역 (예: 홈, 이미지, 번들)]"
---

# 성능 점검 스킬 (verify-performance)

Lighthouse 및 Core Web Vitals 기준으로 프론트엔드 성능을 검증합니다. 코드 분석 단계와 실측 점검 단계로 나누어 진행하고 발견된 이슈를 우선순위와 함께 보고합니다.

---

## 실행 시점

- 배포 전 성능 최종 점검
- 새 페이지·이미지·폰트·대형 컴포넌트 추가 후
- "Lighthouse 점수가 낮다", "페이지가 느리다" 보고 시
- `rules-workflow` Step 17 (배포 가능 퀄리티 최종 검토) 수행 시

---

## 목표 기준 (Lighthouse Performance Score)

| 지표 | 목표 | 경고 |
|------|:----:|:----:|
| Performance Score | 90+ | 70 미만 시 차단 |
| LCP (Largest Contentful Paint) | ≤ 2.5s | > 4.0s 위험 |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | > 0.25 위험 |
| FID / INP (Interaction to Next Paint) | ≤ 200ms | > 500ms 위험 |
| FCP (First Contentful Paint) | ≤ 1.8s | > 3.0s 위험 |
| TTFB (Time to First Byte) | ≤ 800ms | > 1.8s 위험 |

---

## Step 0: 점검 범위 확정

인자가 주어진 경우 해당 페이지/영역에 집중한다. 없으면 아래 기준으로 성능에 민감한 파일을 우선 탐색한다.

```bash
# 이미지 사용 현황
grep -rn "<img\|Image from\|next/image" src/ --include="*.tsx" --include="*.jsx" -l

# 동적 import 미적용 대형 컴포넌트 탐색
grep -rn "^import.*from" src/ --include="*.tsx" | grep -v "dynamic\|lazy" | head -40

# 클라이언트 컴포넌트 현황
grep -rn "'use client'" src/ --include="*.tsx" -l
```

---

## Check 1: 이미지 최적화

**LCP·CLS·네트워크 비용에 가장 큰 영향**

- `<img>` 태그 직접 사용 대신 `next/image` (또는 프레임워크 이미지 컴포넌트)를 사용하는지 확인한다.
- `next/image` 사용 시 `width`, `height` 또는 `fill` 속성이 지정되어 CLS가 방지되는지 점검한다.
- LCP 대상 이미지(히어로 이미지 등)에 `priority` 속성이 적용되어 있는지 확인한다.
- 외부 이미지 도메인이 `next.config.js`의 `images.domains` 또는 `remotePatterns`에 등록되어 있는지 확인한다.

```bash
grep -rn "<img " src/ --include="*.tsx" --include="*.jsx"
grep -rn "next/image" src/ --include="*.tsx" -l
grep -rn "priority" src/ --include="*.tsx"
```

- 체크:
  - [ ] `<img>` 직접 사용 없이 최적화 컴포넌트를 사용하는가?
  - [ ] 이미지에 `width`/`height` 또는 `fill`이 지정되어 있는가?
  - [ ] LCP 대상 이미지에 `priority`가 적용되어 있는가?

---

## Check 2: 렌더링 전략

**TTFB·LCP·SEO에 영향**

- 정적 콘텐츠(랜딩, 블로그, 약관)에 SSG 또는 RSC가 적용되어 있는지 확인한다.
- 인증이 필요한 페이지가 아님에도 전체 페이지를 `'use client'`로 선언했는지 점검한다.
- `useEffect`로 초기 데이터를 fetch하는 경우 서버 컴포넌트 또는 loader로 대체 가능한지 검토한다.
- PPR(Partial Prerendering)이 적용 가능한 페이지가 있는지 확인한다 (정적 shell + 동적 Suspense).

```bash
# 전체 페이지 단위 'use client' 확인
grep -rn "'use client'" src/app/ --include="*.tsx"

# useEffect 데이터 fetch 패턴
grep -rn "useEffect.*fetch\|useEffect.*axios\|useEffect.*api" src/ --include="*.tsx" -l
```

- 체크:
  - [ ] 정적 콘텐츠에 SSG/RSC가 적용되어 있는가?
  - [ ] 불필요하게 전체 페이지가 클라이언트 컴포넌트로 선언되지 않았는가?
  - [ ] 초기 데이터 fetch를 서버에서 처리하는가?

---

## Check 3: 번들 크기

**FCP·TTI(Time to Interactive)에 영향**

- 빌드 출력에서 페이지별 번들 크기를 확인한다. 단일 페이지 JS가 250kB(gzip)를 초과하면 분할을 검토한다.
- 초기 로드에 불필요한 대형 라이브러리(차트, 에디터, 날짜 피커 등)가 동적 import 없이 포함되었는지 확인한다.
- `barrel export`(`index.ts`에서 전체 재내보내기) 사용 시 tree-shaking이 방해되는지 점검한다.

```bash
# 빌드 실행 및 번들 크기 확인
npm run build 2>&1 | grep -E "Page|Size|First Load"

# 대형 의존성 탐지
grep -rn "^import.*from 'recharts\|chart.js\|@tiptap\|react-quill\|moment\|lodash'" src/ --include="*.tsx" --include="*.ts" | grep -v "dynamic"
```

- 체크:
  - [ ] 단일 페이지 First Load JS가 250kB 이하인가?
  - [ ] 대형 라이브러리에 동적 import(`next/dynamic`, `React.lazy`)가 적용되었는가?
  - [ ] 사용하지 않는 패키지가 포함되지 않았는가?

---

## Check 4: 폰트 최적화

**CLS·FCP에 영향**

- `next/font` 또는 `@font-face`의 `font-display: swap`이 적용되어 있는지 확인한다.
- Google Fonts를 `<link>` 태그로 직접 로드하는 경우 `next/font/google`로 대체를 권장한다.
- 폰트 파일이 self-hosted인 경우 `preload` 힌트가 적용되어 있는지 확인한다.

```bash
grep -rn "fonts.googleapis\|fonts.gstatic" src/ --include="*.tsx" --include="*.html"
grep -rn "next/font" src/ --include="*.tsx" -l
```

- 체크:
  - [ ] Google Fonts를 `next/font/google`로 로드하는가?
  - [ ] `font-display: swap`이 적용되어 레이아웃 시프트가 방지되는가?

---

## Check 5: 불필요한 리렌더링

**INP·런타임 성능에 영향**

- 부모 컴포넌트 상태 변경 시 자식이 불필요하게 리렌더링되는지 확인한다. `React.memo`, `useMemo`, `useCallback` 적용이 필요한 곳을 점검한다.
- 리스트 렌더링에 `key` prop이 올바르게 사용되는지 확인한다 (index 사용 지양).
- 전역 상태(Context, Zustand 등)가 너무 넓은 범위에서 구독되어 불필요한 리렌더링을 유발하는지 점검한다.

```bash
grep -rn "key={index}\|key={i}" src/ --include="*.tsx"
grep -rn "React\.memo\|useMemo\|useCallback" src/ --include="*.tsx" -l
```

- 체크:
  - [ ] 리스트 `key`에 index 대신 고유 ID를 사용하는가?
  - [ ] 무거운 연산에 `useMemo`/`useCallback`이 적용되었는가?
  - [ ] Context가 필요한 범위에만 적용되어 있는가?

---

## Check 6: Lighthouse 실측 점검

코드 분석만으로는 실제 점수를 확인할 수 없다. 아래 방법으로 실측을 안내한다.

**브라우저 직접 측정 (권장):**
1. Chrome DevTools → Lighthouse 탭 → "Performance" 선택 → "Analyze page load" 실행
2. Incognito 모드에서 실행 (확장 프로그램 영향 제거)
3. Mobile / Desktop 각각 측정

**CLI 측정:**
```bash
# Lighthouse CLI 설치 및 실행
npx lighthouse http://localhost:3000 --view --output=html
```

**측정 결과 기록 위치:** `docs/05_QA_Validation/` 에 `PERFORMANCE_REPORT.md` 로 저장한다.

---

## 보고 형식

```
## 성능 점검 결과

### Lighthouse 목표 대비 현황
| 지표 | 목표 | 현재 | 상태 |
|------|:----:|:----:|:----:|
| Performance Score | 90+ | - | 실측 필요 |
| LCP | ≤ 2.5s | - | 실측 필요 |
| CLS | ≤ 0.1 | - | 실측 필요 |

### PASS 항목
- (문제 없는 체크 요약)

### 개선 필요 항목
| 위치 | 체크 영역 | 내용 | 예상 영향 |
|------|-----------|------|:---------:|
| src/pages/Home.tsx | 이미지 최적화 | <img> 직접 사용, LCP 지연 가능성 | LCP |
| src/app/layout.tsx | 폰트 최적화 | Google Fonts <link> 직접 로드 | CLS·FCP |

### 수정 권장 우선순위
1. [높음] ...
2. [중] ...
3. [낮음] ...
```

---

## Exceptions

1. **관리자 페이지**: 내부 사용자 전용 페이지는 Performance 70+ 기준을 적용한다.
2. **대형 에디터·지도 컴포넌트**: 라이브러리 특성상 번들이 큰 경우, `next/dynamic`으로 lazy load 처리 후 패스 처리한다.
3. **개발 환경 측정값**: Lighthouse는 반드시 `npm run build && npm start` 이후 프로덕션 빌드 기준으로 측정한다. 개발 서버(`npm run dev`) 측정값은 참고용으로만 사용한다.

---

## 관련 스킬

- `verify-code`: 코드 품질 전반 리뷰
- `verify-security`: 보안 취약점 점검
- `rules-dev`: 렌더링 전략·코드 스플리팅 컨벤션 기준
- `verify-implementation`: 전체 verify-* 통합 실행 시 포함 대상
