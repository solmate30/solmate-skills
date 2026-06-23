---
name: verify-docs
description: 프로젝트 문서가 5단계 구조(01~05), 메타데이터, Related Documents, Backlog Context Lock, HTML UI Preview Gate, UI-First Gate를 준수하는지 검증합니다. 문서 생성/수정 후, PR 전 사용.
---

# 문서 구조 검증

## 목적

프로젝트 문서가 아래 표준을 모두 준수하는지 확인한다:
1. 5-Layer 폴더 구조 및 파일 네이밍
2. 메타데이터 표준 (Created / Last Updated)
3. Related Documents 섹션
4. Backlog Context Lock
5. HTML UI Preview Gate
6. UI-First Gate
7. Pre-Code Technical Brief
8. Rubric-First Writing
9. rules-product Gate Out 조건

## 실행 시점

- 새 문서 생성 또는 수정 후
- PR 전 문서 정합성 점검 시
- /verify-implementation 실행 시

---

## Workflow

### Step 0: 기준 문서 파악

AGENTS.md 또는 `docs/01_Concept_Design/00_COLLABORATION_GUIDE.md`를 읽어 현재 프로젝트의 문서 규칙을 파악한다.

### Step 1: 폴더·파일 네이밍 검사

`docs/` 하위를 탐색한다.

체크 항목:
- [ ] 폴더명이 `01_Concept_Design` ~ `05_QA_Validation` 구조를 따르는가?
- [ ] 파일명 앞에 2자리 순번이 있는가? (예: `01_VISION_CORE.md`)
- [ ] 파일명이 대문자 스네이크 케이스인가? (예: `01_DB_SCHEMA.md`)

### Step 2: 메타데이터 검사

모든 `.md` 파일 상단을 확인한다.

체크 항목:
- [ ] `Created: YYYY-MM-DD HH:mm` 존재 여부
- [ ] `Last Updated: YYYY-MM-DD HH:mm` 존재 여부

### Step 3: Related Documents 섹션 검사

체크 항목:
- [ ] 문서 하단에 `## X. Related Documents` 섹션이 있는가?
- [ ] 모든 링크가 상대 경로인가? (절대 경로 금지)
- [ ] 각 링크에 관계 설명이 포함되어 있는가?
- [ ] 상위 또는 하위 레이어 문서가 최소 1개 이상 연결되어 있는가?

### Step 4: Backlog Context Lock 검사

`docs/04_Logic_Progress/00_BACKLOG.md`가 있으면 각 작업 항목을 확인한다.

체크 항목:
- [ ] 모든 Backlog 작업 항목이 체크박스`[ ]` 또는 `[x]`로 시작하는가?
- [ ] 각 작업 항목에 `Related Concept Docs`가 있는가?
- [ ] 각 작업 항목에 `Related UI Docs`가 있는가?
- [ ] 각 작업 항목에 `Related HTML Preview`가 있는가?
- [ ] 각 작업 항목에 `Related Technical Docs`가 있는가?
- [ ] 각 작업 항목에 `Related QA Docs`가 있는가?
- [ ] 각 작업 항목에 `Implementation Preconditions`가 있는가?
- [ ] 각 작업 항목에 `Acceptance Criteria`가 있는가?
- [ ] 각 작업 항목에 `Document Sync Check`가 있는가?
- [ ] Related 필드의 링크가 상대 경로이거나 `N/A - 사유` 형식인가?
- [ ] `N/A`만 있고 사유가 없는 항목은 없는가?
- [ ] `Related HTML Preview`가 상대 경로 링크 또는 `N/A - 사유` 형식인가?
- [ ] `Implementation Preconditions`에 HTML Preview 사용자 확인 및 피드백 기록이 포함되어 있는가?
- [ ] `Implementation Preconditions`에 화면/UI 선확인, 사용자 동선 확인, 데이터 흐름 확인, 로딩·빈 상태·오류 상태 확인이 포함되어 있는가?
- [ ] `Implementation Preconditions` 또는 `Acceptance Criteria`에 데이터 소스, 최소 필드, mutation, 상태 관리 방식, 검증 가능한 acceptance criteria가 포함되어 있는가?

위 항목 중 하나라도 누락되면 Backlog Context Lock은 Fail로 처리한다.

### Step 5: HTML UI Preview Gate 검사

`docs/02_UI_Screens/`와 `docs/02_UI_Screens/previews/`를 함께 확인한다.

체크 항목:
- [ ] `docs/02_UI_Screens/previews/` 폴더가 있는가?
- [ ] 주요 화면 또는 사용자 흐름에 대응되는 `.html` 파일이 있는가?
- [ ] HTML 파일명이 2자리 순번과 목적을 포함하는가? (예: `01_main_flow_preview.html`)
- [ ] `00_SCREEN_FLOW.md`, `01_UI_DESIGN.md`, 관련 `XX_PROTOTYPE_REVIEW.md` 중 하나 이상이 HTML Preview를 상대 경로로 링크하는가?
- [ ] UI 문서나 백로그에 HTML Preview 사용자 확인 및 피드백 기록이 있는가?

HTML Preview가 없거나 링크·사용자 확인 기록이 누락되면 HTML UI Preview Gate는 Fail로 처리한다.

### Step 6: UI-First Gate 검사

`docs/02_UI_Screens/`와 `docs/04_Logic_Progress/00_BACKLOG.md`를 함께 확인한다.

체크 항목:
- [ ] HTML UI Preview Gate를 통과했는가?
- [ ] `00_SCREEN_FLOW.md`에 주요 화면, 진입·전환·이탈 동선이 있는가?
- [ ] `00_SCREEN_FLOW.md` 또는 관련 UI 문서에 화면별 입력·출력 데이터가 있는가?
- [ ] `01_UI_DESIGN.md` 또는 `XX_PROTOTYPE_REVIEW.md`에 로딩·빈 상태·오류 상태가 있는가?
- [ ] `XX_PROTOTYPE_REVIEW.md` 또는 백로그에 사용자의 화면/UI 선확인 기록이 있는가?
- [ ] 코드 구현 백로그가 UI 확인 없이 `In Progress` 또는 `Done`으로 이동하지 않았는가?

구현 판단에 필요한 화면·동선·데이터 흐름이 누락되면 UI-First Gate는 Fail로 처리한다.

### Step 7: Pre-Code Technical Brief 검사

`docs/03_Technical_Specs/`와 `docs/04_Logic_Progress/00_BACKLOG.md`를 함께 확인한다.

체크 항목:
- [ ] 구현 대상 화면의 데이터 소스가 정리되어 있는가?
- [ ] 화면별 최소 필드와 mock data 또는 API 계약이 있는가?
- [ ] mutation과 상태 관리 방식이 기록되어 있는가?
- [ ] acceptance criteria가 사용자 시나리오 기준으로 검증 가능한가?

데이터·API·상태 계약이 없어 구현자가 임의 구조를 만들 수밖에 없으면 Pre-Code Technical Brief는 Fail로 처리한다.

### Step 8: Rubric-First Writing 검사

| 레이어 | 기준 |
|:---|:---|
| QA_Validation (Layer 5) | 6개 루브릭 전체 테이블 포함 (필수) |
| Logic_Progress (Layer 4) | 실무 문서(BACKLOG, ROADMAP, EXECUTION_PLAN) 내 체크박스`[ ]` 활용 및 원자적 단위 분할, Backlog Context Lock 준수 (필수) |
| Concept_Design (Layer 1) | Novelty, Business Plan, Potential Impact 언급 (권장) |
| Technical_Specs (Layer 3) | Functionality, UX (latency), Open-source 언급 (권장) |
| Logic_Progress (Layer 4) | Functionality, UX 언급 (권장) |

### Step 9: Gate Out 조건 검사

rules-product 기준으로 각 Phase의 필수 문서 존재 여부를 확인한다.

**Phase 1 (기획문서)**:
- [ ] `docs/01_Concept_Design/01_VISION_CORE.md`
- [ ] `docs/01_Concept_Design/02_LEAN_CANVAS.md`
- [ ] `docs/01_Concept_Design/03_PRODUCT_SPECS.md`

**Phase 2 (UI 설계)**:
- [ ] `docs/02_UI_Screens/00_SCREEN_FLOW.md`
- [ ] `docs/02_UI_Screens/01_UI_DESIGN.md`
- [ ] `docs/02_UI_Screens/previews/` 내 관련 HTML Preview
- [ ] UI 문서에서 HTML Preview 상대 경로 링크
- [ ] 화면·동선·데이터 흐름·상태별 UI 확인 기록
- [ ] Pre-Code Technical Brief 기록

**Phase 5 (개발문서)**:
- [ ] `docs/03_Technical_Specs/00_DEVELOPMENT_PRINCIPLES.md`
- [ ] `docs/04_Logic_Progress/00_ROADMAP.md`
- [ ] `docs/05_QA_Validation/02_QA_CHECKLIST.md`

### Step 10: 검증 보고서 출력

검사 완료 후 아래 형식으로 결과를 출력한다:

```
## 검증 결과 — [프로젝트명] / [날짜]

| 검사 항목 | 결과 | 비고 |
|:---|:---:|:---|
| 폴더 네이밍 | Pass / Fail | |
| 파일 네이밍 | Pass / Fail | 위반 파일 목록 |
| 메타데이터 | Pass / Fail | 누락 파일 목록 |
| Related Documents | Pass / Fail | 미연결 파일 목록 |
| Backlog Context Lock | Pass / Fail | 필수 필드 누락 작업 목록 |
| HTML UI Preview Gate | Pass / Fail | HTML Preview 파일·링크·확인 기록 누락 목록 |
| UI-First Gate | Pass / Fail | 화면·동선·데이터 흐름 누락 목록 |
| Pre-Code Technical Brief | Pass / Fail | 데이터·API·상태 계약 누락 목록 |
| Rubric-First | Pass / Fail | |
| Gate Out 조건 | Pass / Fail | 미충족 파일 목록 |

### 수정 필요 항목
[구체적 수정 대상과 방법 목록]
```

---

## Exceptions

1. `docs/00_ARCHIVE/`: 아카이브 폴더는 형식 검사를 완화한다.
2. `README.md`, `LICENSE` 등 루트 표준 파일은 제외한다.
3. `DESIGN.md`, `AGENTS.md`, `CLAUDE.md`: 검사 제외.
