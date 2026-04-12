---
name: docs-pitch
description: Create compelling pitch decks for investors, hackathons, and competitions. Supports two output modes — Markdown (content-first) or Reveal.js HTML (browser presentation). Applies the 3 Investor Lenses and 6 Global Rubrics. Use when preparing for investor meetings, competition submissions, or demo days. Integrates with docs-plan Layer 1 documents.
---

# Pitch Documentation Skill (Pitch Deck)

This skill creates pitch decks optimized for investors, hackathon judges, and competition reviewers.
**Output mode는 상황에 따라 선택한다** — Markdown, Reveal.js HTML 중 하나.

> This skill reads from `docs-plan` Layer 1 documents (VISION_CORE, LEAN_CANVAS, PRODUCT_SPECS) as source material. Run `docs-plan` first if those documents don't exist yet.

## 1. Rules

1. 이모지 금지. 전문적이고 명확한 텍스트로만 소통한다.
2. Ask before Write: 아래 Phase 질문을 먼저 던지고 답변을 바탕으로 작성한다.
3. 기존 PITCH_DECK.md가 있으면 반드시 먼저 읽고 컨텍스트를 유지하며 업데이트한다.
4. 모든 주장은 수치, 사례, 증거로 뒷받침한다. 추측 기반 문장 금지.

## 2. 핵심 평가 프레임워크

피치덱의 모든 내용은 두 가지 프레임워크를 통과해야 한다.

### 2.1. 3 Investor Lenses

| Lens | 질문 | 통과 기준 |
|:---|:---|:---|
| **Leverage** | 내가 커질 때 생태계도 함께 커지는가? | 네트워크 효과, 플랫폼 확장성 증명 가능 |
| **Realistic Money Flow** | "어떻게 돈 버는가?"에 군더더기 없이 답할 수 있는가? | 수익 경로가 1-2문장으로 설명됨 |
| **Defensibility** | 시간이 흐를수록 따라오기 힘든 해자(Moat)는 무엇인가? | 데이터, 네트워크, 특허, 브랜드 중 하나 이상 |

### 2.2. 6 Global Rubrics (목표: 4개 이상 강점)

| Criterion | 피치에서의 질문 |
|:---|:---|
| **Functionality** | 실제로 작동하는 MVP가 있는가? |
| **Potential Impact** | TAM이 크고 생태계 기여도가 명확한가? |
| **Novelty** | 기존에 없던 접근인가? 차별점이 한 문장으로 설명되는가? |
| **UX** | 기술적 성능이 체감 가능한 UX로 전환되었는가? (400ms 등) |
| **Open-source** | 다른 빌더가 위에서 만들 수 있는가? |
| **Business Plan** | 지속 가능한 수익 모델이 있는가? |

## 3. Interactive Process (Ask Before Write)

### Phase 0 — 출력 모드 선택 (첫 번째 질문)

시작 전 반드시 출력 모드를 확인한다.

| 모드 | 언제 선택하는가 | 출력물 |
|:---|:---|:---|
| **A. Markdown** | 내용 작성이 목적, 노션/Slides.com 등 외부 도구로 옮길 예정 | `docs/01_Concept_Design/XX_PITCH_DECK.md` |
| **B. Reveal.js HTML** | 브라우저에서 바로 발표, GitHub Pages 배포 예정 | `pitch/index.html` |

> 모드를 명시하지 않으면 목적과 청중을 파악한 뒤 권장 모드를 제안한다.

### Phase 1 — 기본 정보 수집

1. **목적과 청중**: 이 피치덱의 목적은? (투자 유치 / 해커톤 / 데모데이 / 경쟁 제출) 청중은 누구인가?
2. **시간 제약**: 발표 시간은? (3분 / 5분 / 10분) 슬라이드 수 제한이 있는가?
3. **현재 단계**: 팀 구성은? 개발 진행 상태는? (아이디어 / 프로토타입 / MVP / 실제 사용자 보유)
4. **보유 증거**: 수치로 증명할 수 있는 것은? (사용자 수, 전환율, 매출, 인터뷰 수 등)

### Phase 2 — 스토리 구조 결정

5. **문제의 긴박성**: 이 문제가 지금 당장 해결되어야 하는 이유는? 현재 대안의 한계는?
6. **"Aha" 순간**: 우리 솔루션을 처음 본 사람이 "이거다"라고 느끼는 순간은 언제인가?
7. **Moat 선택**: 우리의 핵심 해자는? (데이터 축적 / 네트워크 효과 / 기술 특허 / 브랜드 / 독점 파트너십)
8. **Ask**: 무엇을 요청하는가? (투자금액 / 파트너십 / 멘토링 / 상금)

## 4. 표준 피치덱 구조 (10 Slides)

각 슬라이드의 핵심 메시지는 **1문장**으로 요약되어야 한다.

### Slide 1 — Hook (첫인상)
- **목적**: 3초 안에 청중의 주의를 잡는다.
- **포함 내용**: 제품명, 한 줄 설명(tagline), 시각적으로 강렬한 문제 제시
- **체크**: "이게 뭔지 바로 이해되는가?"

### Slide 2 — Problem (문제)
- **목적**: 청중이 문제의 심각성에 공감하게 한다.
- **포함 내용**: 구체적인 Pain Point, 현재 대안의 한계, 문제의 규모(수치)
- **체크**: "이 문제가 지금 당장 해결되어야 한다는 긴박감이 느껴지는가?"

### Slide 3 — Solution (솔루션)
- **목적**: "Aha" 순간을 만든다.
- **포함 내용**: 핵심 기능 1-3가지, 작동 방식 간략 설명, 스크린샷 또는 데모 링크
- **체크**: "문제와 솔루션이 직접 연결되는가?"

### Slide 4 — Market Size (시장 규모)
- **목적**: Leverage Lens 통과 — 충분히 큰 시장임을 증명한다.
- **포함 내용**: TAM / SAM / SOM 수치, 출처 명시, 성장률 트렌드
- **체크**: "TAM이 투자 가능한 규모(최소 $1B+)인가?"

### Slide 5 — Product (제품 상세)
- **목적**: Functionality Rubric 통과 — 실제로 작동함을 증명한다.
- **포함 내용**: 핵심 유저 플로우(3단계 이내), 주요 기능 스크린샷, 기술적 차별점
- **체크**: "MVP가 실제로 존재하는가?"

### Slide 6 — Business Model (비즈니스 모델)
- **목적**: Realistic Money Flow Lens 통과 — 수익 경로가 명확함을 증명한다.
- **포함 내용**: 수익 모델(구독 / 거래 수수료 / 광고 / API 과금 등), 단위 경제(LTV, CAC), 가격 정책
- **체크**: "어떻게 돈 버는지 1-2문장으로 설명 가능한가?"

### Slide 7 — Traction (견인력)
- **목적**: 시장 검증 증거를 제시한다.
- **포함 내용**: 사용자 수 / 성장률 / 매출 / 파트너십 / 미디어 언급 / 사용자 인터뷰 인용
- **체크**: "숫자가 있는가? 추측이 아닌 증거인가?"

### Slide 8 — Competition (경쟁 분석)
- **목적**: Defensibility Lens 통과 — 우리만의 해자를 증명한다.
- **포함 내용**: 경쟁사 비교 매트릭스, 우리의 독점적 우위, Moat의 지속 가능성
- **체크**: "왜 우리가 이기는지 명확한가? '더 빠르다'는 이유가 되지 않는다."

### Slide 9 — Team (팀)
- **목적**: "이 팀이 이 문제를 해결할 수 있는 유일한 팀인가?"를 납득시킨다.
- **포함 내용**: 핵심 멤버 이름/역할/관련 경력, 이 문제를 해결하는 데 특별한 이유(Unfair Advantage)
- **체크**: "팀이 이 문제와 필연적으로 연결되어 있는가?"

### Slide 10 — Ask (요청)
- **목적**: 청중이 다음에 무엇을 해야 하는지 명확하게 한다.
- **포함 내용**: 요청 사항 (금액 / 파트너십 / 멘토링), 자금 사용 계획, 6-18개월 마일스톤
- **체크**: "Call to Action이 구체적이고 실행 가능한가?"

## 5. 3분 스토리텔링 스크립트 구조

발표 시간이 3분일 경우 아래 시간 배분을 따른다.

| 시간 | 내용 | 목적 |
|:---|:---|:---|
| 0:00-0:20 | Hook + Problem | 공감 형성 |
| 0:20-0:50 | Solution + Demo | "Aha" 순간 |
| 0:50-1:20 | Market + Traction | 규모와 증거 |
| 1:20-1:50 | Business Model + Moat | 수익성과 지속성 |
| 1:50-2:20 | Team | 신뢰 형성 |
| 2:20-2:45 | Ask + Milestones | Call to Action |
| 2:45-3:00 | Closing Hook | 기억에 남기기 |

## 6. 출력 형식 (모드별)

### Mode A — Markdown

저장 경로: `docs/01_Concept_Design/XX_PITCH_DECK.md`

```
# Pitch Deck: [Product Name]
> Created: YYYY-MM-DD HH:mm
> Last Updated: YYYY-MM-DD HH:mm
> Target: [투자자 / 해커톤명 / 데모데이명]
> Format: [슬라이드 수] slides / [발표 시간]

## Investor Lens Check
- Leverage:
- Realistic Money Flow:
- Defensibility:

## Rubric Score
| Criterion | Score (1-5) | Evidence |
...

## Slide 1 — Hook
**One-line message:**
**Content:**

## Slide 2 — Problem
...

## 3-Minute Script (Optional)
...

## Related Documents
<!-- 아래 경로는 이 스킬을 사용하는 실제 프로젝트 기준입니다. solmate-skills 저장소에 존재하는 파일이 아닙니다. -->
- **Concept_Design**: [Vision & Core Values] — ../01_Concept_Design/01_VISION_CORE.md
- **Concept_Design**: [Lean Canvas] — ../01_Concept_Design/02_LEAN_CANVAS.md
- **Concept_Design**: [Product Specs] — ../01_Concept_Design/03_PRODUCT_SPECS.md
```

---

### Mode B — Reveal.js HTML

저장 경로: `pitch/index.html`

**실행 절차:**

1. `pitch/` 디렉토리 생성
2. CDN 방식으로 Reveal.js 로드 (별도 설치 불필요):
   ```html
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js/dist/reveal.css">
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js/dist/theme/black.css">
   <script src="https://cdn.jsdelivr.net/npm/reveal.js/dist/reveal.js"></script>
   ```
3. 각 슬라이드는 `<section>` 태그로 구성
4. 발표 후 `npx serve pitch/` 또는 GitHub Pages로 공유

**슬라이드 구조 템플릿:**
```
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>[Product Name] Pitch</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js/dist/reveal.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js/dist/theme/black.css">
  <style>
    /* 브랜드 색상 오버라이드 */
    :root { --r-background-color: #0f0f0f; --r-main-color: #ffffff; }
    .highlight { color: #your-brand-color; }
  </style>
</head>
<body>
  <div class="reveal">
    <div class="slides">
      <section> <!-- Slide 1: Hook --> </section>
      <section> <!-- Slide 2: Problem --> </section>
      <!-- ... 10 slides total -->
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js/dist/reveal.js"></script>
  <script>Reveal.initialize({ hash: true, transition: 'fade' });</script>
</body>
</html>
```

**키보드 단축키**: 방향키로 슬라이드 이동, `F`로 전체화면, `S`로 발표자 노트

---

---

## 7. Common Pitfalls

| 피해야 할 것 | 이유 |
|:---|:---|
| "우리에겐 경쟁자가 없다" | 신뢰 붕괴. 모든 문제엔 현재 대안이 존재한다. |
| 기술 스택 나열 | 투자자는 기술이 아닌 임팩트에 투자한다. |
| 수치 없는 주장 | "빠르게 성장 중" 대신 "MoM 30% 성장" |
| 10개 이상의 핵심 기능 | 집중력 분산. 핵심 1-3개만. |
| Ask 없이 마무리 | 청중이 다음 행동을 모르면 연결이 끊긴다. |
| 팀 슬라이드 생략 | 초기 스타트업은 팀이 곧 제품이다. |

## 8. Related Skills

- **docs-plan**: 피치덱의 원천 데이터 (VISION_CORE, LEAN_CANVAS, PRODUCT_SPECS)
- **rules-docs**: 공통 문서 규칙 및 365 Principle 정의
- **verify-docs**: 작성된 문서 구조/메타데이터 검증
