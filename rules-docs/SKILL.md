---
name: rules-docs
description: Create and manage project documentation according to the 365 Principle (3 Investor Lenses, 6 Rubrics, 5 Documentation Layers) with mandatory cross-layer context linking. Use when the user asks to document features, update documentation, create spec files, or manage project docs. Always include "Related Documents" sections to maintain context continuity across layers.
---

# Documentation Management Skill

이 스킬은 모든 프로젝트 문서의 **마스터 규칙**을 정의한다. 실제 문서 작성은 하위 스킬(`docs-plan`, `docs-dev`, `docs-pitch`, `docs-business`)이 담당하며, 이 스킬은 그것들이 따르는 공통 기준을 정의한다.

> **365 Principle** -- 프로젝트 품질과 시장 경쟁력을 보장하는 통합 프레임워크.
>
> | 숫자 | 의미 | 내용 |
> | :--- | :--- | :--- |
> | **3** | Investor Lenses | Leverage, Realistic Money Flow, Defensibility |
> | **6** | Global Rubric | Functionality, Impact, Novelty, UX, Open-source, Business Plan |
> | **5** | Documentation Layers | Concept_Design, UI_Screens, Technical_Specs, Logic_Progress, QA_Validation |

## 0. Global Rubric (6 Core Criteria)

모든 프로젝트는 아래 6가지 기준으로 설계·검증되어야 한다.

1. **Functionality**: 실제로 돌아가는가? 코드가 깔끔한가?
2. **Potential Impact**: TAM이 큰가? 생태계 기여도는?
3. **Novelty**: 기존에 없던 접근인가? 차별점이 명확한가?
4. **UX**: 성능을 UX로 전환했는가? (400ms 반응성 등)
5. **Open-source**: 다른 빌더가 쓸 수 있는가?
6. **Business Plan**: 지속 가능한 수익 모델이 있는가?

## 1. 공통 규칙

1. 이모지 금지. 전문적이고 명확한 텍스트로만 소통한다.
2. **Ask before Write**: 초안 작성 전 핵심 질문을 먼저 던진다.
3. 기존 문서가 있으면 먼저 읽고 컨텍스트를 유지하며 업데이트한다. 덮어쓰지 않는다.

## 2. 5-Layer 구조

| 순번 | 폴더명 | 역할 |
| :--- | :--- | :--- |
| 1 | `docs/01_Concept_Design/` | 비전, 제품 기획, 비즈니스 전략 |
| 2 | `docs/02_UI_Screens/` | UI 디자인 시스템, 화면 흐름, 프로토타입 리뷰 |
| 3 | `docs/03_Technical_Specs/` | DB 스키마, API 명세, 개발 원칙 |
| 4 | `docs/04_Logic_Progress/` | 로드맵, 백로그, 개발 일정, 비즈니스 로직, 알고리즘 |
| 5 | `docs/05_QA_Validation/` | 테스트 시나리오, QA 체크리스트, 검증 보고서 |

**Context Flow**:
- Concept_Design → UI_Screens (디자인 가이드라인)
- Concept_Design → Technical_Specs (기능 명세 기반)
- UI_Screens → Technical_Specs (구현 요구사항)
- Technical_Specs → Logic_Progress (비즈니스 로직 기반)
- 모든 레이어 → QA_Validation (테스트 시나리오 기반)

## 3. 레이어 판별

- 기획·제품 정의 → **01_Concept_Design**
- UI 디자인·화면 흐름 → **02_UI_Screens**
- DB, API, 개발 원칙 → **03_Technical_Specs**
- 로드맵·백로그·개발 일정·비즈니스 로직 → **04_Logic_Progress** (일정 문서는 반드시 여기에 생성하며, 모든 항목은 체크박스`[ ]`를 포함한 원자적 단위로 분할해야 함)
- 테스트·QA 보고 → **05_QA_Validation**

## 4. 파일 작성 규칙

### 네이밍

파일명 앞에 2자리 순번을 붙인다. 특히 **04_Logic_Progress**의 일정 문서는 다음 표준 명칭과 형식을 준수한다:
- `00_BACKLOG.md`: 작업 현황 관리 (ToDo/In Progress/Done 구분 및 체크박스 활용)
- `00_ROADMAP.md`: 마일스톤 및 단계별 일정 (Phase별 큰 줄기와 세부 항목 분할)
- `01_EXECUTION_PLAN.md`: 기술 실행 전략 및 타임라인 (구체적인 구현 스텝 및 체크박스 필수)

### 메타데이터 (필수)

모든 문서 최상단:
```markdown
# [Document Title]
> Created: YYYY-MM-DD HH:mm
> Last Updated: YYYY-MM-DD HH:mm
```

### Rubric-First Writing

문서 성격에 맞는 루브릭 항목을 본문에서 언급한다. QA_Validation 레이어는 6개 루브릭 전체 테이블이 필수다.

### Related Documents 섹션 (필수)

모든 문서 끝에 관련 문서 링크를 포함한다.

```markdown
## X. Related Documents
- **Layer Name**: [Document Title](./relative/path.md) - 관계 설명
```

링크 규칙:
- 반드시 상대 경로 사용
- 같은 레이어: `./02_LEAN_CANVAS.md`
- 다른 레이어: `../01_Concept_Design/03_PRODUCT_SPECS.md`
- 각 링크에 관계 설명 포함

## 5. Context Linking 규칙

**Concept_Design**: 같은 레이어 문서 + 관련 UI_Screens/Technical_Specs

**UI_Screens**: Concept_Design (Product Specs, UI Design) + 이전/다음 UI_Screens + Technical_Specs

**Technical_Specs**: Concept_Design + UI_Screens + 다른 Technical_Specs (DB ↔ API) + Logic_Progress

**Logic_Progress**: Concept_Design + UI_Screens + Technical_Specs (DB, API) + QA_Validation

**QA_Validation**: 모든 상위 레이어 참조

## 6. 스킬 위임 테이블

| 작업 | 스킬 |
|:---|:---|
| Layer 1-2 기획/UI 문서 | `docs-plan` |
| Layer 3-5 기술/로직/QA 문서 | `docs-dev` |
| 피치덱 | `docs-pitch` |
| 사업계획서 | `docs-business` |
| 리액트 컴포넌트 표준 | `rules-react` |
| 전체 파이프라인 진행 | `rules-product` |
| 문서 구조 검증 | `verify-docs` |

## 7. Best Practices

- **Keep it minimal**: 불필요한 내용 없이 정확하게.
- **Maintain context continuity**: Related Documents 섹션으로 레이어 간 연결 유지.
- **Preserve existing content**: 기존 문서 덮어쓰지 않기.
- **Update Last Updated**: 문서 수정 시 타임스탬프 갱신.
