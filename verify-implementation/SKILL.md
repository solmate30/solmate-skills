---
name: verify-implementation
description: 프로젝트의 모든 verify 스킬을 동적으로 탐색하여 순차 실행하고 통합 검증 보고서를 생성합니다.
disable-model-invocation: true
argument-hint: "[선택사항: 특정 verify 스킬 이름]"
---

# 구현 검증 (Master)

## 목적

프로젝트에 존재하는 모든 `verify-*` 스킬을 동적으로 탐색하여 순차적으로 실행하고 통합 검증을 수행합니다. 기본 순서를 따르되, 변경 파일과 프로젝트 특성에 따라 해당 없는 스킬은 `N/A - 사유`로 기록합니다.

## 기본 실행 순서

| 순서 | 스킬 | 목적 |
|---:|---|---|
| 1 | `verify-docs` | 문서 구조, Backlog Context Lock, UI-First Gate 검증 |
| 2 | `verify-ui` | 구현 UI와 화면 문서, 사용자 동선, 상태별 UI 일치 검증 |
| 3 | `verify-code` | 코드 품질, 타입, 로직, 사이드 이펙트 검증 |
| 4 | `verify-security` | 인증·인가·입력·시크릿·OWASP 보안 검증 |
| 5 | `verify-performance` | Lighthouse, Core Web Vitals, 렌더링·번들 검증 |
| 6 | `verify-drizzle-schema` | DB 스키마 변경 시 명세·관계·인덱스 검증 |
| 7 | `verify-skills` | solmate-skills 패키지 자체 변경 시 스킬 메타데이터·CLI·패키징 검증 |

## 워크플로우

### Step 1: 동적 스킬 탐색
`.agent/skills/`, `.claude/commands/`, 또는 현재 저장소 하위의 `verify-*` 패턴을 탐색합니다.

### Step 2: 변경 파일 기반 실행 계획 수립
`git diff --name-only HEAD` 기준으로 실행 대상을 정합니다.

- 문서 변경: `verify-docs`
- TS/TSX/JS/JSX 변경: `verify-code`
- TSX/JSX 화면 변경: `verify-ui`
- auth/api/middleware/env/db 변경: `verify-security`
- page/layout/image/font/bundle 관련 변경: `verify-performance`
- schema/migration 변경: `verify-drizzle-schema`
- `SKILL.md`, `agents/openai.yaml`, `bin/cli.js`, `README.md`, `AGENTS.md`, `package.json` 변경: `verify-skills`

### Step 3: 순차 실행
기본 실행 순서대로 각 스킬의 `Workflow`, `Exceptions`, `Related Files`를 파싱하여 개별 검사를 수행합니다. 앞 단계가 Fail이면 뒤 단계는 실행하되, 해당 Fail이 뒤 단계 판단을 왜곡하는 경우 `Blocked - 사유`로 표시합니다.

### Step 4: 통합 보고서 생성
PASS/FAIL 통계와 발견된 이슈 목록을 생성합니다.

### Step 5: 수정 옵션 제공
자동 수정 또는 개별 수정을 사용자에게 제안합니다.

### Step 6: 수정 적용 및 재검증
수정이 적용된 경우 해당 스킬을 다시 실행하여 통과 여부를 최종 확인합니다.

## 보고 형식

```
## 통합 구현 검증 결과

| 순서 | 스킬 | 결과 | 비고 |
|---:|---|:---:|---|
| 1 | verify-docs | Pass / Fail / N/A | |
| 2 | verify-ui | Pass / Fail / N/A | |
| 3 | verify-code | Pass / Fail / N/A | |
| 4 | verify-security | Pass / Fail / N/A | |
| 5 | verify-performance | Pass / Fail / N/A | |
| 6 | verify-drizzle-schema | Pass / Fail / N/A | |
| 7 | verify-skills | Pass / Fail / N/A | |

### 배포/PR 차단 항목
- [높음] ...

### 재검증 필요 항목
- ...
```

## 예외사항
1. **자기 자신** (`verify-implementation`)은 실행 대상에서 제외.
2. **관리 스킬** (`manage-skills` 등)은 `verify-`로 시작하지 않으므로 제외.
3. **해당 없음**: DB, UI, 패키지 메타데이터 등 변경 범위와 관련 없는 검증은 `N/A - 사유`로 기록.
