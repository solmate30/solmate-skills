---
name: docs-plan
description: Create and manage planning documents for Layer 1 (Concept_Design) and Layer 2 (UI_Screens). Use when documenting product vision, lean canvas, product specs, UI design systems, screen flows, or prototype reviews. Ask before writing. Always include Related Documents sections.
---

# Planning Documentation Skill

This skill manages **Layer 1 (Concept_Design)** and **Layer 2 (UI_Screens)** — the "Why, Who, What" of the project.

> Shared conventions (metadata format, naming rules, 365 Principle overview, link format) are defined in `rules-docs`.

## 1. Rules

1. 이모지 금지. 전문적이고 명확한 텍스트로만 소통한다.
2. Ask before Write: 초안 작성 전 핵심 질문을 던지고 답변을 바탕으로 작성한다.
3. 기존 문서가 있으면 반드시 먼저 읽고 컨텍스트와 스타일을 유지하며 업데이트한다. 덮어쓰지 않는다.

## 2. Layer 정의

| Layer | Directory | Purpose |
|:---|:---|:---|
| Concept_Design | `docs/01_Concept_Design/` | 비전, 제품 기획, 비즈니스 전략, 디자인 원칙 정의 |
| UI_Screens | `docs/02_UI_Screens/` | UI 디자인 시스템, 화면 흐름, 프로토타입 리뷰 |

**Context Flow**:
- Concept_Design → UI_Screens (디자인 가이드라인 제공)
- Concept_Design → Technical_Specs (기능 명세 기반 제공)
- UI_Screens → Technical_Specs (구현 명세 요구사항 도출)

### Required Documents

**Layer 1 — Concept_Design**
- `00_COLLABORATION_GUIDE.md` — AI-Human 시너지 기준
- `01_VISION_CORE.md` — 핵심 가치, 타겟 오디언스
- `02_LEAN_CANVAS.md` — 문제, 솔루션, UVP, 지표
- `03_PRODUCT_SPECS.md` — MVP 정의, NFR
- `04_USER_RESEARCH.md` — 사용자 인터뷰, 페르소나, 행동 패턴 (선택, 권장)

**Layer 2 — UI_Screens**
- `00_SCREEN_FLOW.md` — 전체 사용자 여정
- `01_UI_DESIGN.md` — 디자인 시스템 (색상, 타이포그래피, 레이아웃)
- `XX_PROTOTYPE_REVIEW.md` — 페이지별 피드백

## 3. Interactive Process (Ask Before Write)

### Phase 1 — Project Definition (필수)

1. **Why (Problem & Goal)**: 핵심 문제는? 성공 시 세상의 변화는? 단/장기 목표는?
0. **User Research 보유 여부**: 실제 사용자 인터뷰나 관찰 데이터가 있는가? 있다면 `04_USER_RESEARCH.md`를 먼저 작성하고 이후 문서의 기반으로 활용한다.
2. **Who (Target User)**: 핵심 고객은? Pain Point는? 현재 해결 방식은?
3. **What (Value & Differentiation)**: UVP는? 경쟁 대비 차별점은? (Novelty Check)
4. **How (Feasibility)**: MVP 필수 항목은? 플랫폼 제약은? 법적/보안 우려는? (Functionality Check)
5. **Distribution Strategy**: 출력 형식(Responsive Web/PWA/App)? 호스팅 플랫폼? 도메인 전략? (Impact Check)
6. **Global Layout & Brand**: 모든 페이지의 표준 Header/Footer 요소는? AI/어시스턴트 진입점 위치는?

### Phase 2 — Business Model Deep-dive (Pitch Deck, 수익 모델 작성 시 필수)

7. **User Spending Path**: 유저가 지갑을 여는 결정적 순간(Moment of Truth)은? 프라이버시와 결제 레일이 이 경로를 어떻게 보호하는가? (Business Plan Check)
8. **Privacy as TAM Expander**: 유저가 안심하고 '진실'을 말하게 하는 장치는? 이것이 어떻게 TAM을 확장하는가?
9. **Company-like Infrastructure**: 다른 빌더/AI 에이전트가 위에서 활동하거나 결제할 수 있는 구조(예: x402, MCP)가 설계되어 있는가? (Scalability Check)
10. **Action-to-Transaction Flow**: 유저의 자연스러운 '행동'이 어떻게 즉각적인 '거래'로 연결되는가? (Consumer UX Check)
11. **Technical Necessity**: 선택한 기술 스택이 '필연적'인가? 핵심 기능은 이 기술의 특정 속성 없이는 작동하지 않는다는 것을 증명할 수 있는가?

### Phase 3 — Pitch & Strategy (투자자 대면, 경쟁 제출 준비 시 필수)

12. **Long-term Vision vs. Incremental Execution**: 2주짜리 프로젝트인가, 2년짜리 비즈니스인가? 단계별 실행 전략과 각 단계별 기술 명세 문서 링크가 기록되어 있는가?
13. **Aesthetics & First Impression**: 프리미엄 UI로 첫 인상에서 유저를 압도할 수 있는 시각적 디테일과 UX 완성도를 갖추었는가?
14. **Pitch Readiness**: 3분 안에 팀/문제/타겟/비전/검증을 전달할 수 있는가? 6개 루브릭 중 4개 이상이 승리 전략으로 포함되었는가?
15. **The 3 Investor Lenses**: Leverage / Realistic Money Flow / Defensibility — 세 가지를 증명했는가?
16. **The Future Weapon**: 6~18개월 뒤 시장에서 싸울 강력한 무기는 무엇인가?

## 4. Templates

### Template 0 — User Research (`04_USER_RESEARCH.md`)

```
# User Research
> Created: YYYY-MM-DD HH:mm
> Last Updated: YYYY-MM-DD HH:mm

## 1. 리서치 개요
- 목적:
- 방법: (인터뷰 / 설문 / 관찰 / 사용성 테스트)
- 대상: N명, [직군/연령/특성]
- 기간:

## 2. 페르소나

### Persona A — [이름/유형]
- 배경:
- 주요 목표:
- Pain Point:
- 현재 해결 방식:
- 우리 제품에 기대하는 것:

## 3. 핵심 인사이트
(인터뷰/관찰에서 반복적으로 나온 패턴 3-5가지)
- Insight 1:
- Insight 2:
- Insight 3:

## 4. 검증된 가정 / 반증된 가정
| 가정 | 결과 | 근거 |
|:---|:---:|:---|
| | 검증됨 / 반증됨 | |

## 5. Related Documents
- **Concept_Design**: [Vision & Core Values](./01_VISION_CORE.md) - 타겟 오디언스 정의
- **Concept_Design**: [Lean Canvas](./02_LEAN_CANVAS.md) - Pain Point 및 솔루션 기반
- **Concept_Design**: [Product Specs](./03_PRODUCT_SPECS.md) - MVP 기능 우선순위 기반
```

### Template A — Concept_Design

```
# [Document Title]
> Created: YYYY-MM-DD HH:mm
> Last Updated: YYYY-MM-DD HH:mm

[Document content...]

## X. Related Documents
- **Concept_Design**: [Vision & Core Values](./01_VISION_CORE.md) - 프로젝트 비전 및 타겟 오디언스
- **Concept_Design**: [Lean Canvas](./02_LEAN_CANVAS.md) - 비즈니스 모델 및 수익 구조
- **UI_Screens**: [Screen Flow](../02_UI_Screens/00_SCREEN_FLOW.md) - 사용자 흐름
- **Technical_Specs**: [Product Specs](../03_Technical_Specs/00_DEVELOPMENT_PRINCIPLES.md) - 기술 명세 기반
```

### Template B — UI_Screens

```
# [Prototype Name] Review
> Created: YYYY-MM-DD HH:mm
> Last Updated: YYYY-MM-DD HH:mm

## 1. Prototype Link/Screenshot
(이미지 또는 작동 프로토타입 링크 첨부)

## 2. Key User Flows
(이 프로토타입에서 시연된 흐름 설명)

## 3. Feedback & Improvements
(구현 전 변경이 필요한 사항)

## 4. Related Documents
- **Concept_Design**: [Product Specs](../01_Concept_Design/03_PRODUCT_SPECS.md) - 사이트맵 및 사용자 플로우
- **UI_Screens**: [UI Design](./01_UI_DESIGN.md) - 디자인 시스템 및 컴포넌트 가이드라인
- **Technical_Specs**: [Related Spec](../03_Technical_Specs/XX_SPEC.md) - 구현 명세 요구사항
```

## 5. Related Skills

- **docs-dev**: Layer 3-5 기술 명세/로직/QA 문서 작성
- **verify-docs**: 작성된 문서의 구조/메타데이터 검증
