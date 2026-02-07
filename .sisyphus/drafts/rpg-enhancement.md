# Draft: RPG Enhancement

## Requirements (confirmed)
- **RPG 시스템**: 풍부한 RPG (HP, MP, 인벤토리, 경험치, 레벨업)
- **상태 저장**: 에이전트가 `/workspace/data/`에 캐릭터 상태 파일 저장 허용
- **세계관 확장**: 각 세계관에 고유 NPC 2-3명, 주요 지명 3-4개, 고유 설정/룰 추가
- **게임 테스트**: Playwright로 배포된 사이트에서 실제 게임 플레이 테스트
- **배포 방식**: origin/main으로 push → 자동 배포
- **DB**: 연결 완료

## Technical Decisions
- CLAUDE.md에 RPG 스탯 시스템 추가 (에이전트가 매 턴 상태 표시)
- Anti-tool-abuse 완화: Write/Read 허용 (캐릭터 상태 저장용만), Bash/WebSearch/etc 금지 유지
- 상태 파일 형식: JSON (`/workspace/data/character.json`)
- 스토리 아크 구조 추가 (도입→성장→위기→클라이맥스→결말)
- 템플릿 리빌드 필요 (CLAUDE.md가 Docker 이미지에 bake됨)

## Scope Boundaries
- INCLUDE: CLAUDE.md 강화, 템플릿 리빌드, 게임 테스트, 버그 수정, push
- EXCLUDE: agent/src/agent.ts 수정, components/* 수정, API 라우트 수정, 새 npm 의존성

## Open Questions
- (없음 — 모든 요구사항 확인됨)
