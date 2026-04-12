#!/usr/bin/env bash
# solmate-skills: watch-files.sh
# Event: PreToolUse (matcher: Read|Write|Edit|Bash)
# Purpose: Detect file patterns being modified and inject relevant skill suggestions.
# Output: JSON with hookSpecificOutput.additionalContext (non-blocking)

set -euo pipefail

INPUT=$(cat)

# Extract file path and tool name
FILE_PATH=$(echo "$INPUT" | python3 -c "
import sys, json
data = json.load(sys.stdin)
inp = data.get('tool_input', {})
# Write/Edit use file_path; Bash use command
print(inp.get('file_path', inp.get('command', '')))" 2>/dev/null || echo "")

TOOL_NAME=$(echo "$INPUT" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(data.get('tool_name', ''))" 2>/dev/null || echo "")

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

SUGGESTIONS=""

# --- File pattern matching ---

# Drizzle schema file → verify-drizzle-schema
if echo "$FILE_PATH" | grep -qiE 'schema\.(ts|js)|drizzle'; then
  SUGGESTIONS="$SUGGESTIONS\n- Drizzle 스키마 파일을 수정 중입니다. 작업 후 \`/verify-drizzle-schema\`로 스키마 정합성을 검증하세요."
fi

# .env files → verify-security
if echo "$FILE_PATH" | grep -qiE '\.env|\.env\.local|\.env\.production|\.env\.example'; then
  SUGGESTIONS="$SUGGESTIONS\n- 환경변수 파일을 수정 중입니다. \`/verify-security\` Check 1(시크릿 노출)을 실행하여 민감 정보 노출 여부를 확인하세요."
fi

# SKILL.md files → manage-skills
if echo "$FILE_PATH" | grep -qiE 'SKILL\.md'; then
  SUGGESTIONS="$SUGGESTIONS\n- 스킬 파일을 수정 중입니다. \`/manage-skills\`로 verify 스킬과의 정합성 드리프트를 점검하세요."
fi

# Page/route files → verify-performance
if echo "$FILE_PATH" | grep -qiE 'page\.(tsx|jsx|ts|js)|route\.(tsx|jsx|ts|js)|layout\.(tsx|jsx)'; then
  SUGGESTIONS="$SUGGESTIONS\n- 페이지·라우트 파일을 수정 중입니다. 작업 후 \`/verify-performance\`로 Core Web Vitals 및 렌더링 전략을 점검하세요."
fi

# API route files → verify-security
if echo "$FILE_PATH" | grep -qiE 'api/.*route\.(ts|js)|api/.*index\.(ts|js)|\bapi\b.*\.(ts|js)'; then
  SUGGESTIONS="$SUGGESTIONS\n- API 라우트 파일을 수정 중입니다. 작업 후 \`/verify-security\` Check 2(인증·인가) 및 Check 5(CSRF)를 점검하세요."
fi

# Auth-related files → verify-security
if echo "$FILE_PATH" | grep -qiE 'auth\.(ts|js|tsx)|middleware\.(ts|js)|session\.(ts|js)'; then
  SUGGESTIONS="$SUGGESTIONS\n- 인증·미들웨어 파일을 수정 중입니다. \`/verify-security\`로 인증·인가 취약점을 점검하세요."
fi

# Documentation files → verify-docs
if echo "$FILE_PATH" | grep -qiE 'docs/(01|02|03|04|05)_.*\.md'; then
  SUGGESTIONS="$SUGGESTIONS\n- 문서 레이어 파일을 수정 중입니다. 작업 후 \`/verify-docs\`로 메타데이터 및 구조 정합성을 검증하세요."
fi

# AGENTS.md → remind about skill count
if echo "$FILE_PATH" | grep -qiE 'AGENTS\.md'; then
  SUGGESTIONS="$SUGGESTIONS\n- AGENTS.md를 수정 중입니다. 스킬 목록·개수가 변경된 경우 Section 4의 테이블과 개수를 함께 업데이트하세요."
fi

if [ -z "$SUGGESTIONS" ]; then
  exit 0
fi

python3 -c "
import json, sys
suggestions = sys.argv[1]
output = {
    'hookSpecificOutput': {
        'hookEventName': 'PreToolUse',
        'additionalContext': '[Solmate Skills 파일 감지]\n' + suggestions.strip()
    }
}
print(json.dumps(output))
" "$SUGGESTIONS"
