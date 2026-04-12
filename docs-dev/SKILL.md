---
name: docs-dev
description: Create and manage development documents for Layer 3 (Technical_Specs), Layer 4 (Logic_Progress), and Layer 5 (QA_Validation). Use when writing DB schema docs, API specs, development principles, roadmaps, backlogs, business logic designs, or test scenarios. Always read existing files before editing. Include Related Documents sections.
---

# Development Documentation Skill

This skill manages **Layer 3 (Technical_Specs)**, **Layer 4 (Logic_Progress)**, and **Layer 5 (QA_Validation)** — the "How" of the project.

> Shared conventions (metadata format, naming rules, 365 Principle overview, link format) are defined in `rules-docs`.

## 1. Rules

1. 이모지 금지. 전문적이고 명확한 텍스트로만 소통한다.
2. Ask before Write: 초안 작성 전 핵심 질문을 던지고 답변을 바탕으로 작성한다.
3. 기존 문서가 있으면 반드시 먼저 읽고 컨텍스트와 스타일을 유지하며 업데이트한다. 덮어쓰지 않는다.

## 2. Layer 정의

| Layer | Directory | Purpose |
|:---|:---|:---|
| Technical_Specs | `docs/03_Technical_Specs/` | 기술 명세, DB 스키마, API 설계, 개발 원칙 |
| Logic_Progress | `docs/04_Logic_Progress/` | 로드맵, 백로그, 비즈니스 로직, 상태 관리, 알고리즘 |
| QA_Validation | `docs/05_QA_Validation/` | 테스트 시나리오, QA 체크리스트, 검증 보고서 |

**Context Flow**:
- Technical_Specs ← Concept_Design (기능 명세 기반), ← UI_Screens (UI 요구사항 반영)
- Logic_Progress ← Technical_Specs (데이터 모델/API 명세 참조)
- QA_Validation ← 모든 상위 레이어 참조

### Required Documents

**Layer 3 — Technical_Specs**
- `00_DEVELOPMENT_PRINCIPLES.md` — 아키텍처, 패턴, 스탠다드, 도구, gitignore 대상
- `01_DB_SCHEMA.md` — 데이터 모델 설계
- `02_API_SPECS.md` — API 엔드포인트 명세

**Layer 4 — Logic_Progress**
- `00_BACKLOG.md` — Kanban 보드 (ToDo / In Progress / Done 구분 및 **모든 항목 체크박스 필수**)
- `00_ROADMAP.md` — Phase별 마일스톤 및 일정 전략 (Layer 3 기술 명세 링크 필수)
- `01_EXECUTION_PLAN.md` — 구체적인 작업 구현 일정 및 실행 전략 (**원자적 단위로 분할된 체크리스트 필수**)
- `02_ROADMAP_BACKLOG_SYNC.md` — Roadmap과 Backlog 동기화 규칙

**Layer 5 — QA_Validation**
- `01_TEST_SCENARIOS.md` — 테스트 케이스
- `02_QA_CHECKLIST.md` — 릴리스 기준 체크리스트

## 3. Interactive Process (Ask Before Write)

### Specs Phase (DB_SCHEMA, API_SPECS 작성 전 필수)

1. **Tech Stack & Architecture**: 프레임워크? DB? ORM? 인증 방식? (Open-source/Composability Check)
2. **Data Models & Relationships**: 핵심 엔티티는? 주요 관계는? 미디어 저장 방식(DB vs Storage)?
3. **API Strategy & Edge Cases**: REST or GraphQL? 실패/재시도/Rate limit 처리? 다국어/다통화 로직?
4. **Performance & UX Goals**: 목표 지연 시간(예: 400ms)? 캐싱 전략? 사용자 여정 단순화 방법?

### Logic Phase (BACKLOG, 코딩 시작 전 필수)

**중요 규칙**: 실무 문서(`00_BACKLOG.md`, `00_ROADMAP.md`, `01_EXECUTION_PLAN.md`) 작성 시, 모든 작업은 반드시 체크박스`[ ]`를 사용하여 원자적 단위(Atomic Task)로 최대한 상세히 나누어 기록해야 한다. "추상적인 작업" 대신 "실제로 실행 및 검증 가능한 단계"로 분할한다.

1. **Project Initialization**: CLI 프리셋 vs 수동 설정?
2. **UI Theme Strategy**: 사전 정의된 테마 vs 커스텀 브랜드 색상? 폰트 선택?
3. **Folder Structure**: Feature 기반 vs Type 기반?

### Dev Phase (DEVELOPMENT_PRINCIPLES 작성/갱신 시 필수)

코드베이스를 분석하고 아래 4개 영역을 사용자와 확인한다.

1. **Architecture**: 현재 폴더 구조는? import 규칙(path alias vs relative)은? server/client 경계 분리 방식은?
2. **Patterns**: 상태 관리 전략은? 에러 처리 패턴(throw Response vs return error)은? 컴포넌트 구성 규칙은?
3. **Standards**: TypeScript strict 유지 여부? 스타일링 규칙(디자인 토큰 vs 임의 값)? 인증/인가 패턴? 커밋 컨벤션?
   - 데이터 검증: Zod 사용 여부 및 적용 범위는? (API 요청/응답, env 파싱, 폼 데이터)
   - 날짜/시간: Luxon 사용 여부? 네이티브 Date 허용 범위는?
   - 에러 처리: throw Response vs return error 패턴? ErrorBoundary 전략은?
   - 피드백 UI: toast 라이브러리 선택은? (sonner, react-hot-toast 등) 사용 범위는?
4. **Tooling**: 린터/포매터 설정? 테스트 프레임워크? 환경변수 검증 방식? CI/CD?

**비일관성 처리**: 코드베이스에서 비일관성 발견 시 하나의 기준을 선택하고 원칙으로 명시. 기존 코드는 점진적 리팩토링 대상으로 표기.

**[TODO] 항목**: 미구현이나 향후 적용할 원칙은 `[TODO]` 태그와 우선순위(High/Medium/Low)를 명시.

### QA Phase (필수 포함 항목)

1. **Global Rubric Scorecard**: 6가지 기준 평가. (목표: 4개 이상 커버)
2. **Originality & Ethics Check**: 독창성 및 파생물 복사 여부 확인.

## 4. Global Rubric (6 Core Criteria) — QA 체크 기준

| Criterion | Status (Pass/Fail) | Evidence |
|:---|:---:|:---|
| **Functionality** | | MVP 기능 작동 여부 및 코드 품질 |
| **Potential Impact** | | TAM 크기, 생태계 기여도 |
| **Novelty** | | 차별적 가치 증명 |
| **UX** | | 400ms 반응성, 체감 성능 |
| **Open-source** | | Composability, 재사용 가능성 |
| **Business Plan** | | 수익 모델 지속 가능성 |

## 5. Templates

### Template C — Technical_Specs

```
# [Feature Name] Specification
> Created: YYYY-MM-DD HH:mm
> Last Updated: YYYY-MM-DD HH:mm

[Document content...]

## X. Related Documents
- **Concept_Design**: [Product Specs](../01_Concept_Design/03_PRODUCT_SPECS.md) - 기능 명세 및 사이트맵
- **UI_Screens**: [Related UI Review](../02_UI_Screens/XX_REVIEW.md) - 관련 UI 프로토타입
- **Technical_Specs**: [DB Schema](./01_DB_SCHEMA.md) - 데이터 모델 설계
- **Logic_Progress**: [Related Logic](../04_Logic_Progress/XX_LOGIC.md) - 비즈니스 로직 설계
```

### Template D — Logic_Progress

```
# [Logic Name] Design
> Created: YYYY-MM-DD HH:mm
> Last Updated: YYYY-MM-DD HH:mm

## 1. Context
(이 로직이 필요한 이유? 어떤 UI와 상호작용하는가?)

**관련 UI**: [Component A] -> [Component B] -> [Final Component]

## 2. Business Rules
- [ ] Rule 1:
- [ ] Rule 2:

## 3. Data Flow & State
(데이터가 어떻게 이동하는가? 필요 시 상태 머신 다이어그램)

## 4. Algorithm / Pseudo-code
(단계별 로직 설명)

## 5. Related Documents
- **Concept_Design**: [Product Specs](../01_Concept_Design/03_PRODUCT_SPECS.md) - 관련 기능 명세
- **UI_Screens**: [Related UI Review](../02_UI_Screens/XX_REVIEW.md) - 관련 UI 프로토타입
- **Technical_Specs**: [DB Schema](../03_Technical_Specs/01_DB_SCHEMA.md) - 데이터 모델 참조
- **Technical_Specs**: [API Specs](../03_Technical_Specs/02_API_SPECS.md) - API 엔드포인트 참조
- **QA_Validation**: [Test Scenarios](../05_QA_Validation/01_TEST_SCENARIOS.md) - 관련 테스트 케이스
```

### Template E — QA_Validation

```
# Test Report: [Feature Name]
> Created: YYYY-MM-DD HH:mm
> Last Updated: YYYY-MM-DD HH:mm

## 1. Rubric Validation (Mandatory)

| Criterion | Status (Pass/Fail) | Evidence |
|:---|:---:|:---|
| Functionality | | MVP 기능 작동 여부 및 린트/타입 에러 부재 |
| Potential Impact | | 생태계 기여 및 데이터 확장성 확인 |
| Novelty | | 기존 기능 대비 차별적 가치 증명 |
| UX | | 응답 속도(400ms) 및 인터랙션 매끄러움 |
| Open-source | | 모듈 간 결합성 및 재사용 가능성 |
| Business Plan | | 기능 구현이 수익 모델/지속성에 기여하는가 |

## 2. Test Scenarios & Results
(상세 테스트 케이스 및 결과)

## 3. Related Documents
- **Concept_Design**: [Product Specs](../01_Concept_Design/03_PRODUCT_SPECS.md) - 테스트 대상 기능 명세
- **UI_Screens**: [Related UI Review](../02_UI_Screens/XX_REVIEW.md) - 테스트 대상 UI 프로토타입
- **Technical_Specs**: [DB Schema](../03_Technical_Specs/01_DB_SCHEMA.md) - 데이터베이스 테스트 참조
- **Technical_Specs**: [API Specs](../03_Technical_Specs/02_API_SPECS.md) - API 테스트 참조
- **Logic_Progress**: [Related Logic](../04_Logic_Progress/XX_LOGIC.md) - 비즈니스 로직 테스트 참조
- **QA_Validation**: [QA Checklist](./02_QA_CHECKLIST.md) - 릴리스 기준 및 체크리스트
```

## 6. Related Skills

- **docs-plan**: Layer 1-2 기획/디자인 문서 작성
- **rules-dev**: 코딩 컨벤션 및 개발 설정 규칙 적용 (문서화가 아닌 코드 작성 시)
- **verify-docs**: 문서 구조/메타데이터 검증
- **verify-db**: DB 스키마 검증 (Drizzle/Prisma)
