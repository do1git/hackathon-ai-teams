## Learnings
- The `Write` tool may fail if the file already exists and hasn't been read in the current session, or if the environment enforces `Edit` for existing files.
- Using `Edit` to replace large blocks of text is a reliable alternative to `Write` when `Write` is restricted.
- Always verify the exact line numbers and content when performing full-file replacements with `Edit`.

- Playwright MCP sessions can reset to the landing screen after certain operations; take a fresh snapshot before reusing old refs.
- For this app, reliable response readiness is confirmed by waiting until the loading line `게임 마스터가 이야기를 준비하고 있습니다...` disappears and the input textbox is re-enabled.
- Moorim flow validation can be done semantically (keywords like `무림`, `검객`, `화산파`, and status tokens like `HP`/`MP`) instead of exact narrative matching.

---

## Final Project Completion - 2026-02-07

### Project Summary
Successfully transformed the hackathon-starter chat app into a feature-rich AI text RPG.

### Completed Features
1. **RPG Stats System**: HP/MP/ATK/DEF/Level/XP/Gold/Inventory
2. **State Persistence**: character.json with full schema
3. **Roguelike System**: Death → restart with legacy bonuses
4. **Special Events**: 5-7 turn random boss/dungeon/NPC encounters
5. **4 Detailed Worlds**: NPCs, locations, jobs per world

### Technical Achievements
- CLAUDE.md: 139 lines (well under 350 limit)
- Template rebuild: pgsmz5e4xvgpp1mratdo
- E2E tests: All passed with Playwright
- Deployment: https://hackathon-ai-teams.vercel.app

### Key Success Factors
- Clear separation of concerns (Workspace Rules preserved)
- Concrete stat values prevent agent inconsistency
- Random event timing creates replayability
- Roguelike bonuses reward persistence

### Testing Insights
- 120s timeout essential for agent responses
- Keyword checking more reliable than exact text
- Screenshots invaluable for debugging

### Commits
- 65b0364: UI enhancements
- 6a21be2: RPG system implementation

### Status: COMPLETE ✅
All acceptance criteria met. Ready for hackathon.
