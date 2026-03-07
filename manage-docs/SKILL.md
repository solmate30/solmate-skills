---
name: manage-docs
description: Router for project documentation. Delegates to plan-docs (Layer 1-2: product vision, lean canvas, UI screens) or dev-docs (Layer 3-5: technical specs, logic, QA). Also defines shared conventions used by both skills. Use when unsure which documentation skill to use, or to reference common formatting rules.
---

# Documentation Management (Router)

This skill routes to the correct documentation sub-skill and defines **shared conventions** used by both.

## 1. 어떤 스킬을 써야 하는가?

| 작업 내용 | 사용 스킬 |
|:---|:---|
| 제품 비전, Lean Canvas, 제품 기능 명세 | **plan-docs** |
| UI 디자인 시스템, 화면 흐름, 프로토타입 리뷰 | **plan-docs** |
| DB 스키마, API 명세, 개발 원칙 | **dev-docs** |
| 로드맵, 백로그, 비즈니스 로직 | **dev-docs** |
| 테스트 시나리오, QA 체크리스트 | **dev-docs** |

## 2. 공통 규칙 (plan-docs, dev-docs 모두 적용)

### 2.1. 기본 규칙

1. 이모지 금지. 전문적이고 명확한 텍스트로만 소통한다.
2. Ask before Write: 초안 작성 전 핵심 질문을 던지고 답변을 바탕으로 작성한다.
3. 기존 문서가 있으면 반드시 먼저 읽고 컨텍스트와 스타일을 유지하며 업데이트한다.

### 2.2. 파일 네이밍

2자리 순번 접두사 사용: `01_VISION_CORE.md`, `02_API_SPECS.md`

### 2.3. 메타데이터 (필수)

모든 문서 최상단:

```markdown
# [Document Title]
> Created: YYYY-MM-DD HH:mm
> Last Updated: YYYY-MM-DD HH:mm
```

Last Updated는 문서 수정 시마다 갱신한다.

### 2.4. Related Documents 섹션 (필수)

모든 문서 끝에 포함. 상대 경로 사용. 관계를 간략히 설명한다.

```
## X. Related Documents
- **Layer Name**: [Document Title](../layer-directory/filename.md) - 관계 설명
```

경로 예시:
- 같은 레이어: `./02_LEAN_CANVAS.md`
- 다른 레이어: `../01_Concept_Design/03_PRODUCT_SPECS.md`

### 2.5. Rubric-First Writing

모든 문서는 **6 Core Rubrics** 관련 항목을 포함한다. Logic 문서라도 UX(Latency)와 Functionality(Edge cases)를 언급한다.

## 3. 5-Layer 구조 (전체 개요)

| Layer | Directory | Sub-skill |
|:---|:---|:---|
| Concept_Design | `docs/01_Concept_Design/` | plan-docs |
| UI_Screens | `docs/02_UI_Screens/` | plan-docs |
| Technical_Specs | `docs/03_Technical_Specs/` | dev-docs |
| Logic_Progress | `docs/04_Logic_Progress/` | dev-docs |
| QA_Validation | `docs/05_QA_Validation/` | dev-docs |

## 4. 365 Principle

| 숫자 | 의미 | 내용 |
|:---|:---|:---|
| **3** | Investor Lenses | Leverage, Realistic Money Flow, Defensibility |
| **6** | Global Rubric | Functionality, Impact, Novelty, UX, Open-source, Business Plan |
| **5** | Documentation Layers | Concept_Design, UI_Screens, Technical_Specs, Logic_Progress, QA_Validation |

## 5. Context Continuity Checklist

문서 생성/수정 시 확인:

- [ ] 관련 Concept_Design 문서가 링크되어 있는가?
- [ ] 관련 UI_Screens 문서가 링크되어 있는가? (있을 경우)
- [ ] 관련 Technical_Specs 문서가 링크되어 있는가? (있을 경우)
- [ ] 관련 Logic_Progress 문서가 링크되어 있는가? (있을 경우)
- [ ] 관련 QA_Validation 문서가 링크되어 있는가? (있을 경우)
- [ ] 링크가 상대 경로로 정확하게 작성되었는가?
- [ ] 각 링크에 관계 설명이 포함되어 있는가?
