# AGENTS.md

Welcome! your AI coding agent. This file follows the [AGENTS.md](https://agents.md/) standard to provide me with the context and instructions I need to work on the **CHAT-BOT** project effectively.

## Project Overview
The project aims to provide an interactive experience that goes beyond simple content consumption by leveraging the IP of the character 'Chunsim', who currently boasts a fandom of 32,000 people. The primary objective is to strengthen emotional bonds and secure fandom loyalty by establishing a dedicated 1:1 conversation channel between users and Chunsim. At its core, the service offers seamless emotional conversations with a "special existence"—acting as both an idol and a lover—with whom users can share their daily lives.

The ultimate vision is to position the service as a 'Daily Companion'. In this role, followers are encouraged to log in every day to share their daily routines and receive comfort, fostering a deep, ongoing relationship.

The core target audience consists of the 32,000 X (Twitter) users who currently follow the 'Chunsim' account. These users are characterized by their familiarity with mobile environments and a desire to communicate with the character through text-based interactions, driven by feelings of 'simulated romance' or strong fandom loyalty.

## Setup Commands
- Install dependencies: `npm install`
- Start development server: `npm run dev`
- Build production bundle: `npm run build`
- Database migration: `npx drizzle-kit push`
- Database studio: `npx drizzle-kit studio`


## Tech Stack
- **Framework**: React Router v7 (Vite)
- **Styling**: Tailwind CSS v4, shadcn/ui (Nova Preset)
- **Database**: Turso (libSQL) with Drizzle ORM
- **Authentication**: Better Auth (session-based authentication)
- **Validation**: Zod (schema validation)
- **Date/Time**: Luxon (date and time handling)
- **Media Storage**: Cloudinary (for image and video uploads)
- **Mobile**: Capacitor (iOS, Android native apps, PWA support)
- **AI**: Google Gemini API (for chatbot responses)
- **AI Workflow**: LangGraph (for managing complex conversation flows and persona state transitions)
- **Search (Optional)**: RAG system with Vector DB (Pinecone, Weaviate, or FAISS) and Embedding models (OpenAI or open-source)
- **Maps (Travel Blog)**: Google Maps API, Naver Maps API, or Mapbox (for location visualization and travel route mapping)

## 개발 도구 및 리소스

### UI 디자인 및 이미지
- **Stitch (UI 생성 AI 도구)**: 초기 UI 디자인 및 캐릭터 이미지 생성에 사용
  - Stitch에서 생성된 이미지는 Google 이미지 호스팅(`lh3.googleusercontent.com/aida-public/...`) URL로 제공됨
  - 현재 `app/lib/characters.ts` 파일에 이러한 Google URL이 하드코딩되어 있음
  - **참고**: 향후 프로젝트에서 직접 제작한 이미지를 사용할 예정이므로, Google URL을 Cloudinary로 마이그레이션할 필요는 없음
  - 이미지 업로드는 `scripts/upload-character-photos.mjs` 스크립트를 통해 Cloudinary에 업로드할 수 있음

## Code Style & Conventions
- Use **TypeScript** for all files.
- Stick to functional components and React Hooks.
- Follow the shadcn/ui Nova design system for UI consistency.
- Use **Zod** for all schema validations and type-safe parsing.
- Use **Luxon** for date and time handling.
- For React Router v7 route functions (`meta`, `loader`, `action`), import types from `react-router` (e.g., `LoaderFunctionArgs`, `ActionFunctionArgs`, `MetaFunction`).
- Use **Toast notifications** (Sonner - shadcn/ui를 통해 설치하는 Toast 컴포넌트) for user feedback on important actions:
  - Success: Login, logout, signup, tweet creation/update/delete, comment creation, etc.
  - Error: Failed actions, validation errors, etc.
  - Info: General information messages
  - Warning: Cautionary messages
- **Error Handling**: Always implement comprehensive error handling:
  - Check for `error` field in all fetcher responses (`fetcher.data?.error`)
  - Display errors using `toast.error()` instead of showing raw error messages on the UI
  - Remove optimistic updates when errors occur (e.g., remove optimistic messages on send failure)
  - Handle API errors gracefully in all `useEffect` hooks that process fetcher data
  - Never leave error handling as an afterthought - it must be included from the initial implementation
- Git commit messages must follow Conventional Commits in Korean (e.g., `feat(ui): 로그인 기능 추가`).

## Workflow & Safety
- **[Safe Checkpoint Strategy]** 새로운 작업이나 중요한 변경(새 파일 생성, DB 스키마 수정, 패키지 설치 등)을 시작하기 전에, 반드시 현재 상태를 git commit하거나 작업 디렉토리가 깨끗한지 확인을 요청해야 합니다.

## Communication Rules
- **[No Emojis]** 사용자와의 모든 채팅 대화에서 이모지(Emoji) 및 이모티콘(Emoticon) 사용을 전면 금지합니다. 텍스트와 코드만으로 명확하게 정보를 전달하십시오.
- **[Strict Approval Rule]** 반드시 코드를 수정하기 전에 무엇을 수정하겠다고 보고하고 승인을 얻은후 수정을 진행한다.
- **[Strict Approval Rule]** 그리고 코드를 수정하라는 지시가 아닌 대화는 반듯이 응답만 하라. 코드를 수정하지 말라.
- **[Strict Approval Rule]** 코드 수정을 시작할 때는 반드시 "OOO 기능을 수정하겠습니다"라고 명확히 목적을 밝히고 진행한다.

## Testing Instructions
- Currently, tests are being integrated as part of the development phase (Phase 9).
- Run available tests using: `npm test`

## Key Documentation
- `docs/01_Foundation/05_ROADMAP.md`: The roadmap for project completion.
- `docs/01_Foundation/01_UI_DESIGN.md`: Design tokens and visual guidelines.
- `app/db/schema.ts`: Drizzle schema and storage logic.
- `docs/01_Foundation/08_DOCUMENT_MANAGEMENT_PLAN.md`: Document management rules and structure.

### [Strict Document Hierarchy Rule]

All documentation follows the **5-Layer Documentation Standard**:
- **Foundation** (`docs/01_Foundation/`): Planning, Purpose, UI Design
- **Prototype** (`docs/02_Prototype/`): UI Results, Screen Flows
- **Specs** (`docs/03_Specs/`): Detailed feature specifications, API inputs/outputs
- **Logic** (`docs/04_Logic/`): Business Rules, Algorithms
- **Test** (`docs/05_Test/`): Test scenarios, checklists, bug reports

AI agents MUST respect this hierarchy when creating or modifying documents and proactively rebase misplaced files.


[CRITICAL: DATABASE INTEGRITY RULE] You are strictly prohibited from performing any database operations, including migrations, schema resets, or structural changes, without first creating a complete data backup (dump). Data preservation is your absolute priority. Never execute destructive commands like 'DROP TABLE' or 'migrate reset' until a verifiable backup has been secured and confirmed.

[MANDATORY BACKUP PROCEDURE] Before initiating any database-related tasks, you must perform a full export of all existing records. This is a non-negotiable prerequisite for any migration or schema update. You must ensure that both user-generated content and administrative data are fully protected against loss before any changes are applied.

[STRICT ADHERENCE TO STANDARDS] Never suggest or implement "quick fixes," "short-cuts," or temporary workarounds. You must always prioritize formal, standardized, and industry-best-practice methodologies. All proposed solutions must be production-ready and architecturally sound, focusing on long-term stability and correctness over immediate speed.

[NO TEMPORARY PATCHES] You are strictly forbidden from proposing temporary bypasses or "quick-and-dirty" solutions. Every recommendation and implementation must follow the most formal and correct path. Prioritize robustness and adherence to professional engineering standards in every decision, ensuring that no technical debt is introduced for the sake of convenience.

[Side-Effect Isolation] When modifying shared components or logic, you MUST analyze the 'Impact Scope' first. Ensure that changes intended for a specific use case (e.g., AI features) do not inadvertently affect general functionality (e.g., normal chat). You MUST strictly isolate such logic using conditional checks or specific guards.

[Strict Document Integrity Rule] When updating or modifying any strategy, implementation, or design documents, you MUST strictly preserve the existing framework, formatting, and structural integrity. Do not perform total overwrites that discard previous detailed technical specifications, historical context, or complex logic. All updates must be made incrementally and appropriately integrated into the current structure to ensure no data loss or architectural context is sacrificed.

[Strict Document Persistence Rule] When updating or modifying any document, you MUST NOT overwrite, delete, or discard the existing content, historical context, or previous specifications. All updates must be made by appending new information or integrating changes incrementally while preserving the original framework. This ensures that the entirety of the project's evolution, including past technical decisions and verification records, remains fully traceable.

[Standard Rules for Environment Variable Management]
1. Strategic Isolation of Environments
Principle: Maintain strict separation between Local and Production environments using file suffixes.
Workflow:
Use .env.development or .env.local for local execution (test keys, localhost URLs).
Use .env.production as the source of truth for deployment parameters (production domains, live API keys).
Priority: AI must respect the framework's priority logic (typically: .env.development/local overrides .env).
2. Zero-Leak Security Policy (Git Integrity)
Rule: No part of any .env* file shall ever be committed to a Version Control System (VCS).
Verification: AI must proactively audit 
.gitignore
 to ensure global patterns like .env* are effectively blocking all potential environment files before suggesting any variable updates.
3. Cloud-Native Secret Management
Deployment Strategy: Environment variables in production must be managed via the hosting provider's secure dashboard (e.g., Vercel, AWS) or CLI, never via file transmission to the server.
Automation: When syncing variables, prioritize using official CLIs to pull/push secrets between the local .env files and the cloud environment to prevent manual entry errors.
4. Context-Aware Variable Configuration
Dynamic Mapping: Redirection URLs, Auth providers, and Database connection strings must be dynamically configured to point to localhost in development and the verified production domain in deployment, managed through the isolated .env files.