# AI RPG — Text-Based RPG with AI Game Master

## TL;DR

> **Quick Summary**: Transform the hackathon-starter chat app into an AI text RPG where Claude acts as a game master. Users pick from 4 fantasy worlds (copyright-safe names) and play story-driven adventures with hybrid choice/free-input progression.
> 
> **Deliverables**:
> - RPG game master system prompt (`agent/.claude/CLAUDE.md`)
> - RPG-themed frontend UI (`app/page.tsx`, `app/layout.tsx`, `app/globals.css`)
> - Template build & Vercel deploy (when credentials ready)
> 
> **Estimated Effort**: Medium (2-3 hours focused hackathon work)
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Task 1 (CLAUDE.md) → Task 3 (Template Build) → Task 4 (Deploy)

---

## Context

### Original Request
Build an AI RPG web app for a hackathon. Users chat with an AI game master that runs text-based RPG adventures in familiar fictional worlds. The app uses the existing hackathon-starter codebase (Next.js + Moru sandbox + Claude Agent SDK).

### Interview Summary
**Key Discussions**:
- Game progression: **Hybrid** — choices presented + free text input allowed
- Game complexity: **Story-focused** — character name/class only, narrative combat, no complex stats
- World selection: **Via chat** — agent presents world list in first message
- Copyright safety: **Use inspired names**, not actual franchise names
- Image generation: **None** — pure text RPG
- Template build: **Deferred** — credentials not ready yet

### World Settings (Copyright-Safe)

| Inspiration | RPG World Name | Setting |
|-------------|---------------|---------|
| 무림 (Wuxia) | 무림 (Moorim) | 그대로 사용 — 문화적 소재이므로 저작권 이슈 없음 |
| Star Wars | 은하전쟁: 갤럭틱 오디세이 | 은하 제국과 반란군, 광검(光劍), 포스(기력) |
| Harry Potter | 아케인 아카데미 | 마법 학교, 마법 지팡이, 마법 생물, 학파 대결 |
| Lord of the Rings | 고대 반지의 연대기 | 고대 반지를 둘러싼 종족 연합, 어둠의 군주, 대장정 |

### Metis Review
**Identified Gaps** (addressed in plan):
- Agent has file/code tools enabled but RPG doesn't need them → CLAUDE.md에서 tool 사용 금지 지시
- WorkspacePanel이 기본 표시됨 → `useState(false)`로 변경
- 언어 처리 미정 → 유저 언어에 맞춰 응답하도록 지시
- 응답 길이 제한 필요 → 적절한 길이 가이드라인 포함
- 캐릭터 탈선 방지 → 시스템 프롬프트에 가드레일 포함

---

## Work Objectives

### Core Objective
채팅 앱을 AI 텍스트 RPG로 변환. Claude가 게임 마스터 역할을 하며, 4개의 판타지 세계관에서 스토리 중심의 모험을 진행.

### Concrete Deliverables
- `agent/.claude/CLAUDE.md` — RPG 게임 마스터 시스템 프롬프트
- `app/page.tsx` — RPG 브랜딩 + 워크스페이스 패널 숨김
- `app/layout.tsx` — RPG 메타데이터
- `app/globals.css` — RPG 느낌의 색상 테마 (선택)
- Template build + Vercel deploy (credentials 준비 후)

### Definition of Done
- [ ] 채팅에 메시지를 보내면 게임 마스터가 세계관 선택지를 제시
- [ ] 세계관 선택 후 캐릭터 생성 → 모험 시작
- [ ] 매 턴마다 선택지 + 자유 입력 모두 가능
- [ ] UI에 "hackathon-starter" 텍스트가 남아있지 않음
- [ ] `pnpm build` 성공

### Must Have
- 4개 세계관 모두 플레이 가능
- 첫 메시지에 세계관 선택 안내
- 혼합형 진행 (선택지 + 자유 입력)
- 캐릭터 이름/직업 설정
- 서술형 전투
- 저작권 안전한 세계관 이름

### Must NOT Have (Guardrails)
- ❌ 실제 저작권 이름 사용 금지 (Star Wars, Harry Potter, Lord of the Rings 등)
- ❌ `agent/src/agent.ts` 수정 금지
- ❌ `components/chat/*` 메시지 렌더링 컴포넌트 수정 금지
- ❌ API 라우트, 데이터 레이어, lib 파일 수정 금지
- ❌ 새로운 npm 의존성 추가 금지
- ❌ 캐릭터 생성 UI, 스탯 패널, 인벤토리 UI 금지 — 채팅으로만 진행
- ❌ 세계관별 다른 테마 금지 — 하나의 통합 RPG 테마
- ❌ 에이전트가 파일 생성/코드 실행하는 RPG 메커닉 금지

---

## Verification Strategy

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
>
> ALL tasks verifiable by running commands or inspecting source files.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: None (no test framework)
- **Agent-Executed QA**: Grep-based source verification + `pnpm build`

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── Task 1: Write CLAUDE.md RPG game master prompt [no dependencies]
└── Task 2: Update frontend UI for RPG branding [no dependencies]

Wave 2 (After Wave 1):
└── Task 3: Template build + Vercel deploy [depends: 1, 2, and credentials]

Critical Path: Task 1 → Task 3
Parallel Speedup: Tasks 1 and 2 run simultaneously
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 3 | 2 |
| 2 | None | 3 | 1 |
| 3 | 1, 2, credentials | None | None (final) |

---

## TODOs

- [ ] 1. Write RPG Game Master System Prompt

  **What to do**:
  - Edit `agent/.claude/CLAUDE.md` — **preserve existing workspace rules (lines 1-14)**, append RPG content below
  - Write comprehensive game master system prompt covering:
    - **Role definition**: "You are an RPG Game Master (게임 마스터)"
    - **First message behavior**: When user sends ANY initial message, present the 4 worlds with brief descriptions and ask them to choose
    - **World settings** (copyright-safe names with rich lore):
      - **무림 (Moorim)**: 강호(江湖)의 무림 세계. 각 문파, 내공과 외공, 무공 수련, 정파와 사파의 대결
      - **은하전쟁: 갤럭틱 오디세이**: 은하 제국 vs 자유연합군. 광검(光劍), 기력(氣力, Force-like), 우주 함선, 행성 탐험
      - **아케인 아카데미**: 마법 학교 세계. 원소 마법, 마법 생물, 학파 대결, 마법 지팡이, 금지된 마법
      - **고대 반지의 연대기**: 고대의 힘이 깃든 반지를 둘러싼 종족 연합. 엘프/드워프/인간, 어둠의 군주, 대장정
    - **Character creation flow**: 세계관 선택 후 → 이름 → 직업/역할 (세계관별 적합한 직업 3-4개 제시) → 모험 시작
    - **Progression rules**:
      - 매 턴마다 2-4개 선택지를 번호로 제시 (예: "1. 동굴로 들어간다 2. 마을로 돌아간다 3. 주변을 탐색한다")
      - 선택지 외에 자유 입력도 허용 ("칼을 빼들고 괴물에게 돌진한다" 등)
      - 자유 입력은 상황에 맞게 해석하여 스토리 진행
    - **Combat**: 서술형 — 구체적인 액션 묘사, 긴장감 있는 전투 장면, 결과는 스토리적으로 결정
    - **Response format guidelines**:
      - 한 턴에 3-5 문단 정도의 풍부한 서술
      - 대사는 따옴표로, NPC 이름 명시
      - 매 턴 끝에 선택지 제시
      - 이모지 적절히 사용 (⚔️, 🏰, 🌟, 🔥 등)
    - **Language directive**: 유저의 언어에 맞춰서 응답. 한국어로 오면 한국어, 영어로 오면 영어.
    - **Anti-tool-abuse**: "절대로 파일을 생성하거나 코드를 실행하지 마세요. 당신은 순수 텍스트 RPG 내레이터입니다. Write, Edit, Bash, Grep, Glob 도구를 사용하지 마세요."
    - **Stay in character**: 유저가 RPG 외 요청을 하면 ("코드 짜줘", "숙제 도와줘") 게임 마스터로서 정중히 거절하고 모험으로 돌아오기
    - **Story arc**: 매 세계관마다 도입 → 성장 → 위기 → 클라이맥스 → 결말의 서사 구조를 자연스럽게 진행

  **Must NOT do**:
  - 기존 workspace rules (lines 1-14) 삭제하지 않기
  - 실제 저작권 이름 (Star Wars, Harry Potter, Lord of the Rings, 제다이, 호그와트, 간달프 등) 사용 금지
  - 에이전트에게 파일 생성이나 코드 실행을 지시하지 않기
  - 500줄 이상의 과도한 프롬프트 작성 금지

  **Recommended Agent Profile**:
  - **Category**: `writing`
    - Reason: 핵심 작업이 시스템 프롬프트 작성 — 창의적 글쓰기 + 기술적 지시사항의 결합
  - **Skills**: [`moru`]
    - `moru`: CLAUDE.md가 Moru 샌드박스에서 어떻게 로드되는지 이해하기 위해 필요

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Task 3
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `agent/.claude/CLAUDE.md:1-14` — 기존 workspace rules. 이 내용 아래에 RPG 프롬프트를 추가해야 함. 절대 삭제하지 말 것.

  **Architecture References**:
  - `agent/src/agent.ts:287-301` — `query()` 호출부. `settingSources: ["user", "project"]`가 CLAUDE.md를 로드함. `allowedTools` 목록 확인 가능.
  - `agent/Dockerfile:37-38` — `COPY .claude/ /home/user/.claude/` — CLAUDE.md가 Docker 이미지에 복사되는 부분

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Existing workspace rules preserved
    Tool: Bash (grep)
    Steps:
      1. grep "ALWAYS write files to" agent/.claude/CLAUDE.md
      2. Assert: output contains "/workspace/data/"
    Expected Result: Workspace rules intact
    Evidence: grep output

  Scenario: All 4 copyright-safe world names present
    Tool: Bash (grep)
    Steps:
      1. grep -c "무림\|갤럭틱 오디세이\|아케인 아카데미\|고대 반지의 연대기" agent/.claude/CLAUDE.md
      2. Assert: count >= 4
    Expected Result: All worlds mentioned
    Evidence: grep count output

  Scenario: No copyrighted names present
    Tool: Bash (grep)
    Steps:
      1. grep -ci "Star Wars\|Harry Potter\|Lord of the Rings\|Jedi\|Hogwarts\|Gandalf\|Frodo\|Sith\|Dumbledore\|Voldemort" agent/.claude/CLAUDE.md
      2. Assert: count = 0
    Expected Result: Zero copyrighted references
    Evidence: grep output

  Scenario: Anti-tool-abuse directive present
    Tool: Bash (grep)
    Steps:
      1. grep -i "파일.*생성\|Write.*사용\|Bash.*사용\|도구.*사용하지" agent/.claude/CLAUDE.md
      2. Assert: output is non-empty
    Expected Result: Tool restriction directive exists
    Evidence: grep output

  Scenario: Language handling directive present
    Tool: Bash (grep)
    Steps:
      1. grep -i "한국어\|언어\|language" agent/.claude/CLAUDE.md
      2. Assert: output is non-empty
    Expected Result: Language directive exists
    Evidence: grep output

  Scenario: File size is reasonable
    Tool: Bash (wc)
    Steps:
      1. wc -l agent/.claude/CLAUDE.md
      2. Assert: line count between 50 and 500
    Expected Result: Prompt is substantial but not excessive
    Evidence: wc output
  ```

  **Commit**: YES
  - Message: `feat(agent): add RPG game master system prompt to CLAUDE.md`
  - Files: `agent/.claude/CLAUDE.md`

---

- [ ] 2. Update Frontend UI for RPG Branding

  **What to do**:
  - Edit `app/layout.tsx`:
    - Change `title` in metadata from "Hackathon Starter" to RPG-themed title (예: "AI 텍스트 RPG — 당신의 모험이 시작됩니다")
    - Change `description` to RPG-themed description
  - Edit `app/page.tsx`:
    - Change header text `hackathon-starter` (line 181) to RPG title (예: "⚔️ AI RPG")
    - Change hero text `✳ What can I help with?` (line 204) to RPG welcome (예: "⚔️ 모험을 시작하세요")
    - Change placeholder `"Ask anything"` (line 212) to RPG prompt (예: "아무 말이나 입력하면 게임이 시작됩니다...")
    - Change placeholder `"Follow-up message..."` (line 246) to RPG action prompt (예: "행동을 선택하거나 자유롭게 입력하세요...")
    - Change `showWorkspace` default from `useState(true)` to `useState(false)` (line 30) — RPG에서 파일 탐색기는 불필요
  - (Optional) Edit `app/globals.css`:
    - Adjust accent color variables for RPG feel (e.g., warm gold/amber tones instead of pure grayscale)
    - Keep changes minimal — only `:root` CSS variable adjustments

  **Must NOT do**:
  - `components/chat/*` 파일 수정 금지 (메시지 렌더링 로직)
  - `components/ui/*` 파일 수정 금지 (기본 UI 컴포넌트)
  - `components/workspace/*` 파일 수정 금지
  - API 라우트 수정 금지
  - 새 npm 의존성 추가 금지
  - 구글 폰트 추가 금지 (기존 Geist 폰트 유지)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI 텍스트 변경 + CSS 색상 조정. 프론트엔드 감각 필요.
  - **Skills**: [`frontend-design`]
    - `frontend-design`: RPG 느낌의 색상 테마와 텍스트 선정에 도움

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Task 3
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `app/layout.tsx:16-19` — 현재 metadata 정의. `title`과 `description`을 변경할 위치
  - `app/page.tsx:30` — `useState(true)` → `useState(false)`로 변경할 showWorkspace 상태
  - `app/page.tsx:181` — `hackathon-starter` 텍스트 위치
  - `app/page.tsx:203-204` — hero text `✳ What can I help with?` 위치
  - `app/page.tsx:212` — placeholder `"Ask anything"` 위치
  - `app/page.tsx:246` — placeholder `"Follow-up message..."` 위치

  **CSS References**:
  - `app/globals.css` — oklch 색상 변수들. `:root` 블록에서 chroma 값을 조정해 색상 추가 가능
  - `lib/utils.ts:4-6` — `cn()` 함수 패턴 (clsx + tailwind-merge)

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Old branding removed from page.tsx
    Tool: Bash (grep)
    Steps:
      1. grep -c "hackathon-starter" app/page.tsx
      2. Assert: count = 0
    Expected Result: No old branding text
    Evidence: grep output

  Scenario: Old hero text removed
    Tool: Bash (grep)
    Steps:
      1. grep -c "What can I help with" app/page.tsx
      2. Assert: count = 0
    Expected Result: Old hero text replaced
    Evidence: grep output

  Scenario: RPG metadata in layout.tsx
    Tool: Bash (grep)
    Steps:
      1. grep -c "Hackathon Starter" app/layout.tsx
      2. Assert: count = 0
    Expected Result: Old title removed
    Evidence: grep output

  Scenario: WorkspacePanel hidden by default
    Tool: Bash (grep)
    Steps:
      1. grep "showWorkspace.*useState" app/page.tsx
      2. Assert: output contains "useState(false)"
    Expected Result: Workspace panel hidden
    Evidence: grep output

  Scenario: Build succeeds
    Tool: Bash
    Steps:
      1. pnpm build
      2. Assert: exit code 0
    Expected Result: No TypeScript errors, build passes
    Evidence: Build output

  Scenario: No new dependencies added
    Tool: Bash (git)
    Steps:
      1. git diff package.json
      2. Assert: no changes in dependencies
    Expected Result: package.json unchanged
    Evidence: git diff output
  ```

  **Commit**: YES
  - Message: `feat(ui): rebrand frontend as AI text RPG`
  - Files: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`

---

- [ ] 3. Template Build & Vercel Deploy

  **What to do**:
  - Ensure `.credentials.json` exists in `agent/` directory (prerequisites):
    - Option A: `cd agent && ./sync-credentials.sh` (macOS, Claude Code 로그인 상태)
    - Option B: 수동으로 `.credentials.json` 생성
  - Verify template alias consistency:
    - `agent/template.ts` line 26: `templateAlias` 값 확인
    - `lib/moru.ts` line 3: `TEMPLATE_NAME` 값 확인
    - 두 값이 동일한지 확인
  - Build template: `pnpm build:template`
  - Build Next.js: `pnpm build`
  - Deploy: `npx vercel --prod -y`
  - Verify Vercel env vars are set:
    - `DATABASE_URL`, `MORU_API_KEY`, `ANTHROPIC_API_KEY`, `BASE_URL`
    - `BASE_URL`에 trailing newline/slash 없는지 확인

  **Must NOT do**:
  - `agent/src/agent.ts` 수정 금지
  - template alias 변경 시 한 곳만 바꾸기 금지 (항상 두 파일 동시 변경)
  - `echo`로 env var 파이핑 금지 (항상 `printf` 사용)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 명확한 명령어 실행 작업. 창의적 판단 불필요.
  - **Skills**: [`moru`]
    - `moru`: Moru 템플릿 빌드 및 샌드박스 명령어 참조

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (sequential, after Tasks 1 & 2)
  - **Blocks**: None (final task)
  - **Blocked By**: Task 1, Task 2, credentials 준비

  **References**:

  **Pattern References**:
  - `agent/template.ts:26` — `templateAlias` 변수. `lib/moru.ts:3`의 `TEMPLATE_NAME`과 일치해야 함
  - `lib/moru.ts:3` — `TEMPLATE_NAME` 상수
  - `agent/Dockerfile:34` — `.credentials.json` COPY 라인 (이 파일이 없으면 빌드 실패)
  - `agent/sync-credentials.sh` — credentials 추출 스크립트

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Template alias consistency
    Tool: Bash (grep)
    Steps:
      1. grep "TEMPLATE_NAME" lib/moru.ts | head -1
      2. grep "templateAlias" agent/template.ts | head -1
      3. Assert: both contain the same alias string
    Expected Result: Aliases match
    Evidence: grep outputs

  Scenario: Template builds successfully
    Tool: Bash
    Steps:
      1. pnpm build:template
      2. Assert: output contains "Build Complete!"
    Expected Result: Template built and registered on Moru
    Evidence: Build output with template ID

  Scenario: Vercel build succeeds
    Tool: Bash
    Steps:
      1. pnpm build
      2. Assert: exit code 0
    Expected Result: Next.js builds without errors
    Evidence: Build output

  Scenario: Vercel deploy succeeds
    Tool: Bash
    Steps:
      1. npx vercel --prod -y
      2. Assert: output contains deployment URL
    Expected Result: App deployed to production
    Evidence: Deploy output with URL
  ```

  **Commit**: NO (deployment task, no source code changes)

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `feat(agent): add RPG game master system prompt to CLAUDE.md` | `agent/.claude/CLAUDE.md` | grep for world names |
| 2 | `feat(ui): rebrand frontend as AI text RPG` | `app/layout.tsx`, `app/page.tsx`, `app/globals.css` | `pnpm build` |
| 3 | (no commit — deploy only) | — | Vercel URL accessible |

---

## Success Criteria

### Verification Commands
```bash
# CLAUDE.md has all 4 worlds
grep -c "무림\|갤럭틱 오디세이\|아케인 아카데미\|고대 반지의 연대기" agent/.claude/CLAUDE.md  # Expected: >= 4

# No copyrighted names
grep -ci "Star Wars\|Harry Potter\|Lord of the Rings\|Jedi\|Hogwarts" agent/.claude/CLAUDE.md  # Expected: 0

# Old branding removed
grep -c "hackathon-starter\|Hackathon Starter\|What can I help with" app/page.tsx app/layout.tsx  # Expected: 0

# Workspace panel hidden by default
grep "showWorkspace.*useState" app/page.tsx  # Expected: useState(false)

# Build passes
pnpm build  # Expected: exit 0
```

### Final Checklist
- [ ] All "Must Have" present (4 worlds, hybrid progression, character creation, narrative combat)
- [ ] All "Must NOT Have" absent (no copyrighted names, no agent.ts changes, no new deps)
- [ ] `pnpm build` passes
- [ ] Template build succeeds (when credentials ready)
- [ ] Vercel deploy succeeds (when credentials ready)
