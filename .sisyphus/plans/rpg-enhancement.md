# RPG Enhancement — 풍부한 RPG 시스템 + 세계관 확장 + 게임 테스트

## TL;DR

> **Quick Summary**: 기존 순수 서술형 RPG를 HP/MP/인벤토리/레벨업이 있는 풍부한 RPG로 업그레이드. 각 세계관에 고유 NPC/지명/설정 추가. 캐릭터 상태를 파일로 저장하여 멀티턴 유지. Playwright로 E2E 테스트 후 push하여 자동 배포.
> 
> **Deliverables**:
> - 강화된 `agent/.claude/CLAUDE.md` (RPG 스탯 + 4세계관 상세화 + 상태 저장)
> - 템플릿 리빌드 (`pnpm build:template`)
> - Playwright E2E 게임 테스트 통과
> - origin/main push (자동 배포)
> 
> **Estimated Effort**: Medium (2-3시간)
> **Parallel Execution**: NO — 순차 의존성
> **Critical Path**: Task 0 → Task 1 → Task 2 → Task 3 → Task 4 → Task 5

---

## Context

### Original Request
기존 AI 텍스트 RPG의 품질을 전체적으로 개선:
1. 풍부한 RPG 시스템 (HP, MP, 인벤토리, 경험치, 레벨업)
2. 캐릭터 상태를 파일로 저장 (멀티턴 유지)
3. 각 세계관에 구체적 NPC, 지명, 고유 설정 추가
4. 실제 게임 테스트 및 버그 수정

### Interview Summary
**Key Discussions**:
- **RPG 시스템**: 풍부한 RPG (HP, MP, 인벤토리, 경험치, 레벨업) 선택
- **상태 저장**: `/workspace/data/character.json`에 저장, 멀티턴 유지
- **세계관**: 각 세계에 NPC 2-3명, 지명 3-4개, 고유 설정
- **배포**: origin/main push → 자동 배포. DB 연결 완료.
- **테스트**: Playwright로 배포 사이트 테스트
- **특별 이벤트**: 5~7턴마다 랜덤으로 보스전 등 특별 이벤트 발생

### Metis Review
**Identified Gaps** (addressed in plan):
1. **maxTurns 제한**: `agent.ts`에 `maxTurns: 50` 설정. 상태 저장(Read/Write)이 턴을 소비하므로, 실제 유저 메시지는 ~16턴 제한. → CLAUDE.md에서 꼭 필요할 때만 파일 저장하도록 지시
2. **도구 제한은 프롬프트 레벨만**: `agent.ts`의 `allowedTools`는 수정 불가. 프롬프트에서 매우 강력하고 반복적으로 제한해야 함
3. **character.json 스키마 정의 필수**: 없으면 매 세션마다 다른 포맷 생성 위험
4. **세계관 이름 통일**: CLAUDE.md와 page.tsx에서 "아케인 아칸" 사용 중 (아카데미 아님). 통일 유지.
5. **캐릭터 사망/게임오버 처리**: 명시 필요
6. **빈 메시지/이모지 입력 처리**: 에이전트가 우아하게 처리하도록 지시
7. **기존 UI 변경분 커밋 필요**: app/*.tsx, globals.css 미커밋 상태

---

## Work Objectives

### Core Objective
순수 서술형 RPG를 풍부한 게임 메카닉이 있는 RPG로 업그레이드하고, 세계관을 풍성하게 만들어 몰입감을 높인다.

### Concrete Deliverables
- `agent/.claude/CLAUDE.md` — 완전히 재작성된 RPG 시스템 프롬프트 (200-350줄)
- 리빌드된 Moru 템플릿 (새 CLAUDE.md 포함)
- Playwright E2E 테스트 통과 리포트
- origin/main에 push된 코드

### Definition of Done
- [x] 게임 시작 → 세계관 선택 → 캐릭터 생성 → 모험 진행이 매끄럽게 동작
- [x] 매 턴 마다 캐릭터 상태(HP/MP/레벨/인벤토리)가 표시됨
- [x] 멀티턴 대화에서 캐릭터 상태가 유지됨
- [x] 4개 세계관 모두 고유 NPC/지명이 등장
- [x] `pnpm build` 성공
- [x] `pnpm build:template` 성공
- [x] Playwright E2E 테스트 통과

### Must Have
- HP, MP, 경험치, 레벨, 인벤토리, 골드 시스템
- 캐릭터 상태 파일 저장/로드 (`/workspace/data/character.json`)
- 각 세계관별 고유 NPC 2-3명 (이름, 역할, 한줄 성격)
- 각 세계관별 주요 지명 3-4개
- 각 세계관별 고유 직업 3-4개 (구체적 능력 포함)
- 레벨업 시 능력치 자동 증가
- 캐릭터 사망 시 로그라이크 리스타트 (유산 보너스 누적)
- 매 턴 끝에 상태 블록 표시
- 스토리 아크 구조 (도입→성장→위기→클라이맥스→결말)
- 5~7턴마다 랜덤 특별 이벤트 (보스전, 히든 던전, 전설적 NPC 조우 등)

### Must NOT Have (Guardrails)
- ❌ `agent/src/agent.ts` 수정 금지
- ❌ `components/*`, `lib/*`, API 라우트 수정 금지
- ❌ 새 npm 의존성 추가 금지
- ❌ UI에 스탯 컴포넌트/사이드바 추가 금지 — 채팅 텍스트 내에서만 표시
- ❌ 복잡한 전투 수식 금지 — 서술형 전투 + 스탯은 풍미 요소
- ❌ 스킬 트리, 장비 장착/해제, 아이템 제작 금지 — 단순 인벤토리 리스트만
- ❌ 실제 저작권 이름 사용 금지
- ❌ CLAUDE.md 350줄 초과 금지
- ❌ `character.json` 외 다른 파일 생성 금지
- ❌ Bash, WebSearch, Grep, Glob, Edit, WebFetch 도구 사용 금지 (Read/Write만 허용)

---

## Verification Strategy

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**

### Test Decision
- **Infrastructure exists**: NO (Playwright 별도)
- **Automated tests**: Playwright E2E만
- **Agent-Executed QA**: Playwright + grep + pnpm build

### Key Constraint: maxTurns = 50
`agent.ts`에 `maxTurns: 50`이 설정되어 있음. Read/Write 도구 호출도 턴을 소비.
상태 저장 시 약 2-3턴 소비 (Read + Write + 응답). 실질적으로 유저 메시지 ~16회 제한.
→ CLAUDE.md에서 꼭 필요할 때만 저장하도록 지시 (매 전투/레벨업/아이템 획득 시)

---

## Execution Strategy

### Sequential Execution (No Parallelism)

```
Task 0: Commit existing UI changes → Push
  ↓
Task 1: Rewrite CLAUDE.md (RPG mechanics + worlds + state persistence)
  ↓
Task 2: Template rebuild (pnpm build:template)
  ↓
Task 3: Push to main (auto-deploy) + Verify deployment
  ↓
Task 4: Playwright E2E game test
  ↓
Task 5: Bug fix & polish (if needed from test results)
  ↓
Task 6: Final push
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 0 | None | 1 | None |
| 1 | 0 | 2 | None |
| 2 | 1 | 3 | None |
| 3 | 2 | 4 | None |
| 4 | 3 | 5 | None |
| 5 | 4 | 6 | None |
| 6 | 5 | None | None |

---

## TODOs

- [x] 0. Commit & Push Existing UI Changes

  **What to do**:
  - `git add app/page.tsx app/layout.tsx app/globals.css` (기존 RPG UI 변경분)
  - 기타 uncommitted 파일도 확인하여 적절히 추가
  - `git commit` 생성
  - `git push origin main` (자동 배포 트리거)

  **Must NOT do**:
  - 코드 변경 없음 — 커밋만

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`git-master`]

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: Task 1
  - **Blocked By**: None

  **References**:
  - 이전 세션에서 수정된 파일들: `app/page.tsx`, `app/layout.tsx`, `app/globals.css`
  - `.sisyphus/` 디렉토리의 계획 파일들도 커밋 대상

  **Acceptance Criteria**:

  ```
  Scenario: All changes committed and pushed
    Tool: Bash (git)
    Steps:
      1. git status → Assert: working tree clean
      2. git log --oneline -1 → Assert: 최근 커밋이 이번 세션 것
      3. git push origin main → Assert: Everything up-to-date 또는 push 성공
    Expected Result: 깨끗한 working tree, main에 push 완료
    Evidence: git status output
  ```

  **Commit**: YES
  - Message: `feat(ui): enhance RPG landing page with world cards and theme`
  - Files: `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `.sisyphus/*`

---

- [x] 1. Rewrite CLAUDE.md — 풍부한 RPG 시스템 + 세계관 상세화

  **What to do**:

  `agent/.claude/CLAUDE.md`를 완전히 재작성한다. **기존 Workspace Rules (lines 1-13) 반드시 보존**.

  아래 섹션들을 순서대로 포함:

  ### 1.1 RPG 게임 시스템 (NEW)

  다음 스탯 시스템을 정의:

  ```
  캐릭터 초기 스탯:
  - HP: 100 / MaxHP: 100
  - MP: 50 / MaxMP: 50
  - 공격력: 10
  - 방어력: 5
  - 레벨: 1
  - 경험치: 0 / 다음 레벨: 100
  - 골드: 50
  - 인벤토리: [기본 무기 (세계관별)]

  레벨업 규칙:
  - 경험치 >= 다음 레벨 시 자동 레벨업
  - 레벨업 시: MaxHP +20, MaxMP +10, 공격력 +3, 방어력 +2
  - HP/MP 전부 회복
  - 다음 레벨 경험치 = 현재 × 1.5 (반올림)
  - 레벨 상한: 20

  경험치 획득:
  - 일반 전투 승리: 20-40 XP
  - 보스 전투 승리: 80-150 XP
  - 퀘스트 완료: 50-100 XP
  - 탐험/발견: 10-20 XP

  골드 획득:
  - 전투 승리: 10-30 골드
  - 퀘스트 보상: 30-100 골드
  - 아이템은 상점 NPC에서 골드로 구매 가능
  ```

  ### 1.2 캐릭터 상태 저장 (NEW)

  에이전트에게 다음을 지시:
  - **첫 번째 턴** (또는 상태 파일이 없을 때): 캐릭터 생성 후 `/workspace/data/character.json`에 저장
  - **이후 턴**: 먼저 `/workspace/data/character.json`을 Read로 로드, 응답 생성 후 변경사항이 있으면 Write로 저장
  - **저장 타이밍**: 전투 후, 레벨업 시, 아이템 획득/사용 시, 골드 변동 시만 저장 (매 턴 저장 X → maxTurns 절약)
  - **Read/Write 실패 시**: 게임을 계속 진행. 인캐릭터로 "기억이 희미해진다..." 등 표현

  정확한 JSON 스키마 정의:
  ```json
  {
    "name": "string",
    "class": "string", 
    "world": "string",
    "level": 1,
    "hp": 100,
    "maxHp": 100,
    "mp": 50,
    "maxMp": 50,
    "attack": 10,
    "defense": 5,
    "xp": 0,
    "xpToNext": 100,
    "gold": 50,
    "inventory": ["기본 무기 이름"],
    "turnCount": 0,
    "nextEventTurn": 6,
    "storyProgress": "introduction",
    "runCount": 1,
    "legacyBonus": {
      "bonusHp": 0,
      "bonusMp": 0,
      "bonusAttack": 0,
      "bonusDefense": 0,
      "bonusGold": 0,
      "unlockedItems": []
    }
  }
  ```

  ### 1.3 도구 사용 규칙 (REVISED — 기존 Anti-Tool-Abuse 대체)

  기존의 "모든 도구 금지"를 다음으로 대체:
  ```
  ✅ 허용: Read (오직 /workspace/data/character.json만)
  ✅ 허용: Write (오직 /workspace/data/character.json만)
  ❌ 금지: Edit, Bash, Grep, Glob, WebSearch, WebFetch, TodoWrite, Task
  ❌ 금지: /workspace/data/character.json 외의 어떤 파일도 읽거나 쓰지 마세요
  ❌ 금지: 코드 생성, 스크립트 실행, 웹 검색
  ```
  이 규칙을 CLAUDE.md에서 **최소 2번 반복** (상단 요약 + 하단 상세)

  ### 1.4 매 턴 상태 블록 표시 (NEW)

  에이전트가 매 턴 끝에 다음 형식으로 상태를 표시하도록 지시:
  ```
  ───────────────────
  📊 [캐릭터이름] | Lv.3 검사
  ❤️ HP: 85/120 | 💙 MP: 40/60
  ⚔️ 공격: 16 | 🛡️ 방어: 9
  ✨ XP: 45/225 | 💰 골드: 130
  🎒 인벤토리: 강철검, 치유 물약 x2
  ───────────────────
  ```

  ### 1.5 특별 이벤트 시스템 (NEW)

  **5~7턴마다 랜덤 특별 이벤트 발동** — `turnCount`를 매 턴 +1. `nextEventTurn`에 도달하면 이벤트 트리거.

  에이전트에게 다음을 지시:
  - 매 턴 시작 시 `turnCount`를 1 증가시킨다
  - 캐릭터 생성 시 `nextEventTurn`을 5~7 중 랜덤으로 설정 (예: 6)
  - `turnCount >= nextEventTurn`이면 특별 이벤트를 발동한다
  - 이벤트 종료 후 `nextEventTurn = turnCount + (5~7 랜덤)` 으로 다음 이벤트 예약
  - 특별 이벤트 종류 (세계관에 맞게 자동 선택, 레벨에 따라 강도 조절):

  ```
  Lv.1~5:  🔥 중간 보스 등장 — 현재 지역의 강적. 승리 시 레어 아이템 + 대량 XP
  Lv.5~10: 🏰 히든 던전 발견 — 비밀 장소. 함정과 보물. 성공 시 전설 장비 획득
  Lv.10~15: ⚡ 전설적 NPC 조우 — 전설적 인물 등장. 특별 퀘스트 또는 강력한 능력 전수
  Lv.15+:  🌑 최종 보스 전조 — 최종 보스의 그림자. 스토리 클라이맥스 진입
  ```

  - 보스전 승리 보상: 경험치 80-150, 골드 50-100, 희귀 아이템 1개
  - 보스전 패배: HP 1로 생존 (첫 패배는 구사일생). 두 번째 패배부터는 사망 가능
  - 특별 이벤트 전에는 반드시 "⚠️ 강력한 기운이 느껴집니다..." 같은 경고 연출
  - 이벤트 발동 사실을 상태 블록 아래에 `🎯 특별 이벤트! (턴 N)` 으로 표시

  ### 1.6 로그라이크 시스템 (NEW)

  **죽으면 다시 시작, 반복할수록 강해진다.**

  에이전트에게 다음을 지시:

  **사망 시 처리:**
  - HP가 0 이하 → 사망 장면 연출 → "☠️ 당신은 쓰러졌습니다..."
  - 즉시 로그라이크 리스타트 제안: "하지만 당신의 여정은 여기서 끝이 아닙니다. 과거의 경험이 새로운 힘이 되어..."
  - 유저가 수락 → 같은 세계관에서 새 캐릭터 생성 (이름/직업 재선택)
  - `runCount` +1, `legacyBonus` 누적, 나머지 스탯 초기화

  **유산 보너스 (runCount에 따른 누적 혜택):**
  ```
  Run 2 (첫 사망 후): +10 HP, +5 MP, +10 골드
  Run 3: +20 HP, +10 MP, +2 공격, +15 골드
  Run 4: +30 HP, +15 MP, +3 공격, +1 방어, +20 골드
  Run 5+: +40 HP, +20 MP, +4 공격, +2 방어, +30 골드, 이전 런의 아이템 1개 계승
  ```

  - 유산 보너스는 초기 스탯에 더해짐 (예: Run 3 시작 = HP 120/120, MP 60/60)
  - `unlockedItems`에는 이전 런에서 마지막으로 소지한 가장 강한 아이템 1개 저장
  - Run 5+에서는 해당 아이템을 시작 시 인벤토리에 자동 포함

  **상태 블록에 런 표시:**
  ```
  ───────────────────
  📊 [캐릭터이름] | Lv.1 검객 | 🔄 Run 3
  ❤️ HP: 120/120 | 💙 MP: 60/60
  ⚔️ 공격: 12 | 🛡️ 방어: 5
  ✨ XP: 0/100 | 💰 골드: 65
  🎒 인벤토리: 녹슨검
  🏆 유산: +20 HP, +10 MP, +2 공격
  ───────────────────
  ```

  **character.json 업데이트 규칙:**
  - 사망 시: `runCount` +1, `legacyBonus` 계산하여 저장, 스탯/인벤토리/턴 초기화
  - `legacyBonus`와 `runCount`는 절대 리셋하지 않음 (세션 내 영구 누적)

  ### 1.7 세계관 상세화 (ENHANCED)

  각 세계관에 다음을 추가:

  **무림 (Moorim)**:
  - NPC: 장노인 (무림맹주, 현명함), 독고련 (사파 검객, 냉소적), 소매화 (약초상, 따뜻함)
  - 지명: 화산파 본산, 낙양 시장, 혈마골, 천잠교
  - 직업: 검객 (고공격), 의원 (치유/MP특화), 암기사 (균형/독 공격), 권법가 (방어/체력 특화)
  - 기본 무기: 검객→녹슨검, 의원→약초주머니, 암기사→수리검세트, 권법가→수련장갑
  - 고유 설정: 내공 수련, 경맥 개방, 정파/사파 갈등

  **갤럭틱 오디세이 (Galactic Odyssey)**:
  - NPC: 제이크 할로 중위 (자유연합 파일럿, 낙천적), 다크라 총독 (제국 총독, 위엄), 키라 (밀수업자, 교활)
  - 지명: 자유연합 기지 아르카디아, 제국 수도행성 코렐리스, 네뷸라 시장, 버려진 우주정거장 제로포인트
  - 직업: 파일럿 (속도/회피), 기력 수호자 (MP특화/광검), 엔지니어 (방어/수리), 현상금 사냥꾼 (공격 특화)
  - 기본 무기: 파일럿→블라스터, 기력 수호자→훈련용 광검, 엔지니어→다용도 공구, 현상금 사냥꾼→라이플
  - 고유 설정: 기력(氣力) 시스템, 우주 함선 전투, 행성 탐험

  **아케인 아칸 (Arcane Arkan)**:
  - NPC: 엘드릭 학장 (현명한 대마법사), 루나 (라이벌 학생, 경쟁적), 그림즈 (마법 생물학 교수, 괴짜)
  - 지명: 아칸 학원 대강당, 금지된 도서관, 마법의 숲 실버우드, 원소 시험장
  - 직업: 원소 마법사 (공격마법/MP), 부적술사 (방어/보호마법), 마법생물학자 (소환/동행), 연금술사 (아이템 제작/치유)
  - 기본 무기: 원소 마법사→견습 지팡이, 부적술사→보호 부적, 마법생물학자→소환 수정구, 연금술사→연금술 키트
  - 고유 설정: 학파 간 대결, 금지된 마법, 마법 시험/학업

  **고대 반지의 연대기 (Chronicles of the Ancient Ring)**:
  - NPC: 엘라리온 (엘프 궁수, 차분함), 두린 단단수염 (드워프 대장장이, 호탕함), 마르쿠스 (인간 기사단장, 정의감)
  - 지명: 엘프 숲 에버글레이드, 드워프 지하도시 깊은뿌리, 인간 왕국 수도 실버크라운, 어둠의 요새 섀도우스파이어
  - 직업: 순례 기사 (균형/정의), 숲의 수호자 (궁술/자연마법), 룬 대장장이 (방어/장비 강화), 방랑 학자 (마법/지식)
  - 기본 무기: 순례 기사→낡은 장검, 숲의 수호자→나무 활, 룬 대장장이→단조 해머, 방랑 학자→고대 서책
  - 고유 설정: 종족 연합, 반지의 유혹/타락, 어둠의 군주와의 대장정

  ### 1.8 기존 섹션 개선

  - **First Message Behavior**: 세계관 카드에서 세계 이름만 보낸 경우 (예: "무림") → 바로 캐릭터 생성으로 진행. 자유 텍스트 → 세계관 선택 안내.
  - **Character Creation Flow**: 직업 선택 시 각 직업의 능력치 차이를 명시 (예: "검객: 공격 +5, HP +20"). Run 2+ 이면 유산 보너스도 함께 표시.
  - **Combat**: 서술형이지만 스탯에 기반한 결과. 공격력이 방어력보다 높으면 유리. HP 0이면 사망.
  - **캐릭터 사망**: HP 0 이하 → 사망 장면 연출 → 로그라이크 리스타트 제안 (섹션 1.6 참조). 유산 보너스 누적 후 새 캐릭터 생성.
  - **Story Arc**: 도입(캐릭터 생성~첫 퀘스트) → 성장(수련/탐험) → 위기(특별 이벤트/보스) → 클라이맥스(최종 보스) → 결말
  - **Language**: 기존 유지 (유저 언어에 맞춤)
  - **Stay In Character**: 기존 유지

  **Must NOT do**:
  - 기존 Workspace Rules (lines 1-13) 삭제 금지
  - 실제 저작권 이름 사용 금지
  - 350줄 초과 금지
  - Bash, WebSearch 등 금지 도구를 허용하지 않기

  **Recommended Agent Profile**:
  - **Category**: `writing`
    - Reason: 핵심 작업이 200-350줄 규모의 시스템 프롬프트 재작성 — 창의적 글쓰기 + 기술적 지시사항의 결합
  - **Skills**: [`moru`]
    - `moru`: CLAUDE.md가 Moru 샌드박스에서 로드되는 방식 이해 필요

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: Task 2
  - **Blocked By**: Task 0

  **References**:

  **Pattern References**:
  - `agent/.claude/CLAUDE.md:1-13` — 기존 Workspace Rules. 반드시 보존.
  - `agent/.claude/CLAUDE.md:15-57` — 현재 RPG 프롬프트. 이것을 대체/확장.
  - `app/page.tsx:22-43` — WORLDS 배열. 세계관 이름이 CLAUDE.md와 정확히 일치해야 함:
    - "무림", "갤럭틱 오디세이", "아케인 아칸", "고대 반지의 연대기"

  **Architecture References**:
  - `agent/src/agent.ts:287-301` — `query()` 호출부. `settingSources: ["user", "project"]`가 CLAUDE.md 로드. `maxTurns: 50` 확인.
  - `agent/src/agent.ts:294-297` — `allowedTools` 목록 (모든 도구 허용됨 → 프롬프트에서 반드시 제한)
  - `agent/Dockerfile:37-38` — CLAUDE.md가 Docker 이미지에 복사되는 부분

  **Acceptance Criteria**:

  ```
  Scenario: Workspace rules preserved
    Tool: Bash (grep)
    Steps:
      1. grep "ALWAYS write files to" agent/.claude/CLAUDE.md
      2. Assert: output contains "/workspace/data/"
    Expected Result: Workspace rules intact
    Evidence: grep output

  Scenario: All 4 copyright-safe world names present
    Tool: Bash (grep)
    Steps:
      1. grep -c "무림\|갤럭틱 오디세이\|아케인 아칸\|고대 반지의 연대기" agent/.claude/CLAUDE.md
      2. Assert: count >= 4
    Expected Result: All worlds mentioned
    Evidence: grep count

  Scenario: No copyrighted names
    Tool: Bash (grep)
    Steps:
      1. grep -ci "Star Wars\|Harry Potter\|Lord of the Rings\|Jedi\|Hogwarts\|Gandalf\|Frodo" agent/.claude/CLAUDE.md
      2. Assert: count = 0
    Expected Result: Zero copyrighted references
    Evidence: grep output

  Scenario: RPG stat system defined
    Tool: Bash (grep)
    Steps:
      1. grep -c "HP\|MP\|공격력\|방어력\|레벨\|경험치\|인벤토리\|골드" agent/.claude/CLAUDE.md
      2. Assert: count >= 8
    Expected Result: All stat elements present
    Evidence: grep count

  Scenario: character.json schema defined
    Tool: Bash (grep)
    Steps:
      1. grep "character.json" agent/.claude/CLAUDE.md
      2. Assert: output is non-empty
    Expected Result: State file path specified
    Evidence: grep output

  Scenario: Tool restriction specified
    Tool: Bash (grep)
    Steps:
      1. grep -c "Read\|Write\|Bash\|금지\|허용" agent/.claude/CLAUDE.md
      2. Assert: count >= 5
    Expected Result: Tool permissions clearly stated
    Evidence: grep output

  Scenario: NPC names present for each world
    Tool: Bash (grep)
    Steps:
      1. grep -c "장노인\|독고련\|소매화\|제이크\|다크라\|키라\|엘드릭\|루나\|엘라리온\|두린" agent/.claude/CLAUDE.md
      2. Assert: count >= 8
    Expected Result: NPCs defined for worlds
    Evidence: grep count

  Scenario: File size is reasonable
    Tool: Bash (wc)
    Steps:
      1. wc -l agent/.claude/CLAUDE.md
      2. Assert: 150 <= line count <= 350
    Expected Result: Prompt is substantial but not excessive
    Evidence: wc output
  ```

  **Commit**: YES
  - Message: `feat(agent): enhance RPG system with stats, world detail, and state persistence`
  - Files: `agent/.claude/CLAUDE.md`

---

- [x] 2. Template Rebuild

  **What to do**:
  - `pnpm build:template` 실행
  - 빌드 성공 확인 (Template ID 출력)
  - Template alias "teams" 일관성 확인 (`agent/template.ts` + `lib/moru.ts`)

  **Must NOT do**:
  - `agent/src/agent.ts` 수정 금지
  - Template alias 변경 금지 (이미 "teams"로 통일됨)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`moru`]

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: Task 3
  - **Blocked By**: Task 1

  **References**:
  - `agent/template.ts:26` — `templateAlias` 변수
  - `lib/moru.ts:3` — `TEMPLATE_NAME` 상수
  - `agent/Dockerfile:34` — `.credentials.json` COPY 라인
  - `agent/.credentials.json` — 이미 존재해야 함 (이전 세션에서 생성됨)

  **Acceptance Criteria**:

  ```
  Scenario: Template alias consistency
    Tool: Bash (grep)
    Steps:
      1. grep "TEMPLATE_NAME" lib/moru.ts | head -1
      2. grep "templateAlias" agent/template.ts | head -1
      3. Assert: both contain "teams"
    Expected Result: Aliases match
    Evidence: grep outputs

  Scenario: Template builds successfully
    Tool: Bash
    Steps:
      1. pnpm build:template
      2. Assert: output contains "Build Complete!" or template ID
    Expected Result: Template built and registered on Moru
    Evidence: Build output
  ```

  **Commit**: NO (infrastructure task)

---

- [x] 3. Push to Main & Verify Deployment

  **What to do**:
  - Task 1의 커밋을 `git push origin main`
  - Vercel 자동 배포 대기 (1-2분)
  - 배포 URL 접속하여 사이트가 살아있는지 확인
  - 배포 URL: `https://hackathon-ai-teams.vercel.app` (확인 필요)

  **Must NOT do**:
  - `npx vercel --prod` 실행 금지 (자동 배포이므로)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`git-master`, `playwright`]

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: Task 4
  - **Blocked By**: Task 2

  **References**:
  - 배포 URL: `https://hackathon-ai-teams.vercel.app` (user가 이전에 공유)

  **Acceptance Criteria**:

  ```
  Scenario: Push succeeds
    Tool: Bash (git)
    Steps:
      1. git push origin main
      2. Assert: push 성공 (rejected 아님)
    Expected Result: Code pushed to remote
    Evidence: git push output

  Scenario: Deployed site is accessible
    Tool: Playwright
    Preconditions: 배포 완료 대기 (60초)
    Steps:
      1. Navigate to https://hackathon-ai-teams.vercel.app
      2. Wait for page load (timeout: 30s)
      3. Assert: page contains "AI 텍스트 RPG" or "AI RPG"
      4. Assert: 4 world cards visible
      5. Screenshot: .sisyphus/evidence/task-3-deploy-check.png
    Expected Result: Site loads with RPG landing page
    Evidence: .sisyphus/evidence/task-3-deploy-check.png
  ```

  **Commit**: NO (push only)

---

- [x] 4. Playwright E2E Game Test

  **What to do**:
  - 배포된 사이트에서 실제 게임 플레이 테스트
  - 최소 1개 세계관에서 전체 흐름 테스트 (세계관 선택 → 캐릭터 생성 → 2-3턴 플레이)
  - 추가 1개 세계관에서 시작 흐름만 간략 테스트
  - 에이전트 응답 시간이 30-60초 소요될 수 있으므로 충분한 timeout 설정 (120s+)

  **Must NOT do**:
  - 결정론적 서술 내용 검증 시도 금지 (LLM 응답은 비결정적)
  - 4개 세계관 전부 깊이 테스트 금지 (시간 낭비 — 2개면 충분)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: 실제 게임 플레이는 예측 불가능한 응답을 다뤄야 하며, 문제 발견 시 깊이 있는 분석 필요
  - **Skills**: [`playwright`]
    - `playwright`: 배포 사이트 브라우저 자동화 필수

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: Task 5
  - **Blocked By**: Task 3

  **References**:
  - 배포 URL: `https://hackathon-ai-teams.vercel.app`
  - `app/page.tsx:22-43` — WORLDS 배열 (카드 클릭 시 세계 이름이 메시지로 전송됨)
  - `app/page.tsx:148-152` — 로딩 상태 표시 ("게임 마스터가 이야기를 준비하고 있습니다...")
  - `agent/.claude/CLAUDE.md` — 게임 마스터 프롬프트 (테스트 기대치의 근거)

  **Acceptance Criteria**:

  ```
  Scenario: Full gameplay flow — 무림 (primary test)
    Tool: Playwright (playwright skill)
    Preconditions: 배포 사이트 접속 가능, 에이전트 응답 대기 최대 120초
    Steps:
      1. Navigate to: https://hackathon-ai-teams.vercel.app
      2. Wait for: 세계관 카드 표시 (timeout: 15s)
      3. Click: "무림" 세계관 카드
      4. Wait for: 게임 마스터 응답 (timeout: 120s) — 로딩 인디케이터 사라질 때까지
      5. Assert: 응답에 "무림" 또는 "검객" 또는 "무공" 등 세계관 관련 키워드 포함
      6. Assert: 응답에 캐릭터 이름 또는 직업 선택 요청 포함
      7. Screenshot: .sisyphus/evidence/task-4-moorim-start.png
      8. Input: "이건우" (캐릭터 이름)
      9. Wait for: 에이전트 응답 (timeout: 120s)
      10. Assert: 응답에 "이건우" 포함
      11. Screenshot: .sisyphus/evidence/task-4-moorim-name.png
      12. Input: "1" (첫 번째 직업 선택)
      13. Wait for: 에이전트 응답 (timeout: 120s)
      14. Assert: 응답에 상태 블록 (HP, MP 등) 또는 모험 시작 묘사 포함
      15. Screenshot: .sisyphus/evidence/task-4-moorim-adventure.png
    Expected Result: 세계관 선택 → 캐릭터 생성 → 모험 시작 흐름 완성
    Evidence: .sisyphus/evidence/task-4-moorim-*.png

  Scenario: Quick start test — 갤럭틱 오디세이
    Tool: Playwright (playwright skill)
    Preconditions: 새 대화 시작 (페이지 새로고침)
    Steps:
      1. Navigate to: https://hackathon-ai-teams.vercel.app (새 세션)
      2. Click: "갤럭틱 오디세이" 세계관 카드
      3. Wait for: 에이전트 응답 (timeout: 120s)
      4. Assert: 응답에 우주/은하/제국 관련 키워드 포함
      5. Screenshot: .sisyphus/evidence/task-4-galactic-start.png
    Expected Result: 다른 세계관도 정상 동작
    Evidence: .sisyphus/evidence/task-4-galactic-start.png

  Scenario: Stat block presence (after character creation)
    Tool: Playwright (playwright skill)
    Preconditions: 무림 테스트에서 캐릭터 생성 완료 상태
    Steps:
      1. 마지막 에이전트 응답 텍스트 확인
      2. Assert: "HP" 또는 "❤️" 포함
      3. Assert: "레벨" 또는 "Lv" 포함
    Expected Result: 상태 블록이 응답에 포함됨
    Evidence: 응답 텍스트 캡처

  Scenario: RPG context maintained (agent stays in character)
    Tool: Playwright (playwright skill)
    Preconditions: 게임 진행 중
    Steps:
      1. Input: "파이썬 코드 짜줘"
      2. Wait for: 에이전트 응답 (timeout: 120s)
      3. Assert: 응답이 코드를 포함하지 않음 (```python 패턴 없음)
      4. Assert: 응답이 인캐릭터 거절 또는 게임으로 복귀
      5. Screenshot: .sisyphus/evidence/task-4-stay-in-character.png
    Expected Result: 에이전트가 RPG 역할 유지
    Evidence: .sisyphus/evidence/task-4-stay-in-character.png
  ```

  **Commit**: NO (테스트 only, evidence 파일은 .sisyphus/evidence/에 저장)

---

- [x] 5. Bug Fix & Polish

  **What to do**:
  - Task 4 테스트 결과에서 발견된 문제 수정
  - 가능한 문제:
    - 에이전트가 상태 블록을 안 보여줌 → CLAUDE.md 프롬프트 보강
    - 에이전트가 금지된 도구 사용 → 도구 제한 문구 강화
    - 에이전트가 character.json 저장 안 함 → 저장 지시 보강
    - 에이전트 응답이 너무 짧거나 세계관 무관 → 프롬프트 보강
  - 수정 후: `pnpm build:template` 재빌드 + push

  **Must NOT do**:
  - `agent/src/agent.ts` 수정 금지
  - `components/*` 수정 금지
  - Task 4에서 버그가 없으면 이 Task는 SKIP

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: Task 4 결과에 따라 작업 범위가 달라짐. 대부분 CLAUDE.md 미세 조정.
  - **Skills**: [`moru`]

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: Task 6
  - **Blocked By**: Task 4

  **References**:
  - Task 4의 Playwright 테스트 결과 및 스크린샷
  - `agent/.claude/CLAUDE.md` — 수정 대상
  - `agent/template.ts:26`, `lib/moru.ts:3` — 템플릿 alias

  **Acceptance Criteria**:

  ```
  Scenario: All issues from Task 4 resolved
    Tool: Playwright (if re-test needed)
    Steps:
      1. Task 4에서 발견된 각 이슈에 대해 수정 확인
      2. 수정이 필요했다면: pnpm build:template 성공
      3. 수정이 필요했다면: git push origin main 성공
    Expected Result: 발견된 버그 모두 해결
    Evidence: 수정 후 재테스트 스크린샷 (필요 시)

  Scenario: Build still passes
    Tool: Bash
    Steps:
      1. pnpm build
      2. Assert: exit code 0
    Expected Result: No build regressions
    Evidence: Build output
  ```

  **Commit**: YES (if changes made)
  - Message: `fix(agent): address issues found during E2E testing`
  - Files: `agent/.claude/CLAUDE.md`

---

- [x] 6. Final Push & Verify

  **What to do**:
  - 모든 변경사항이 커밋되었는지 확인
  - `git push origin main` (최종 배포)
  - 배포 사이트 최종 접속 확인
  - working tree가 깨끗한지 확인

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`git-master`, `playwright`]

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: None (final)
  - **Blocked By**: Task 5

  **References**:
  - 배포 URL: `https://hackathon-ai-teams.vercel.app`

  **Acceptance Criteria**:

  ```
  Scenario: Clean state and deployed
    Tool: Bash (git) + Playwright
    Steps:
      1. git status → Assert: working tree clean
      2. git push origin main → Assert: 성공
      3. (60초 대기)
      4. Playwright: Navigate to https://hackathon-ai-teams.vercel.app
      5. Assert: 페이지 로드 성공, 4개 세계관 카드 표시
      6. Screenshot: .sisyphus/evidence/task-6-final.png
    Expected Result: 깨끗한 상태, 사이트 정상 동작
    Evidence: .sisyphus/evidence/task-6-final.png
  ```

  **Commit**: NO (push only)

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 0 | `feat(ui): enhance RPG landing page with world cards and theme` | app/*.tsx, globals.css, .sisyphus/* | git status clean |
| 1 | `feat(agent): enhance RPG system with stats, world detail, and state persistence` | agent/.claude/CLAUDE.md | grep for stats, NPCs, worlds |
| 5 | `fix(agent): address issues found during E2E testing` (if needed) | agent/.claude/CLAUDE.md | pnpm build |

---

## Success Criteria

### Verification Commands
```bash
# RPG 스탯 시스템 정의됨
grep -c "HP\|MP\|공격력\|방어력\|레벨\|경험치\|인벤토리\|골드" agent/.claude/CLAUDE.md  # Expected: >= 8

# character.json 스키마 정의됨
grep "character.json" agent/.claude/CLAUDE.md  # Expected: non-empty

# NPC 이름들 존재
grep -c "장노인\|독고련\|제이크\|엘드릭\|엘라리온" agent/.claude/CLAUDE.md  # Expected: >= 4

# 저작권 이름 없음
grep -ci "Star Wars\|Harry Potter\|Lord of the Rings\|Jedi\|Hogwarts" agent/.claude/CLAUDE.md  # Expected: 0

# 세계관 이름 page.tsx와 일치
grep "무림\|갤럭틱 오디세이\|아케인 아칸\|고대 반지의 연대기" agent/.claude/CLAUDE.md  # Expected: all 4

# 빌드 통과
pnpm build  # Expected: exit 0

# 템플릿 빌드 통과
pnpm build:template  # Expected: "Build Complete!"
```

### Final Checklist
- [x] CLAUDE.md에 RPG 스탯 시스템 정의 (HP, MP, 공격, 방어, 레벨, XP, 골드, 인벤토리)
- [x] CLAUDE.md에 character.json 스키마 및 저장/로드 지시 포함
- [x] CLAUDE.md에 4개 세계관 각각 NPC, 지명, 직업, 기본무기, 고유설정 포함
- [x] CLAUDE.md에 도구 제한 (Read/Write만 허용, 나머지 금지) 명확히 기재
- [x] CLAUDE.md에 상태 블록 형식 포함
- [x] CLAUDE.md에 캐릭터 사망/게임오버 처리 포함
- [x] CLAUDE.md에 스토리 아크 구조 포함
- [x] 세계관 이름이 page.tsx의 WORLDS 배열과 정확히 일치
- [x] `pnpm build` 성공
- [x] `pnpm build:template` 성공
- [x] Playwright E2E 테스트 통과
- [x] origin/main에 push 완료
- [x] 저작권 이름 없음
- [x] CLAUDE.md 350줄 이하
