---
name: implementation-workflow
description: Guides the full implementation lifecycle from planning through PR. Use when implementing a new feature, planning implementation, before committing or creating a PR, or when the user asks for plan review, implementation review, deployment readiness check, or to follow the 18-step workflow (18단계). Ensures plan validation, implementation quality, side-effect checks, and deployment-ready quality.
---

# Implementation Workflow (18 Steps)

Follow this workflow for feature implementation and significant code changes. Complete each phase before advancing; use the checklists to avoid skipping steps.

---

## Phase 1: Plan (Steps 1–4)

### Step 1. 계획 수립
- 요구사항·목적을 문서 또는 이슈 기준으로 정리한다.
- 변경할 파일·추가할 컴포넌트·API·DB 영향 범위를 나열한다.
- 체크: [ ] 목적이 명확한가? [ ] 영향 범위가 정리되었는가?

### Step 2. 계획 검토
- 계획이 요구사항과 일치하는지, 누락된 시나리오는 없는지 검토한다.
- 체크: [ ] 요구사항 커버리지 [ ] 예외/엣지 케이스 고려 여부

### Step 3. 검토 정합성 확인
- Step 2 검토 결과를 한 번 더 점검한다. "검토가 올바르게 되었는가?"를 질문으로 확인한다.
- 체크: [ ] 검토 기준이 일관되었는가? [ ] 반대 관점(예: 제거/롤백)도 고려했는가?

### Step 4. 계획 과도성 검토
- 범위가 과도하게 크지 않은지 확인한다. 필요하면 단계로 나누거나 MVP로 줄인다.
- 체크: [ ] 한 번에 할 양이 적정한가? [ ] 나누어 진행할 수 있는가?

---

## Phase 2: Implement (Step 5)

### Step 5. 구현
- 승인된 계획대로 구현한다. AGENTS.md·프로젝트 컨벤션(커밋, Zod, Luxon 등)을 따른다.
- 체크: [ ] 계획 대비 변경 사항이 일치하는가?

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
- 체크: [ ] 중복 구현 없음 [ ] 기존 패턴·API와 정합성

---

## Phase 4: Side Effects & Cleanup (Steps 11–14)

### Step 11. 사이드 이펙트 확인
- 변경이 다른 기능·라우트·API·공유 상태에 영향을 주지 않는지 확인한다. 조건문/가드로 격리했는지 점검한다.
- 체크: [ ] 영향 범위 파악됨 [ ] 의도치 않은 동작 없음

### Step 12. 전체 변경 사항 재검토
- diff·변경 파일 목록을 기준으로 전체를 한 번 더 훑는다. 누락·과도한 변경이 없는지 확인한다.
- 체크: [ ] 변경 집합이 목적과 일치 [ ] 불필요한 파일/코드 포함 여부

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
- 체크: [ ] 발견 이슈의 연쇄 영향 [ ] 관련 모듈·설정까지 검토

### Step 17. 배포 가능 퀄리티 최종 검토
- "이대로 배포해도 될 수준인가?"를 한 번 더 검토한다. 1–16단계에서 누락된 항목이 없는지 확인한다.
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
| 4 | 계획 과도성 검토 | [ ] |
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
