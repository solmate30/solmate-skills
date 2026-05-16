#!/bin/bash
# Claude Stop 훅: git 변경 파일을 분석하여 적절한 verify-* 스킬을 제안합니다

python3 - <<'PYEOF'
import subprocess, json

r = subprocess.run(['git', 'diff', '--name-only', 'HEAD'], capture_output=True, text=True)
files = [f for f in r.stdout.strip().split('\n') if f]

if not files:
    exit()

s = []

if any('schema' in f and (f.endswith('.ts') or f.endswith('.sql')) for f in files):
    s.append('  DB 스키마 변경 감지    →  /verify-drizzle-schema')

if any(f.endswith(('.tsx', '.jsx')) or f.startswith('docs/02_UI_Screens/') for f in files):
    s.append('  UI/화면 변경 감지      →  /verify-ui')

if any(any(k in f.lower() for k in ('auth', 'middleware', 'api', 'route', 'token', 'session'))
       and (f.endswith('.ts') or f.endswith('.tsx')) for f in files):
    s.append('  인증/API 파일 변경 감지 →  /verify-security')

if any(f.endswith('.ts') or f.endswith('.tsx') for f in files):
    s.append('  코드 파일 변경 감지    →  /verify-code')

if any(f.endswith('.md') for f in files):
    s.append('  문서 파일 변경 감지    →  /verify-docs')

if any(
    f.endswith('/SKILL.md')
    or f.endswith('/agents/openai.yaml')
    or f in ('bin/cli.js', 'package.json', 'README.md', 'AGENTS.md')
    for f in files
):
    s.append('  스킬 패키지 변경 감지  →  /verify-skills')

if s:
    msg = '[ 검증 시점 알림 ]\n' + '\n'.join(s)
    print(json.dumps({'systemMessage': msg}))
PYEOF
