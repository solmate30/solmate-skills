---
name: verify-skills
description: solmate-skills 패키지 자체를 검증합니다. SKILL.md frontmatter, agents/openai.yaml, CLI 목록, README/AGENTS 스킬 목록, 버전 문구, npm pack dry-run을 점검합니다. 스킬 추가·수정 후, 배포 전, 또는 "스킬 패키지 검증" 요청 시 사용합니다.
argument-hint: "[선택사항: 특정 스킬 이름 또는 점검 영역]"
---

# 스킬 패키지 검증 스킬 (verify-skills)

`solmate-skills` 저장소 자체의 배포 품질과 스킬 메타데이터 정합성을 검증한다.

---

## 실행 시점

- 새 스킬 추가 또는 기존 스킬 수정 후
- `bin/cli.js`, `README.md`, `AGENTS.md`, `package.json` 수정 후
- npm 배포 또는 태그 생성 전
- `rules-workflow` Step 17 또는 `verify-implementation` 실행 시

---

## Step 0: 검증 범위 확정

인자가 있으면 해당 스킬 또는 영역만 점검한다. 없으면 루트 패키지 전체를 점검한다.

```bash
find . -maxdepth 2 -name SKILL.md -print | sort
node bin/cli.js list
git status --short
```

---

## Check 1: 스킬 디렉터리와 CLI 목록

- 루트의 설치 가능한 스킬은 `SKILL.md`가 있는 디렉터리여야 한다.
- `.claude`, `.codex`, `hooks`, `bin`, `node_modules` 같은 비스킬 디렉터리가 CLI 목록에 나오면 Fail이다.

```bash
node bin/cli.js list
find . -maxdepth 2 -name SKILL.md -print | sed 's#^\./##; s#/SKILL.md$##' | sort
```

- 체크:
  - [ ] CLI 목록이 실제 `SKILL.md` 보유 디렉터리와 일치하는가?
  - [ ] 비스킬 디렉터리가 설치 대상으로 노출되지 않는가?
  - [ ] 새 verify 스킬이 README와 AGENTS 목록에 반영되었는가?

---

## Check 2: SKILL.md frontmatter

- 모든 `SKILL.md`가 YAML frontmatter를 갖고, `name`, `description`이 유효한지 확인한다.
- `name`은 소문자 hyphen-case여야 한다.

```bash
python3 -c 'import pathlib, yaml, re
for p in pathlib.Path(".").glob("*/SKILL.md"):
    text=p.read_text()
    m=re.match(r"^---\n(.*?)\n---", text, re.S)
    assert m, f"frontmatter missing: {p}"
    data=yaml.safe_load(m.group(1))
    assert data.get("name") and data.get("description"), f"name/description missing: {p}"
    assert re.match(r"^[a-z0-9-]+$", data["name"]), f"bad name: {p}"
print("frontmatter ok")'
```

- 체크:
  - [ ] 모든 `SKILL.md` frontmatter가 파싱되는가?
  - [ ] `name`과 폴더명이 불필요하게 어긋나지 않는가?
  - [ ] `description`이 사용 시점을 충분히 설명하는가?

---

## Check 3: agents/openai.yaml

- 루트에서 직접 추적하는 스킬은 `agents/openai.yaml`을 갖는 것이 원칙이다. `git ls-files -s`에서 mode `160000`으로 표시되는 gitlink 외부 확장은 제외한다.
- `interface.display_name`, `short_description`, `default_prompt`가 있어야 하며, `default_prompt`에는 `$skill-name`이 포함되어야 한다.

```bash
python3 -c 'import pathlib, subprocess, yaml
bad=[]
gitlinks=set()
for line in subprocess.run(["git", "ls-files", "-s"], capture_output=True, text=True).stdout.splitlines():
    parts=line.split()
    if len(parts) >= 4 and parts[0] == "160000":
        gitlinks.add(parts[3])
for skill in [p.parent for p in pathlib.Path(".").glob("*/SKILL.md")]:
    if skill.as_posix() in gitlinks:
        continue
    meta=skill/"agents/openai.yaml"
    if not meta.exists():
        bad.append(f"missing openai.yaml: {skill}")
        continue
    data=yaml.safe_load(meta.read_text())
    interface=data.get("interface", {})
    prompt=interface.get("default_prompt", "")
    if "$"+skill.name not in prompt:
        bad.append(f"default_prompt missing ${skill.name}: {meta}")
    if not (25 <= len(interface.get("short_description", "")) <= 64):
        bad.append(f"bad short_description: {meta}")
print("metadata ok" if not bad else "\n".join(bad))'
```

- 체크:
  - [ ] 각 스킬에 `agents/openai.yaml`이 있는가?
  - [ ] `short_description` 길이가 25-64자인가?
  - [ ] `default_prompt`가 해당 `$skill-name`을 명시하는가?

---

## Check 4: README, AGENTS, package 버전 동기화

- `package.json` 버전과 README의 최신 버전 문구가 일치하는지 확인한다.
- README와 AGENTS의 verify 목록이 실제 `verify-*` 디렉터리와 맞는지 확인한다.

```bash
node -p "require('./package.json').version"
grep -n "What's New in" README.md
find . -maxdepth 1 -type d -name 'verify-*' -exec basename {} \; | sort
grep -n "verify-" README.md AGENTS.md
```

- 체크:
  - [ ] README 최신 버전 문구가 `package.json`과 일치하는가?
  - [ ] README Available Skills에 새 스킬이 반영되었는가?
  - [ ] AGENTS.md 품질 검증 목록에 새 verify 스킬이 반영되었는가?

---

## Check 5: 패키징 검증

- npm 패키징 dry-run이 통과해야 한다.
- 사용자 홈 npm 캐시 권한 문제를 피하려면 임시 캐시를 사용할 수 있다.

```bash
npm_config_cache=/private/tmp/solmate-npm-cache npm pack --dry-run
```

- 체크:
  - [ ] dry-run이 성공하는가?
  - [ ] tarball 내용에 새 스킬 파일과 `agents/openai.yaml`이 포함되는가?
  - [ ] dry-run 후 실제 `.tgz` 파일이 작업트리에 남지 않았는가?

---

## 보고 형식

```
## 스킬 패키지 검증 결과

| 검사 항목 | 결과 | 비고 |
|:---|:---:|:---|
| CLI 목록 | Pass / Fail | |
| SKILL.md frontmatter | Pass / Fail | |
| agents/openai.yaml | Pass / Fail | |
| README/AGENTS 동기화 | Pass / Fail | |
| npm pack dry-run | Pass / Fail | |

### 수정 필요 항목
- [높음] ...
```

---

## Exceptions

1. **gitlink 외부 확장**: `ext-*`가 gitlink 또는 외부 소스 묶음이면 루트 저장소의 `agents/openai.yaml` 필수 대상에서 제외할 수 있다.
2. **실험 중인 로컬 스킬**: 배포 대상이 아니라고 명시된 로컬 실험 폴더는 CLI 설치 대상에서 제외되어야 한다.
3. **npm 캐시 권한 문제**: 사용자 홈 npm 캐시 권한 오류는 코드 Fail이 아니며, 임시 캐시로 재검증한다.

---

## 관련 스킬

- `manage-skills`: verify 스킬 드리프트 탐지
- `skill-creator`: 스킬 구조와 metadata 작성 기준
- `verify-docs`: 문서 레이어 검증
- `verify-implementation`: 전체 verify 스킬 통합 실행
