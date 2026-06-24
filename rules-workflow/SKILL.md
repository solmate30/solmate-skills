---
name: rules-workflow
description: Guides the full implementation lifecycle from planning through PR. Use when implementing a new feature, planning implementation, before committing or creating a PR, avoiding overengineering, or following the 18-step workflow. Requires product phase preflight, HTML UI Preview Gate, UI-First Gate, Backlog Context Lock, YAGNI/KISS/DRY minimal implementation checks, implementation quality checks, and deployment readiness.
---

# Implementation & Execution Workflow (18 Steps)

Follow this workflow for feature implementation and significant code changes. Complete each phase before advancing; use the checklists to avoid skipping steps.

---

## Step 0: Product Phase Preflight

기능 구현을 시작하기 전, 먼저 `rules-product` 기준으로 현재 프로젝트 Phase를 진단한다. Concept, UI, HTML UI Preview Gate, UI-First Gate, Pre-Code Technical Brief, YAGNI/KISS/DRY Gate 중 하나라도 누락되어 구현 판단이 불안정하면 코딩을 시작하지 않고 해당 문서·백로그·계획 보완을 제안한다.

- 체크: [ ] 현재 Phase를 진단했는가? [ ] HTML UI Preview Gate가 충족되었는가? [ ] UI-First Gate가 충족되었는가? [ ] 최소 기술 계약이 확인되었는가? [ ] YAGNI/KISS/DRY Gate가 확인되었는가?

진단 결과는 `rules-product`의 `Flow Status Block` 형식으로 먼저 보고한다. 구현 단계 중 사용자가 "지금 어디야?", "다음 뭐야?", "현재 단계가 뭐야?"라고 묻거나 Phase 1-6 경계에 도달하면 같은 형식을 다시 출력한다.

---

## Phase 1: Plan (Steps 1–4)

### Step 1. 계획 수립
- 요구사항·목적을 문서 또는 이슈 기준으로 정리한다.
- 백로그 항목이 있으면 `Related Concept Docs`, `Related UI Docs`, `Related Technical Docs`, `Related QA Docs`를 먼저 읽고 구현 입력값으로 요약한다.
- 코드 작성보다 먼저 HTML UI Preview Gate를 확인한다. `docs/02_UI_Screens/previews/`의 HTML Preview가 없거나 UI 문서에 링크되지 않았거나 사용자 확인 기록이 없으면 구현 계획을 보류하고 `docs-plan` 문서/HTML 보완을 제안한다.
- 그 다음 UI-First Gate를 확인한다. 화면 구조, 사용자 동선, 데이터 흐름, 로딩·빈 상태·오류 상태가 문서화되지 않았으면 구현 계획을 보류하고 `docs-plan` 또는 `docs-dev` 문서 보완을 제안한다.
- Pre-Code Technical Brief를 확인한다. 데이터 소스, 최소 필드, mutation, 상태 관리 방식, acceptance criteria가 불명확하면 구현 전에 사용자와 합의한다.
- YAGNI/KISS/DRY Gate를 확인한다. 현재 요구사항에 없는 미래용 기능·추상화는 제외하고, 기존 코드 -> 표준/네이티브 기능 -> 기존 의존성 -> 최소 새 코드 순서로 계획한다.
- 변경할 파일·추가할 컴포넌트·API·DB 영향 범위를 나열한다.
- 체크: [ ] 목적이 명확한가? [ ] 관련 문서를 읽었는가? [ ] HTML UI Preview를 확인했는가? [ ] UI-First Gate가 확인되었는가? [ ] 최소 기술 계약이 확인되었는가? [ ] YAGNI/KISS/DRY Gate가 확인되었는가? [ ] 영향 범위가 정리되었는가?

### Step 2. 계획 검토
- 계획이 요구사항과 일치하는지, 누락된 시나리오는 없는지 검토한다.
- 체크: [ ] 요구사항 커버리지 [ ] 예외/엣지 케이스 고려 여부

### Step 3. 검토 정합성 확인
- Step 2 검토 결과를 한 번 더 점검한다. "검토가 올바르게 되었는가?"를 질문으로 확인한다.
- 체크: [ ] 검토 기준이 일관되었는가? [ ] 반대 관점(예: 제거/롤백)도 고려했는가?

### Step 4. 계획 과도성 및 최소 구현 검토
- 범위가 과도하게 크지 않은지 확인한다. 필요하면 단계로 나누거나 MVP로 줄인다.
- "안 만들어도 되는가?", "기존 코드로 되는가?", "표준/네이티브 기능으로 되는가?", "기존 의존성으로 되는가?", "최소 코드로 끝나는가?"를 순서대로 확인한다.
- 체크: [ ] 한 번에 할 양이 적정한가? [ ] 나누어 진행할 수 있는가? [ ] 미래용 기능·추상화를 제거했는가? [ ] 새 의존성 없이 가능한가?

---

## Phase 2: Implement (Step 5)

### Step 5. 구현
- 승인된 계획대로 구현한다. AGENTS.md·프로젝트 컨벤션(커밋, Zod, Luxon 등)을 따른다.
- 코드 작성 전 백로그 항목의 `Implementation Preconditions`와 `Acceptance Criteria`를 확인한다. 관련 문서 링크가 비어 있거나 `N/A - 사유`가 부실하면 구현을 보류하고 문서 보완 필요 여부를 사용자에게 확인한다.
- HTML UI Preview Gate가 통과되지 않았거나 사용자가 HTML Preview를 확인하지 않았다면 구현을 시작하지 않는다.
- UI-First Gate가 통과되지 않았거나 사용자가 화면/UI를 먼저 확인하지 않았다면 구현을 시작하지 않는다.
- YAGNI/KISS/DRY Gate가 통과되지 않았다면 구현을 시작하지 않는다. 새 추상화·새 의존성·새 설정이 필요하면 현재 요구사항 근거를 먼저 설명한다.
- 구현을 시작하기 직전에 `Flow Status Block`을 출력하고, 현재 위치가 `Phase 3 — React 변환` 또는 해당 기능 구현 단계인지 명시한다.
- 체크: [ ] 계획 대비 변경 사항이 일치하는가? [ ] 백로그의 관련 문서 기준을 반영했는가? [ ] HTML Preview 확인 후 구현했는가? [ ] 화면·동선·데이터 흐름 확인 후 구현했는가? [ ] 최소 구현 원칙을 지켰는가?

---

## Phase 3: Verify Implementation (Steps 6–10)

### Step 6. 목적 부합 검토
- 구현이 원래 목적과 요구사항에 맞게 동작하는지 확인한다.
- 체크: [ ] 핵심 시나리오 동작 [ ] 요구사항 미충족 구간 없음

### Step 7. 버그·크리티컬·보안 검토
- 잠재적 버그, 크리티컬 이슈, 보안 문제(권한, 입력 검증, 시크릿 노출 등)를 검토한다.
- 체크: [ ] 에러/엣지 케이스 처리 [ ] 보안·권한 로직 [ ] 민감 데이터 처리

### Step 8. 개선 사항 검토
- 개선한 부분(리팩터, 성능, UX)이 새 버그나 회귀를 만들지 않았는지 확인한다.
- 체크: [ ] 개선으로 인한 부작용 없음 [ ] 기존 동작 유지

### Step 9. 과대 함수·파일 분할
- 매우 큰 함수나 파일이 있으면 단일 책임·가독성 기준으로 적절한 크기로 나눈다.
- 체크: [ ] 한 파일/함수가 과도하게 길지 않은가? [ ] 분할 시 재사용·테스트 용이성

### Step 10. 기존 코드 통합·재사용 검토
- 새로 작성한 부분과 기존 코드의 통합 지점을 확인한다. 재사용 가능한 컴포넌트·유틸이 있으면 활용했는지 검토한다.
- 중복 제거는 같은 지식·같은 변경 이유를 가진 코드에만 적용한다. 모양만 비슷한 코드를 무리하게 추상화하지 않는다.
- 체크: [ ] 중복 구현 없음 [ ] 기존 패턴·API와 정합성 [ ] premature abstraction 없음

---

## Phase 4: Side Effects & Cleanup (Steps 11–14)

### Step 11. 사이드 이펙트 확인
- 변경이 다른 기능·라우트·API·공유 상태에 영향을 주지 않는지 확인한다. 조건문/가드로 격리했는지 점검한다.
- 체크: [ ] 영향 범위 파악됨 [ ] 의도치 않은 동작 없음

### Step 12. 전체 변경 사항 재검토
- diff·변경 파일 목록을 기준으로 전체를 한 번 더 훑는다. 누락·과도한 변경이 없는지 확인한다.
- 체크: [ ] 변경 집합이 목적과 일치 [ ] 불필요한 파일/코드 포함 여부 [ ] 미래용 코드·설정 없음

### Step 13. 불필요 코드 정리
- 구현 과정에서 불필요해진 코드(주석, 디버그 로그, 사용하지 않는 import/변수)를 제거한다.
- 체크: [ ] console.log 등 제거 [ ] dead code 제거 [ ] 주석 정리

### Step 14. 코드 품질 검토
- 가독성, 네이밍, 타입 사용(any 지양), 에러 처리, 테스트 필요 여부를 검토한다.
- 체크: [ ] 타입·Zod 등 프로젝트 규칙 준수 [ ] 품질이 충분한가?

---

## Phase 5: User Flow & Final Gate (Steps 15–17)

### Step 15. 사용자 사용 흐름 확인
- 실제 사용 시나리오(진입 경로, 폼 제출, 에러 시 화면 등)에서 문제가 없는지 확인한다.
- 체크: [ ] 주요 시나리오 E2E 관점 [ ] Empty state·에러 시 UX

### Step 16. 관련 부분 반복 검토
- 검토 중 발견된 이슈와 연관된 코드·설정·문서를 다시 점검한다. 관련된 부분을 놓치지 않도록 추가로 확인한다.
- 백로그 항목의 `Document Sync Check`를 기준으로 구현 결과와 관련 문서의 불일치 여부를 확인한다.
- 체크: [ ] 발견 이슈의 연쇄 영향 [ ] 관련 모듈·설정까지 검토 [ ] 문서-구현 불일치 없음

### Step 17. 배포 가능 퀄리티 최종 검토
- "이대로 배포해도 될 수준인가?"를 한 번 더 검토한다. 1–16단계에서 누락된 항목이 없는지 확인한다.
- 최종 검토 시 `Flow Status Block`을 출력하고, 다음 위치가 `Phase 6 — Ship/Handoff`인지 명시한다.
- 체크: [ ] 배포 전 필수 조건 충족 [ ] 롤백·모니터링 고려 여부

---

## Phase 6: Ship (Step 18)

### Step 18. 커밋 및 PR 작성
- 프로젝트 커밋 컨벤션(`type(scope): subject`, 한글, 상세 3줄 이상)에 맞춰 커밋한다.
- PR에는 변경 목적, 영향 범위, 테스트/검증 방법을 요약해 적는다.
- 체크: [ ] 커밋 메시지 규칙 준수 [ ] PR 설명으로 리뷰어가 맥락 파악 가능

---

## Quick Checklist (Summary)

| # | 단계 | 완료 |
|---|------|:----:|
| 1 | 계획 수립 | [ ] |
| 2 | 계획 검토 | [ ] |
| 3 | 검토 정합성 확인 | [ ] |
| 4 | 계획 과도성 및 최소 구현 검토 | [ ] |
| 5 | 구현 | [ ] |
| 6 | 목적 부합 검토 | [ ] |
| 7 | 버그·크리티컬·보안 검토 | [ ] |
| 8 | 개선 사항 검토 | [ ] |
| 9 | 과대 함수·파일 분할 | [ ] |
| 10 | 기존 코드 통합·재사용 검토 | [ ] |
| 11 | 사이드 이펙트 확인 | [ ] |
| 12 | 전체 변경 사항 재검토 | [ ] |
| 13 | 불필요 코드 정리 | [ ] |
| 14 | 코드 품질 검토 | [ ] |
| 15 | 사용자 사용 흐름 확인 | [ ] |
| 16 | 관련 부분 반복 검토 | [ ] |
| 17 | 배포 가능 퀄리티 최종 검토 | [ ] |
| 18 | 커밋 및 PR 작성 | [ ] |
