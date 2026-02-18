---
name: verify-drizzle-schema
description: Drizzle ORM 스키마가 설계 문서와 일치하고 프로젝트 기술 표준을 따르는지 검증합니다.
---

# Drizzle 스키마 검증 (Template)

## 목적

Drizzle 기반 DB 스키마의 정합성과 품질을 유지합니다:

1. **설계 일치성** — `schema.ts`가 아키텍처 명세서와 일치하는지.
2. **기술 표준 준수** — Zod, Luxon 등 프로젝트에서 정의한 핵심 라이브러리 연동 여부.
3. **관계 무결성** — 외래키(references) 및 인덱스 정의의 누락 확인.

## 실행 시점

- DB 스키마 파일 수정 후
- 마이그레이션 생성 전
- PR 전 최종 DB 무결성 체크 시

## Related Files

| File | Purpose |
|------|---------|
| `[DB_SCHEMA_PATH]` | 실제 구현된 Drizzle 스키마 파일 (예: web/src/db/schema.ts) |
| `[ARCHITECTURE_SPEC_PATH]` | 기술 설계 문서 (예: docs/03_Technical_Specs/01_ARCHITECTURE.md) |

## Workflow

### Step 0: 동적 파일 탐색
프로젝트 구조에 맞춰 `db/schema.ts` 또는 `db/schema/*.ts` 파일을 자동으로 탐색합니다.

### Step 1: 스키마-명세 대조
설계 문서에서 정의된 테이블/필드가 코드에 모두 구현되어 있는지 `grep`으로 확인합니다.

### Step 2: 공통 필드 및 타입 규칙 검증
`id`, `createdAt`, `updatedAt` 등 공통 필드 컨벤션과 Drizzle 핵심 타입 사용 여부를 체크합니다.

### Step 3: 외래키 및 인덱스 체크
테이블 간의 `references()` 정의가 유효하게 설정되었는지 확인합니다.

## Exceptions
1. **Third-party Tables**: 외부 라이브러리(Auth.js 등)에서 제공하는 고정 스키마는 검증에서 제외합니다.
