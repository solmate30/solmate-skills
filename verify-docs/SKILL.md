---
name: verify-docs
description: 프로젝트 문서가 5단계 구조(01~05)와 메타데이터 표준을 준수하는지 검증합니다. 문서 생성/수정 후, PR 전 사용.
---

# 문서 구조 검증

## 목적

프로젝트 문서가 아래 표준을 모두 준수하는지 확인한다:
1. 5-Layer 폴더 구조 및 파일 네이밍
2. 메타데이터 표준 (Created / Last Updated)
3. Related Documents 섹션
4. Rubric-First Writing
5. rules-product Gate Out 조건

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

### Step 4: Rubric-First Writing 검사

| 레이어 | 기준 |
|:---|:---|
| QA_Validation (Layer 5) | 6개 루브릭 전체 테이블 포함 (필수) |
| Logic_Progress (Layer 4) | 실무 문서(BACKLOG, ROADMAP, EXECUTION_PLAN) 내 체크박스`[ ]` 활용 및 원자적 단위 분할 (필수) |
| Concept_Design (Layer 1) | Novelty, Business Plan, Potential Impact 언급 (권장) |
| Technical_Specs (Layer 3) | Functionality, UX (latency), Open-source 언급 (권장) |
| Logic_Progress (Layer 4) | Functionality, UX 언급 (권장) |

### Step 5: Gate Out 조건 검사

rules-product 기준으로 각 Phase의 필수 문서 존재 여부를 확인한다.

**Phase 1 (기획문서)**:
- [ ] `docs/01_Concept_Design/01_VISION_CORE.md`
- [ ] `docs/01_Concept_Design/02_LEAN_CANVAS.md`
- [ ] `docs/01_Concept_Design/03_PRODUCT_SPECS.md`

**Phase 2 (UI 설계)**:
- [ ] `docs/02_UI_Screens/00_SCREEN_FLOW.md`
- [ ] `docs/02_UI_Screens/01_UI_DESIGN.md`

**Phase 5 (개발문서)**:
- [ ] `docs/03_Technical_Specs/00_DEVELOPMENT_PRINCIPLES.md`
- [ ] `docs/04_Logic_Progress/00_ROADMAP.md`
- [ ] `docs/05_QA_Validation/02_QA_CHECKLIST.md`

### Step 6: 검증 보고서 출력

검사 완료 후 아래 형식으로 결과를 출력한다:

```
## 검증 결과 — [프로젝트명] / [날짜]

| 검사 항목 | 결과 | 비고 |
|:---|:---:|:---|
| 폴더 네이밍 | Pass / Fail | |
| 파일 네이밍 | Pass / Fail | 위반 파일 목록 |
| 메타데이터 | Pass / Fail | 누락 파일 목록 |
| Related Documents | Pass / Fail | 미연결 파일 목록 |
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
