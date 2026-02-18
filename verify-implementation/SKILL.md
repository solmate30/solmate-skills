---
name: verify-implementation
description: 프로젝트의 모든 verify 스킬을 동적으로 탐색하여 순차 실행하고 통합 검증 보고서를 생성합니다.
disable-model-invocation: true
argument-hint: "[선택사항: 특정 verify 스킬 이름]"
---

# 구현 검증 (Master Template)

## 목적

프로젝트에 존재하는 모든 `verify-*` 스킬을 동적으로 탐색하여 순차적으로 실행하고 통합 검증을 수행합니다.

## 실행 대상 스킬 (Dynamic)

| # | 스킬 | 설명 |
|---|------|------|
| * | `verify-*` | `.agent/skills` 또는 `.claude/commands`에서 자동 탐색 |

## 워크플로우

### Step 1: 동적 스킬 탐색
`.agent/skills/` 및 `.claude/commands/` 하위의 `verify-*` 패턴을 탐색합니다.

### Step 2: 순차 실행
각 스킬의 `Workflow`, `Exceptions`, `Related Files`를 파싱하여 개별 검사를 수행합니다.

### Step 3: 통합 보고서 생성
PASS/FAIL 통계와 발견된 이슈 목록을 생성합니다.

### Step 4: 수정 옵션 제공
자동 수정 또는 개별 수정을 사용자에게 제안합니다.

### Step 5: 수정 적용 및 재검증
수정이 적용된 경우 해당 스킬을 다시 실행하여 통과 여부를 최종 확인합니다.

## 예외사항
1. **자기 자신** (`verify-implementation`)은 실행 대상에서 제외.
2. **관리 스킬** (`manage-skills` 등)은 `verify-`로 시작하지 않으므로 제외.
