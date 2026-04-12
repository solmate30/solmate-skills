---
name: verify-security
description: 코드베이스의 보안 취약점을 점검합니다. OWASP Top 10 기준으로 인증·인가, 입력 검증, 시크릿 노출, SQL/XSS/CSRF 등 핵심 보안 이슈를 체계적으로 검증합니다. 보안 점검 요청, PR 전 보안 리뷰, 또는 "보안 확인해줘" 요청 시 사용합니다.
argument-hint: "[선택사항: 점검할 파일 경로, 기능명, 또는 집중 영역(예: auth, api, db)]"
---

# 보안 점검 스킬 (verify-security)

OWASP Top 10 및 프로젝트 공통 보안 기준에 따라 코드베이스의 보안 취약점을 검증합니다. 발견된 이슈를 심각도와 함께 보고하고 수정 방향을 제시합니다.

---

## 실행 시점

- PR 전 보안 최종 검토
- 인증·인가·API·DB 관련 코드 변경 후
- 새 외부 입력 처리 경로(폼, URL 파라미터, 파일 업로드) 추가 시
- `rules-workflow` Step 7 (버그·크리티컬·보안 검토) 수행 시
- "보안 점검해줘", "취약점 확인해줘" 요청 시

---

## Step 0: 점검 범위 확정

인자가 주어진 경우 해당 영역에 집중한다. 없으면 아래 명령으로 변경 파일을 확인하고 보안 관련 파일(auth, api, middleware, db, env)을 우선 점검한다.

```bash
git diff --name-only HEAD
```

보안 관련 파일 빠른 탐색:
```bash
# 인증·인가 관련
grep -rn "session\|token\|cookie\|jwt\|auth" src/ --include="*.ts" --include="*.tsx" -l

# 환경변수·시크릿 관련
grep -rn "process\.env\|NEXT_PUBLIC_" src/ --include="*.ts" --include="*.tsx" -l

# DB 쿼리 관련
grep -rn "sql\|query\|execute\|prepare" src/ --include="*.ts" -l
```

---

## Check 1: 시크릿 및 민감 정보 노출

**OWASP A02: Cryptographic Failures**

- 소스코드에 API 키, 비밀번호, JWT 시크릿 등이 하드코딩되어 있는지 확인한다.
- `NEXT_PUBLIC_` 접두어가 붙은 환경변수에 민감 정보가 포함되어 있는지 확인한다 (클라이언트에 노출됨).
- `.env*` 파일이 `.gitignore`에 포함되어 있는지 확인한다.

```bash
# 하드코딩 시크릿 탐지
grep -rn "sk-\|API_KEY\|SECRET\|PASSWORD\|private_key" src/ --include="*.ts" --include="*.tsx"
grep -rn "NEXT_PUBLIC_.*SECRET\|NEXT_PUBLIC_.*KEY\|NEXT_PUBLIC_.*TOKEN" src/
```

- 체크:
  - [ ] 코드에 하드코딩된 시크릿이 없는가?
  - [ ] 민감 정보가 `NEXT_PUBLIC_` 환경변수에 없는가?
  - [ ] `.env*`가 `.gitignore`에 포함되어 있는가?

---

## Check 2: 인증 및 인가

**OWASP A01: Broken Access Control**

- 보호된 API 라우트·페이지에서 세션/토큰 검증이 수행되는지 확인한다.
- 사용자 ID, 역할(role)을 클라이언트 파라미터로 받아 신뢰하지 않는지 확인한다 (서버에서 세션 기반으로 결정해야 함).
- 관리자 전용 기능에 역할 검증이 적용되어 있는지 확인한다.
- 체크:
  - [ ] 모든 보호 라우트에 인증 미들웨어·검증이 있는가?
  - [ ] 역할·권한을 서버 세션에서 결정하는가? (클라이언트 파라미터 신뢰 금지)
  - [ ] 인증되지 않은 요청이 데이터를 반환하지 않는가?

---

## Check 3: 입력 검증 및 XSS

**OWASP A03: Injection / A07: XSS**

- 외부 입력(폼, URL 파라미터, 헤더)에 Zod 등 스키마 검증이 적용되었는지 확인한다.
- `dangerouslySetInnerHTML` 사용 여부를 확인하고 입력값이 그대로 주입되지 않는지 점검한다.
- URL 파라미터를 URL 생성이나 리다이렉트에 사용할 때 검증 없이 넣지 않는지 확인한다.

```bash
grep -rn "dangerouslySetInnerHTML" src/ --include="*.tsx"
grep -rn "innerHTML\|document\.write" src/ --include="*.ts" --include="*.tsx"
```

- 체크:
  - [ ] 모든 외부 입력에 런타임 스키마 검증이 적용되었는가?
  - [ ] `dangerouslySetInnerHTML` 사용 시 값이 sanitize되었는가?
  - [ ] XSS 주입이 가능한 경로가 없는가?

---

## Check 4: SQL 인젝션 및 DB 안전성

**OWASP A03: Injection**

- 사용자 입력을 SQL 쿼리 문자열에 직접 삽입하는지 확인한다. ORM(Drizzle 등)의 파라미터 바인딩을 사용해야 한다.
- Raw query 사용 시 파라미터가 바인딩 방식으로 전달되는지 점검한다.
- 삭제·대량 업데이트 쿼리에 `WHERE` 조건이 누락되지 않았는지 확인한다.

```bash
grep -rn "sql\`\|execute(\|query(" src/ --include="*.ts" -A 3
```

- 체크:
  - [ ] 사용자 입력이 쿼리 문자열에 직접 삽입되지 않는가?
  - [ ] Raw query 사용 시 파라미터 바인딩이 적용되었는가?
  - [ ] 삭제·업데이트 쿼리에 WHERE 조건이 있는가?

---

## Check 5: CSRF 및 API 보안

**OWASP A01: Broken Access Control**

- 상태 변경(POST/PUT/DELETE) API에 CSRF 토큰 또는 SameSite 쿠키 설정이 적용되어 있는지 확인한다.
- API 라우트에서 HTTP 메서드 제한이 적용되어 있는지 확인한다 (GET 라우트가 쓰기 동작을 하지 않는가).
- Rate limiting이 없는 인증·OTP·비밀번호 변경 API가 있는지 확인한다.
- 체크:
  - [ ] 상태 변경 API에 CSRF 방어가 적용되었는가?
  - [ ] GET 라우트가 데이터를 변경하지 않는가?
  - [ ] 민감 API에 rate limiting이 적용되었는가?

---

## Check 6: 의존성 취약점

**OWASP A06: Vulnerable and Outdated Components**

- 알려진 취약점이 있는 패키지가 있는지 확인한다.

```bash
npm audit --audit-level=high
```

- 체크:
  - [ ] `npm audit` 결과 high/critical 취약점이 없는가?
  - [ ] 사용하지 않는 패키지가 정리되었는가?

---

## Check 7: 로깅 및 에러 노출

**OWASP A09: Security Logging and Monitoring Failures**

- 에러 응답에 스택 트레이스, DB 쿼리, 내부 경로 등 민감 정보가 포함되지 않는지 확인한다.
- 클라이언트에 반환하는 에러 메시지가 내부 구현을 노출하지 않는지 점검한다.

```bash
grep -rn "catch.*console\|catch.*res\.json\|catch.*res\.send" src/ --include="*.ts" -A 2
```

- 체크:
  - [ ] 에러 응답에 스택 트레이스가 포함되지 않는가?
  - [ ] 에러 메시지가 내부 구현을 노출하지 않는가?

---

## 보고 형식

점검 결과는 다음 형식으로 보고한다:

```
## 보안 점검 결과

### PASS 항목
- (문제 없는 체크 요약)

### 취약점 발견 항목
| 위치 | OWASP | 내용 | 심각도 |
|------|-------|------|:------:|
| src/api/user.ts:30 | A01 | 역할 검증 없이 관리자 데이터 반환 | 높음 |
| src/components/Post.tsx:12 | A03 | dangerouslySetInnerHTML에 미검증 값 삽입 | 높음 |
| .env.local | A02 | .gitignore 미등록 | 높음 |

### 수정 방향
1. [높음] ...
2. [중] ...
```

심각도 기준: **높음** (즉시 수정 필요, 배포 차단) / **중** (배포 전 수정 권장) / **낮음** (보완 권장)

---

## Exceptions

1. **Third-party auth providers**: NextAuth, Clerk 등 외부 인증 라이브러리의 내부 구현은 점검 대상에서 제외한다.
2. **개발 환경 전용 코드**: `NODE_ENV === 'development'` 조건 내 디버그 로그는 심각도 낮음으로 처리한다.
3. **의도적 Public 엔드포인트**: 인증 없이 공개된 API가 설계상 의도된 경우, AGENTS.md 또는 API_SPECS.md에 명시된 근거가 있으면 패스 처리한다.

---

## 관련 스킬

- `verify-code`: 보안 외 코드 품질 전반 리뷰
- `rules-dev`: 환경변수·DB 안전성 컨벤션 기준
- `rules-workflow`: Step 7 보안 검토와 연동
- `verify-implementation`: 전체 verify-* 통합 실행 시 포함 대상
