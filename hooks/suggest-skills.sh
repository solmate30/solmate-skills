#!/usr/bin/env bash
# solmate-skills: suggest-skills.sh
# Event: UserPromptSubmit
# Purpose: Detect keywords in user prompt and inject skill suggestions as context.
# Output: JSON with hookSpecificOutput.additionalContext (non-blocking)

set -euo pipefail

# Read stdin JSON
INPUT=$(cat)

# Extract the user prompt text
PROMPT=$(echo "$INPUT" | python3 -c "
import sys, json
data = json.load(sys.stdin)
# UserPromptSubmit provides 'prompt' field
print(data.get('prompt', ''))
" 2>/dev/null || echo "")

if [ -z "$PROMPT" ]; then
  exit 0
fi

SUGGESTIONS=""

# --- Keyword matching (Korean + English) ---

# Decision / Design → manage-decisions
if echo "$PROMPT" | grep -qiE '결정|설계|어떻게 할|어떤 방식|DB 스키마|테이블|API 구조|아키텍처|폴더 구조|기능 범위|MVP|스택|라이브러리|어떤 거|어떤게'; then
  SUGGESTIONS="$SUGGESTIONS\n- 결정이 필요한 상황입니다. \`/manage-decisions\`를 실행하면 유형별 질문 템플릿으로 대화를 통해 결정을 이끌어냅니다."
fi

# Security → verify-security
if echo "$PROMPT" | grep -qiE '보안|security|취약|OWASP|인증|인가|token|jwt|secret|API ?key|sql|injection|xss|csrf'; then
  SUGGESTIONS="$SUGGESTIONS\n- 보안 관련 작업입니다. \`/verify-security\`로 OWASP Top 10 기준 점검을 실행하세요."
fi

# Performance → verify-performance
if echo "$PROMPT" | grep -qiE '성능|performance|lighthouse|느리|느림|최적화|LCP|CLS|FID|번들|bundle|이미지 최적|lazy|loading'; then
  SUGGESTIONS="$SUGGESTIONS\n- 성능 관련 작업입니다. \`/verify-performance\`로 Lighthouse 및 Core Web Vitals 점검을 실행하세요."
fi

# PR / Commit / Code review → verify-code
if echo "$PROMPT" | grep -qiE 'PR|pull ?request|코드 ?리뷰|review|commit|머지|merge|배포 전|pre-deploy'; then
  SUGGESTIONS="$SUGGESTIONS\n- PR 또는 배포 전 점검입니다. \`/verify-code\`로 코드 품질을 종합 리뷰하고, \`/verify-implementation\`으로 전체 verify-* 스킬을 통합 실행하세요."
fi

# Documentation → verify-docs / docs-plan / docs-dev
if echo "$PROMPT" | grep -qiE '문서|docs?|README|VISION|LEAN_CANVAS|PRODUCT_SPECS|API_SPECS|DB_SCHEMA|ROADMAP|백로그|backlog'; then
  SUGGESTIONS="$SUGGESTIONS\n- 문서 작업입니다. 기획·UI 문서는 \`/docs-plan\`, 기술·진행·QA 문서는 \`/docs-dev\`, 문서 구조 검증은 \`/verify-docs\`를 사용하세요."
fi

# Feature implementation / workflow → rules-workflow
if echo "$PROMPT" | grep -qiE '기능 ?구현|구현|implement|feature|작업 ?시작|어디서 ?시작|어떻게 ?시작|개발 ?시작|시작할게'; then
  SUGGESTIONS="$SUGGESTIONS\n- 기능 구현을 시작하려 합니다. \`/rules-workflow\`로 18단계 워크플로우를 따라 계획부터 PR까지 진행하세요."
fi

# React / UI component → rules-react
if echo "$PROMPT" | grep -qiE 'React|컴포넌트|component|페이지|page|UI|화면|shadcn|tailwind'; then
  SUGGESTIONS="$SUGGESTIONS\n- React/UI 작업입니다. \`/rules-react\`로 컴포넌트 설계 기준을 확인하고, shadcn/ui 활용은 \`/tools-shadcn\`을 사용하세요."
fi

# Drizzle / DB schema → verify-drizzle-schema
if echo "$PROMPT" | grep -qiE 'drizzle|schema\.ts|마이그레이션|migration|pgTable|sqliteTable'; then
  SUGGESTIONS="$SUGGESTIONS\n- Drizzle 스키마 작업입니다. \`/verify-drizzle-schema\`로 스키마 정합성을 검증하세요."
fi

# New project / product pipeline → rules-product
if echo "$PROMPT" | grep -qiE '새 프로젝트|신규 프로젝트|프로젝트 시작|어디서 시작|뭐부터|처음부터|from scratch'; then
  SUGGESTIONS="$SUGGESTIONS\n- 새 프로젝트입니다. \`/rules-product\`를 실행하면 현재 단계를 자동 진단하고 올바른 스킬로 안내합니다."
fi

# Pitch deck / business plan → docs-pitch / docs-business
if echo "$PROMPT" | grep -qiE '피치|pitch|투자|investor|사업 ?계획|business ?plan|데모데이|해커톤'; then
  SUGGESTIONS="$SUGGESTIONS\n- 발표·투자 자료 작업입니다. 피치덱은 \`/docs-pitch\`, 사업계획서는 \`/docs-business\`를 사용하세요."
fi

# If no suggestions, exit silently
if [ -z "$SUGGESTIONS" ]; then
  exit 0
fi

# Output JSON with additionalContext (non-blocking)
python3 -c "
import json, sys
suggestions = sys.argv[1]
output = {
    'hookSpecificOutput': {
        'hookEventName': 'UserPromptSubmit',
        'additionalContext': '[Solmate Skills 제안]\n' + suggestions.strip()
    }
}
print(json.dumps(output))
" "$SUGGESTIONS"
