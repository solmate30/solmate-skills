---
name: manage-docs
description: Create and manage project documentation according to the 365 Principle (3 Investor Lenses, 6 Rubrics, 5 Documentation Layers) with mandatory cross-layer context linking. Use when the user asks to document features, update documentation, create spec files, or manage project docs. Always include "Related Documents" sections to maintain context continuity across layers.
---

# Documentation Management Skill

This skill helps you maintain the project's documentation structure, ensuring consistency and adherence to the **365 Principle**.

> **365 Principle** -- 프로젝트 품질과 시장 경쟁력을 보장하는 통합 프레임워크.
>
> | 숫자 | 의미 | 내용 |
> | :--- | :--- | :--- |
> | **3** | Investor Lenses | Leverage, Realistic Money Flow, Defensibility |
> | **6** | Global Rubric | Functionality, Impact, Novelty, UX, Open-source, Business Plan |
> | **5** | Documentation Layers | Concept_Design, UI_Screens, Technical_Specs, Logic_Progress, QA_Validation |

## 0. Global Rubric (6 Core Criteria)

All projects should be designed and validated against these 6 criteria to ensure high quality and market competitiveness.

1.  **Functionality**: 실제로 돌아가는가? 코드가 깔끔한가? (MVP 작동 여부 및 코드 품질)
2.  **Potential Impact**: TAM(시장 규모)이 큰가? 생태계 기여도는? (성장 가능성 및 기여도)
3.  **Novelty**: 기존에 없던 접근인가? 차별점이 명확한가? (참신함 및 고유 가치)
4.  **UX**: 성능을 UX로 전환했는가? (400ms 반응성, 저렴한 비용 등 체감 성능)
5.  **Open-source**: 다른 빌더가 쓸 수 있는가? (Composability 및 협업 가능성)
6.  **Business Plan**: 지속 가능한 수익 모델이 있는가? (수익성 및 생존 모델)

## 1. 규칙

1. 이모지 금지. 전문적이고 명확한 텍스트로만 소통한다.
2. 문서를 독단적으로 작성하지 않는다. 초안 작성 전, 반드시 사용자에게 핵심 질문을 던지고 답변을 바탕으로 작성한다 (Ask before Write).
3. 기존 문서가 있으면 반드시 먼저 읽고, 컨텍스트와 스타일을 유지하며 업데이트한다. 덮어쓰지 않는다.

## 2. 5-Layer 구조 (폴더명 / 역할)

| 순번 | 폴더명 | 역할 |
| :--- | :--- | :--- |
| 1 | `docs/01_Concept_Design/` | 컨셉 가이드. 비전, 상세 기능 정의(Product Specs), 비즈니스 전략. |
| 2 | `docs/02_UI_Screens/` | UI/UX 설계. 디자인 시스템/UI 가이드(UI Design), 화면 흐름(Screen Flow), 프로토타입 리뷰. |
| 3 | `docs/03_Technical_Specs/` | 기술 명세. 데이터·API 약속, DB 스키마·구현 가이드. |
| 4 | `docs/04_Logic_Progress/` | 로직·진행. 실행 로드맵(Roadmap), 백로그(Backlog), 비즈니스 로직·상태 관리·알고리즘. |
| 5 | `docs/05_QA_Validation/` | QA·검증. 테스트 시나리오, QA 체크리스트, 시스템 검증. |

| Layer | Directory | Purpose (EN) | Examples |
| :--- | :--- | :--- | :--- |
| Concept_Design | `docs/01_Concept_Design/` | Planning, Purpose, Core Specs. | `00_COLLABORATION_GUIDE.md`, `01_VISION_CORE.md`, `02_PRODUCT_SPECS.md` |
| UI_Screens | `docs/02_UI_Screens/` | UI Design System, screen flows. | `00_SCREEN_FLOW.md`, `01_UI_DESIGN.md` |
| Technical_Specs | `docs/03_Technical_Specs/` | Data, API, implementation specs. | `01_DB_SCHEMA.md`, `02_API_SPECS.md` |
| Logic_Progress | `docs/04_Logic_Progress/` | Roadmap, Backlog, business rules. | `00_ROADMAP.md`, `01_BACKLOG.md` |
| QA_Validation | `docs/05_QA_Validation/` | Test scenarios, QA checklists, validation. | `01_TEST_SCENARIOS.md`, `02_QA_CHECKLIST.md` |

### 2.1. Layer Roles & Context Flow

**Concept & Design (01_Concept_Design/)**:
- **Role**: 프로젝트의 비전, 목적, 전략, 디자인 원칙 정의
- **Context Flow**: Concept_Design -> UI_Screens (디자인 가이드라인 제공), Concept_Design -> Technical_Specs (기능 명세 기반 제공)

**UI Screens (02_UI_Screens/)**:
- **Role**: UI 프로토타입 리뷰 및 사용자 플로우 검증 (페이지별 완성된 모습 확인)
- **Context Flow**: UI_Screens <- Concept_Design (디자인 시스템 참조), UI_Screens -> Technical_Specs (구현 명세 요구사항 도출)

**Technical Specs (03_Technical_Specs/)**:
- **Role**: 기술 명세 및 구현 가이드라인 정의 (데이터, API 등 기술적 약속)
- **Context Flow**: Technical_Specs <- Concept_Design (기능 명세 기반), Technical_Specs <- UI_Screens (UI 요구사항 반영), Technical_Specs -> Logic_Progress (비즈니스 로직 설계 기반)

**Logic & Progress (04_Logic_Progress/)**:
- **Role**: 백로그(진행 상태)와 비즈니스 로직, 상태 관리, 알고리즘 설계
- **Context Flow**: Logic_Progress <- Technical_Specs (데이터 모델 및 API 명세 참조), Logic_Progress <- UI_Screens (UI 인터랙션 요구사항 반영), Logic_Progress -> QA_Validation (테스트 시나리오 기반)

**QA & Validation (05_QA_Validation/)**:
- **Role**: 테스트 케이스 및 QA 기준 정의 (시스템 검증)
- **Context Flow**: QA_Validation <- 모든 상위 레이어 (Concept_Design, UI_Screens, Technical_Specs, Logic_Progress 참조하여 테스트 시나리오 작성)

## 3. 레이어 판별 (어디에 둘지)

- 기획·제품 정의 -> **01_Concept_Design**
- UI 디자인·프로토타입·화면 흐름 -> **02_UI_Screens**
- 상세 구현 명세 (특히 DB, API, Pipeline) -> **03_Technical_Specs**
- 실행 로드맵·백로그·비즈니스 로직 -> **04_Logic_Progress**
- 테스트 계획·QA 보고 -> **05_QA_Validation**

## 4. 파일 작성 규칙

### 네이밍
파일명 앞에 2자리 순번을 붙인다: `01_VISION_CORE.md`, `02_API_SPECS.md`

### 메타데이터 (필수)
모든 문서 최상단:
```markdown
# [Document Title]
> Created: YYYY-MM-DD HH:mm
> Last Updated: YYYY-MM-DD HH:mm
```

### Rubric-First Writing
Every document, regardless of the layer, should include specific points related to the **6 Core Rubrics** where relevant. For example, a Logic doc should mention **UX (Latency)** and **Functionality (Edge cases)**.

### Related Documents 섹션 (필수)
모든 문서 끝에 관련 문서 링크를 포함한다. 상대 경로를 사용하고, 관계를 간략히 설명한다.

```markdown
## X. Related Documents
- **Layer Name**: [Document Title](./relative/path.md) - 관계 설명
```

링크 규칙:
- 같은 레이어: `./02_LEAN_CANVAS.md`
- 다른 레이어: `../01_Concept_Design/03_PRODUCT_SPECS.md`
- 특정 섹션 참조 시 Section 번호 명시

## 5. Interactive Process (Ask before Write & Ask before Code)

**CRITICAL**: Do NOT generate a full document based on assumptions. Do NOT start coding based on documents alone. Follow this mandatory **2-Step Questioning Workflow**:

1.  **Step 1 -- Project Definition Questions**: Ask Phase 1/2 questions at the start of the project.
2.  **Step 2 -- Document Creation**: Create/update documents based on Step 1 answers.
3.  **Step 3 -- Pre-Code Final Verification**: **Crucial Step.** Before any code is written, perform a second round of inquiry focused on implementation details (Folder structure, specific patterns, edge cases, error handling).
4.  **Step 4 -- Implementation**: Proceed with coding only after explicitly confirming with the user that all technical decisions are settled.

**[Interactive Process - Phase-based Questions]**

1.  **Why (Problem & Goal)**: What is the core problem? How does the world change if we succeed? What are short/long-term goals?
2.  **Who (Target User)**: Who is the core customer? What are their pain points? How do they solve this now?
3.  **What (Value & Differentiation)**: What is our Unique Value Proposition? Why would they pay/use us over competitors? (**Novelty Check**)
4.  **How (Feasibility)**: What must be in MVP (v1.0)? Platform constraints (Web/Mobile)? Legal/Security concerns? (**Functionality Check**)
5.  **Distribution Strategy**: Output format (Responsive Web/PWA/App)? Hosting Platform (Vercel/Netlify)? Domain strategy? (**Impact Check**)
6.  **Global Layout & Brand Consistency**: Discuss the standard **Header and Footer** early. What links, logo, and legal information must be present on every page? If the product will offer an **AI / assistant** (e.g. "Ask AI" or concierge), where should the entry point live (floating button, header icon, dedicated screen, sidebar panel) and on which pages?

### Phase 2 -- Business Model Deep-dive (Pitch Deck, Monetization Strategy 작성 시 필수)
7.  **User Spending Path (The "Winning" Journey)**: '끝내주는 기술'보다 중요한 것은 '유저가 실제로 돈을 쓰는 경로'입니다. 유저가 지갑을 여는 결정적 순간(Moment of Truth)은 언제입니까? 프라이버시와 결제 레일이 이 경로를 어떻게 보호합니까? (**Business Plan Check - CRITICAL**)
8.  **Privacy as a TAM Expander**: 프라이버시가 없으면 시장 자체가 열리지 않습니다. 유저가 안심하고 '진실'을 이야기하게 만드는 장치는 무엇입니까? 이것이 어떻게 잠재적 시장 규모(TAM)를 확장합니까? (**Privacy & Strategy Check**)
9.  **Company-like Infrastructure (The 'Company' Smell)**: 단순한 '툴'을 넘어 하나의 '경제 체계'를 지원하는 인프라를 갖추었습니까? 다른 빌더나 AI 에이전트가 우리 위에서 활동하거나 결제할 수 있는 구조(예: x402, MCP 등)가 설계되어 있습니까? (**Scalability & Infra Check**)
10. **Action-to-Transaction Flow (Consumer Pattern)**: 유저의 자연스러운 '행동'이 어떻게 즉각적인 '거래'로 연결됩니까? 고속/저수수료 인프라를 활용하여 결제 허들을 제거하고 대중 UX를 확보했습니까? (**Consumer UX & Monetization Check**)
11. **Technical Necessity (The "Why this Stack?" Question)**: 선택한 기술 스택(AI, DB, 네트워크 등)이 '필연적'입니까? "단순히 성능이 좋아서"가 아니라, "우리의 핵심 기능은 이 기술의 특정 속성(예: 400ms 지연시간, 안정성 등) 없이는 작동하지 않는다"는 것을 증명할 수 있습니까? (**Engineering Strategy Check**)

### Phase 3 -- Pitch & Strategy (투자자 대면, 경쟁 제출 준비 시 필수)
12. **Long-term Vision vs. Incremental Execution**: 이것은 '2주짜리 프로젝트'입니까, 아니면 '2년짜리 비즈니스'입니까? 지금 당장 완벽하게 작동하는 '단 하나의 핵심 기능'에서 시작하여, 거대한 비전으로 나아가는 단계별 실행 전략이 기록되어 있습니까? 각 단계별로 참조할 기술 명세 문서(Layer 3) 링크가 포함되어 있습니까? (**Execution Roadmap Check - Connectivity Mandate**)
13. **Aesthetics & First Impression ("있어보이니즘")**: 같은 기능이라도 프리미엄 UI는 가치를 50% 이상 높입니다. 첫 인상에서 유저를 압도할 수 있는 시각적 디테일과 UX 완성도를 갖추었습니까? (**UX/UI Premium Check**)
14. **Pitch Readiness (3-minute Storytelling)**: 1,500개 이상의 경쟁작 사이에서 3분 안에 팀/문제/타겟/비전/검증을 명확히 전달할 수 있는 '피치 덱' 관점의 요약이 포함되어 있습니까? 6개 루브릭 중 최소 4개 이상이 승리 전략으로 포함되었습니까? (**Strategic Pitch Check**)
15. **The 3 Investor Lenses (Scale & Moat)**: 투자자의 관점에서 다음 3가지를 증명했습니까?
    - **Leverage**: 내가 커질 때 생태계도 함께 커지는가?
    - **Realistic Money Flow**: "어떻게 돈 벌어?"라는 질문에 군더더기 없이 짧게 답할 수 있는가?
    - **Defensibility**: 시간이 흐를수록 경쟁자가 따라오기 힘든 '우리만의 해자(Moat)'는 무엇인가?
16. **The Future Weapon (6-18 Months Vision)**: 단순한 현재 기능 구현을 넘어, 6~18개월 뒤에 우리가 어떤 강력한 무기로 시장에서 싸우고 있을지 상상이 됩니까? (**Future Strategy Check**)

### Specs Phase (DB_SCHEMA, API_SPECS 작성 전 필수)
1.  **Tech Stack & Architecture**: Which Framework? Which DB? ORM? Auth method? (**Open-source/Composability Check**)
2.  **Data Models & Relationships**: Which entities are core? Key relationships? Store media in DB or Storage? (**Functionality Check**)
3.  **API Strategy & Edge Cases**: REST or GraphQL? How to handle failures, retries, rate limits? Multi-currency or multi-language logic? (**Engineering Strategy Check**)
4.  **Performance & UX Goals**: What are the target latency times (e.g., 400ms)? How to simplify the user journey? Caching strategy? (**UX Check**)

### Logic Phase (BACKLOG, coding 시작 전 필수)
1.  **Project Initialization**: Use CLI presets or manual setup?
2.  **UI Theme Strategy**: Pre-defined theme vs Custom Brand Colors? Font choice?
3.  **Folder Structure**: Feature-based vs Type-based?

### Dev Phase (DEVELOPMENT_PRINCIPLES 작성/갱신 시 필수)
개발 원칙·컨벤션 문서를 작성하기 전에, 현재 코드베이스를 분석하고 아래 4개 영역을 사용자와 확인한다.

1.  **Architecture (구조)**: 현재 폴더 구조는? import 규칙(path alias vs relative)은? server/client 경계 분리 방식은? 변경이 필요한가, 현행 유지인가?
2.  **Patterns (패턴)**: 상태 관리 전략(loader/action only vs 전역 상태)은? 에러 처리 패턴(throw Response vs return error)은? 컴포넌트 구성 규칙(함수형 전용, Props 타이핑)은?
3.  **Standards (기준)**: TypeScript strict 모드 유지 여부? 스타일링 규칙(디자인 토큰 vs 임의 값)? 인증/인가 패턴? 커밋 컨벤션?
4.  **Tooling (도구)**: 린터/포매터 설정 현황? 테스트 프레임워크? 환경변수 검증 방식? CI/CD?
5.  **Git 제외 대상 (`.gitignore`)**: 아래 파일/디렉토리는 로컬 전용이며 Git에 커밋하지 않는다.

    | 대상 | 사유 |
    |:---|:---|
    | `.agent/` | AI 에이전트 스킬 정의 (로컬 워크플로우 설정) |
    | `.claude/` | Claude Code 커맨드 및 설정 (개인 환경) |
    | `.cursor/` | Cursor IDE 에이전트 및 설정 (로컬 워크플로우) |
    | `.vscode/` | VS Code 에디터 설정 (개인 환경) |
    | `AGENTS.md` | AI 에이전트 행동 규칙 (로컬 전용) |
    | `CLAUDE.md` | Claude Code 프로젝트 컨텍스트 (로컬 전용) |

    > **DESIGN.md**와 **docs/** 디렉토리는 프로젝트 공유 자산이므로 Git에 포함한다.

**비일관성 처리 원칙**: 코드베이스에서 비일관성(예: import 경로 혼용)이 발견되면, 하나의 기준을 선택하고 원칙으로 명시한다. 기존 코드는 점진적 리팩토링 대상으로 표기한다.

**[TODO] 항목**: 현재 미구현이나 향후 적용할 원칙은 `[TODO]` 태그와 우선순위(High/Medium/Low)를 명시한다.

**대상 문서**: `docs/03_Technical_Specs/00_DEVELOPMENT_PRINCIPLES.md`

### QA Phase (필수 포함 항목)
1. **Global Rubric Scorecard**: Evaluation against the 6 criteria. (Goal: Coverage of 4+)
2. **Originality & Ethics Check**: Ensure the work is original and not a derivative copy.

## 6. Templates

### (A) Concept & Design Templates (`docs/01_Concept_Design/`)
Required Documents:
1.  **`00_COLLABORATION_GUIDE.md`**: AI-Human Synergy Standards.
2.  **`01_VISION_CORE.md`**: Core Values, Target Audience.
3.  **`02_LEAN_CANVAS.md`**: Problem, Solution, UVP, Metrics.
4.  **`03_PRODUCT_SPECS.md`**: MVP Definition, NFR.

### (B) UI Screens Template (`docs/02_UI_Screens/`)
Required Documents:
1.  **`00_SCREEN_FLOW.md`**: Full User Journey.
2.  **`01_UI_DESIGN.md`**: Design System (Color, Typography, Layout).
3.  **`XX_PROTOTYPE_REVIEW.md`**: Specific Page Feedback.

```markdown
# [Title: Lean Canvas / Product Specs / Roadmap]
> Created: [YYYY-MM-DD HH:mm]
> Last Updated: [YYYY-MM-DD HH:mm]

[Document content...]

## X. Related Documents
- **Concept_Design**: [Vision & Core Values](./01_VISION_CORE.md) - 프로젝트 비전 및 타겟 오디언스
- **Concept_Design**: [Lean Canvas](./02_LEAN_CANVAS.md) - 비즈니스 모델 및 수익 구조
- **Concept_Design**: [Roadmap](./04_ROADMAP.md) - 단계별 실행 계획
```

### (B) UI Screens Template (`docs/02_UI_Screens/`)
Used for: Prototype Review, Screen Flow, UI Feedback

```markdown
# [Prototype Name] Review
> Created: [YYYY-MM-DD HH:mm]
> Last Updated: [YYYY-MM-DD HH:mm]

## 1. Prototype Link/Screenshot
(Attach image or link to the working prototype)

## 2. Key User Flows
(Describe the flow demonstrated in this prototype)

## 3. Feedback & Improvements
(What needs to be changed before implementation?)

## 4. Related Documents
- **Concept_Design**: [Product Specs](../01_Concept_Design/03_PRODUCT_SPECS.md) - 해당 페이지 사이트맵 및 사용자 플로우
- **Concept_Design**: [UI Design](../01_Concept_Design/05_UI_DESIGN.md) - 디자인 시스템 및 컴포넌트 가이드라인
- **Prototype**: [Previous/Next Prototype](./XX_PREVIOUS_REVIEW.md) - 이전/다음 단계 프로토타입
```

### (C) Technical Specs Template (`docs/03_Technical_Specs/`)
Used for: Feature Specs, API Design, Database Schema

```markdown
# [Feature Name] Specification
> Created: [YYYY-MM-DD HH:mm]
> Last Updated: [YYYY-MM-DD HH:mm]

[Document content...]

## X. Related Documents
- **Concept_Design**: [Product Specs](../01_Concept_Design/03_PRODUCT_SPECS.md) - 기능 명세 및 사이트맵
- **UI_Screens**: [Related UI Review](../02_UI_Screens/XX_REVIEW.md) - 관련 UI 프로토타입
- **Technical_Specs**: [Database Schema](./01_DB_SCHEMA.md) - 데이터 모델 설계
- **Logic_Progress**: [Related Logic Design](../04_Logic_Progress/XX_LOGIC.md) - 비즈니스 로직 설계
```

### (D) Logic & Progress Template (`docs/04_Logic_Progress/`)
Used for: Executional Roadmap, Backlog, Business Rules

Required Documents:
1.  **`00_ROADMAP.md`**: Now / Next / Later Strategy (Mandatory: Link to Layer 3 Tech Specs).
2.  **`01_BACKLOG.md`**: Kanban Board (Current, Upcoming, Completed).
3.  **`02_ROADMAP_BACKLOG_SYNC.md`**: Rules for keeping Roadmap and Backlog updated.
4.  **Specific Logic Docs**: (e.g., `03_BOOKING_STATE_MACHINE.md`)

```markdown
# 00_ROADMAP
## 1. Development Phases
### Phase X: [Phase Name]
*   [ ] Task 1 (Context: [Relate to Layer 3 Spec](../03_Technical_Specs/XX_SPEC.md))
```

```markdown
# [Logic Name] Design
> Created: [YYYY-MM-DD HH:mm]
> Last Updated: [YYYY-MM-DD HH:mm]

## 1. Context
(Why is this logic needed? Which UI interacts with it?)

**관련 UI**: [UI Component Name] -> [Next Component] -> [Final Component]

## 2. Business Rules
- [ ] Rule 1: (e.g., Cancellation is free until 24 hours before)
- [ ] Rule 2: (e.g., Login required for payment)

## 3. Data Flow & State
(How does data move? State machine diagram if needed)

## 4. Algorithm / Pseudo-code
(Step-by-step logic description)

## 5. Related Documents
- **Concept_Design**: [Product Specs](../01_Concept_Design/03_PRODUCT_SPECS.md) - 관련 기능 명세
- **UI_Screens**: [Related UI Review](../02_UI_Screens/XX_REVIEW.md) - 관련 UI 프로토타입
- **Technical_Specs**: [Database Schema](../03_Technical_Specs/01_DB_SCHEMA.md) - 데이터 모델 참조
- **Technical_Specs**: [API Specs](../03_Technical_Specs/02_API_SPECS.md) - API 엔드포인트 참조
- **QA_Validation**: [Test Scenarios](../05_QA_Validation/01_TEST_SCENARIOS.md) - 관련 테스트 케이스
```

### (E) QA & Validation Template (`docs/05_QA_Validation/`)
Used for: Test Plans, Checklists, Bug Reports

```markdown
# Test Report / Plan: [Feature Name]
> Created: [YYYY-MM-DD HH:mm]
> Last Updated: [YYYY-MM-DD HH:mm]

## 1. Rubric Validation (Mandatory Check)
이 기능이 안티그래비티 글로벌 루브릭 6가지 기준을 충족하는지 검증합니다.

| Criterion | Status (Pass/Fail) | Specific Evidence / Metrics |
| :--- | :---: | :--- |
| **Functionality** | | MVP 기능 작동 여부 및 린트/타입 에러 부재 |
| **Potential Impact** | | 생태계 기여 및 데이터 확장성 확인 |
| **Novelty** | | 기존 기능 대비 차별적 가치 증명 |
| **UX** | | 응답 속도(400ms) 및 인터랙션 매끄러움 |
| **Open-source** | | 모듈 간 결합성 및 재사용 가능성 |
| **Business Plan** | | 기능 구현이 수익 모델/지속성에 기여하는가 |

## 2. Test Scenarios & Results
(Detailed test cases and results)

## 3. Related Documents
- **Concept_Design**: [Product Specs](../01_Concept_Design/03_PRODUCT_SPECS.md) - 테스트 대상 기능 명세
- **UI_Screens**: [Related UI Review](../02_UI_Screens/XX_REVIEW.md) - 테스트 대상 UI 프로토타입
- **Technical_Specs**: [Database Schema](../03_Technical_Specs/01_DB_SCHEMA.md) - 데이터베이스 테스트 참조
- **Technical_Specs**: [API Specs](../03_Technical_Specs/02_API_SPECS.md) - API 테스트 참조
- **Logic_Progress**: [Related Logic Design](../04_Logic_Progress/XX_LOGIC.md) - 비즈니스 로직 테스트 참조
- **QA_Validation**: [QA Checklist](./02_QA_CHECKLIST.md) - 릴리스 기준 및 체크리스트
```

## 7. Context Linking & Cross-References

**CRITICAL**: Every document MUST maintain context continuity with related documents across layers.

### 7.1. Linking Rules by Layer

**Concept_Design**: 같은 레이어 문서들 (Vision -> Lean Canvas -> Product Specs -> Roadmap -> UI Design 순서) + 관련 UI_Screens/Technical_Specs (있을 경우)

**UI_Screens**: Concept_Design (Product Specs, UI Design) + 이전/다음 UI_Screens + Technical_Specs/Logic_Progress (있을 경우)

**Technical_Specs**: Concept_Design + UI_Screens + 다른 Technical_Specs (DB <-> API <-> Storage) + Logic_Progress (있을 경우)

**Logic_Progress**: Concept_Design + UI_Screens + Technical_Specs (DB, API) + QA_Validation (있을 경우)

**QA_Validation**: 모든 상위 레이어 참조

### 7.2. Link Path Format

- **Use relative paths**: Always use relative paths from the current document
- **Be specific**: Include section references when linking to specific parts (e.g., "Section 3.A.1")
- **Describe relationship**: Always include a brief description of why the link is relevant

Path Examples:
- Same layer: `./02_LEAN_CANVAS.md`
- Parent layer: `../01_Concept_Design/03_PRODUCT_SPECS.md`
- Child layer: `../02_UI_Screens/00_LANDING_PAGE_REVIEW.md`
- Sibling layer: `../03_Technical_Specs/01_DB_SCHEMA.md`

### 7.3. Context Continuity Checklist

When creating or updating a document, verify:
- [ ] All relevant Foundation documents are linked (if applicable)
- [ ] Related Prototype documents are linked (if exist)
- [ ] Related Specs documents are linked (if exist)
- [ ] Related Logic documents are linked (if exist)
- [ ] Related Test documents are linked (if exist)
- [ ] Links use relative paths correctly
- [ ] Each link includes a brief description of the relationship
- [ ] Section references are included when linking to specific parts

## 8. 실행 절차

1. 사용자 요청에서 대상 레이어를 판별한다
2. 해당 디렉터리의 기존 문서를 확인한다
3. 기존 문서가 있으면 읽어서 컨텍스트를 파악한다
4. 레이어에 맞는 질문을 사용자에게 던진다 (Phase별 단계적 질문)
5. 답변을 바탕으로 문서를 작성/수정한다 (Rubric-First Writing)
6. Related Documents 섹션을 반드시 포함한다
7. Last Updated 타임스탬프를 갱신한다

## 9. Best Practices

- **Keep it minimal**: Don't write fluff. Be precise.
- **Maintain context continuity**: Always include "Related Documents" section to link across layers.
- **Update the Map**: If you add a major new document, consider updating `docs/01_Concept_Design/04_ROADMAP.md` or a central index if one exists.
- **Preserve existing content**: When updating documents, read existing files first and maintain context and style. Do not overwrite unnecessarily.
- **Follow Interactive Process**: Always ask users key questions before creating documents. Never generate documents based solely on assumptions.
- **Update Last Updated date**: When modifying a document, update the "Last Updated" timestamp in the metadata header.
