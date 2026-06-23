---
name: verify-ui
description: UI 구현이 docs/02_UI_Screens의 화면 설계, HTML UI Preview, 사용자 동선, 데이터 흐름, 로딩·빈 상태·오류 상태와 일치하는지 검증합니다. React/TSX 화면 구현 후, UI-First Gate 확인 후, 또는 "UI 검증", "UX 확인", "화면이 문서와 맞는지 봐줘" 요청 시 사용합니다.
argument-hint: "[선택사항: 점검할 화면, 라우트, 컴포넌트 경로]"
---

# UI 구현 검증 스킬 (verify-ui)

구현된 화면이 HTML UI Preview와 UI-First Gate에서 합의한 화면 구조, 사용자 동선, 데이터 흐름, 상태별 UI를 실제로 반영하는지 검증한다.

---

## 실행 시점

- React/TSX 화면 또는 컴포넌트 구현 후
- `rules-workflow` Step 15 사용자 사용 흐름 확인 시
- HTML UI Preview와 실제 구현 결과의 일치 여부를 확인할 때
- `docs/02_UI_Screens/` 문서와 구현 결과의 일치 여부를 확인할 때
- PR 전 UI/UX 회귀 점검 시

---

## Step 0: 검증 범위 확정

인자가 있으면 해당 화면·라우트·컴포넌트에 집중한다. 없으면 변경된 UI 파일과 관련 문서를 먼저 찾는다.

```bash
git diff --name-only HEAD
find docs/02_UI_Screens -maxdepth 1 -type f -name '*.md' 2>/dev/null
find docs/02_UI_Screens/previews -maxdepth 1 -type f -name '*.html' 2>/dev/null
find . -path '*/src/*' \( -name '*.tsx' -o -name '*.jsx' \) 2>/dev/null
```

검증 전 `docs/02_UI_Screens/00_SCREEN_FLOW.md`, `01_UI_DESIGN.md`, 관련 `XX_PROTOTYPE_REVIEW.md`, `docs/02_UI_Screens/previews/*.html`, 백로그 항목의 `Related UI Docs`와 `Related HTML Preview`를 읽는다.

---

## Check 0: HTML UI Preview 기준 확인

- 주요 화면 또는 사용자 흐름에 대응되는 HTML Preview가 있는지 확인한다.
- UI 문서와 백로그가 HTML Preview를 상대 경로로 링크하는지 확인한다.
- 구현 결과가 HTML Preview와 의도 없이 크게 달라졌다면 문서 또는 구현 중 어느 쪽이 최신 기준인지 확인한다.
- 체크:
  - [ ] 관련 HTML Preview가 존재하는가?
  - [ ] HTML Preview가 UI 문서 또는 백로그에 링크되어 있는가?
  - [ ] 사용자 피드백과 보완 사항이 문서 또는 백로그에 반영되어 있는가?
  - [ ] 구현이 HTML Preview의 정보 위계, CTA, 주요 레이아웃을 유지하는가?

---

## Check 1: 화면 구조 일치

- 구현된 화면의 주요 영역, 정보 위계, CTA가 UI 문서와 일치하는지 확인한다.
- 화면에 필요한 헤더, 내비게이션, 주요 콘텐츠, 보조 액션, 피드백 영역이 빠지지 않았는지 점검한다.
- 체크:
  - [ ] 주요 화면과 컴포넌트가 문서의 화면 목록과 대응되는가?
  - [ ] CTA 문구와 위치가 사용자 흐름상 자연스러운가?
  - [ ] 문서에 없는 큰 UI 변경이 있다면 관련 문서가 업데이트되었는가?

---

## Check 2: 사용자 동선

- 진입, 다음 행동, 뒤로가기/취소, 완료, 이탈 경로가 구현되어 있는지 확인한다.
- 링크, 버튼, 폼 제출, 모달, 탭, 라우팅이 `00_SCREEN_FLOW.md`의 흐름과 맞는지 점검한다.
- 체크:
  - [ ] 핵심 사용자 여정이 끊기지 않는가?
  - [ ] 주요 CTA가 실제 라우트 또는 상태 변경과 연결되는가?
  - [ ] 실패 또는 취소 후 사용자가 회복할 경로가 있는가?

---

## Check 3: 데이터 흐름과 상태

- 화면별 입력 데이터, 표시 데이터, 저장/전송 데이터가 문서와 일치하는지 확인한다.
- mock data, API 응답, 폼 상태, 파생 상태가 화면 요구사항을 과소/과대 구현하지 않는지 점검한다.
- 체크:
  - [ ] 화면에서 필요한 데이터가 모두 표시되는가?
  - [ ] 입력값 검증과 제출 상태가 사용자에게 보이는가?
  - [ ] 문서상 필요 없는 민감 데이터나 내부 상태가 노출되지 않는가?

---

## Check 4: 상태별 UI

- 로딩, 빈 상태, 오류 상태, 권한 없음, 비활성 상태가 구현되어 있는지 확인한다.
- 상태별 문구가 사용자의 다음 행동을 안내하는지 점검한다.
- 체크:
  - [ ] Loading state가 존재하고 레이아웃을 크게 흔들지 않는가?
  - [ ] Empty state가 원인과 다음 행동을 설명하는가?
  - [ ] Error state에 재시도, 이동, 문의 등 회복 경로가 있는가?
  - [ ] Disabled state가 시각적으로만 아니라 실제 상호작용도 막는가?

---

## Check 5: 접근성과 반응형

- 키보드 탐색, label, aria 속성, focus 상태, 색 대비, 모바일 레이아웃을 확인한다.
- 체크:
  - [ ] 버튼과 입력 요소에 접근 가능한 이름이 있는가?
  - [ ] 폼 입력에 label 또는 aria-label이 있는가?
  - [ ] 모달/드롭다운/탭이 키보드로 조작 가능한가?
  - [ ] 모바일에서 텍스트, CTA, 주요 콘텐츠가 겹치거나 잘리지 않는가?

---

## 보고 형식

```
## UI 검증 결과

### PASS 항목
- (문제 없는 흐름과 화면 요약)

### 개선 필요 항목
| 위치 | 영역 | 내용 | 심각도 |
|------|------|------|:------:|
| src/app/page.tsx:42 | 상태별 UI | Empty state 미구현 | 중 |
| src/components/Form.tsx:18 | 접근성 | input label 누락 | 중 |

### 문서 동기화 필요
- 구현이 문서와 다르면 수정할 문서 또는 코드 위치를 명시한다.
- HTML Preview와 구현이 다르면 최신 기준이 무엇인지 명시하고 문서 또는 코드 수정 대상을 적는다.
```

심각도 기준: **높음** (핵심 동선 차단) / **중** (사용성 또는 문서 불일치) / **낮음** (개선 권장)

---

## Exceptions

1. **초기 스파이크 UI**: 명시적으로 탐색용 스파이크라고 표시된 코드는 낮은 심각도로 보고하되, PR 전에는 문서 동기화를 요구한다.
2. **관리자 내부 화면**: 공개 사용자 화면보다 시각 완성도 기준은 낮출 수 있으나, 상태별 UI와 접근성 기준은 유지한다.
3. **외부 임베드 UI**: 지도, 결제, 인증 위젯 등 외부 위젯 내부 UI는 제외하되, 로딩·오류·복귀 경로는 검증한다.

---

## 관련 스킬

- `docs-plan`: UI-First Gate와 UI 문서 작성 기준
- `rules-react`: React 화면 구현 기준
- `verify-docs`: UI 문서와 백로그 구조 검증
- `verify-code`: 코드 품질 검토
- `verify-performance`: 화면 성능 검증
