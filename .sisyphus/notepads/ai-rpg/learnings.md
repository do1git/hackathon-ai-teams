# RPG Game Master System Prompt Learnings

- CLAUDE.md is a powerful way to inject system-level instructions into the Claude Agent SDK.
- Using `settingSources: ["user", "project"]` in the agent configuration ensures that `CLAUDE.md` is loaded.
- When designing an RPG GM prompt, it's important to define clear boundaries (Anti-Tool-Abuse) to prevent the agent from trying to use development tools in a narrative context.
- Providing structured choices while allowing free-form input creates a balanced user experience.
- Language directives are essential for multi-lingual support in global applications.
- Copyright-safe names are necessary when building commercial or public-facing applications to avoid legal issues.

## UI Customization
- Updated branding to "AI 텍스트 RPG"
- Changed default workspace visibility to hidden (`useState(false)`)
- Updated accent colors to warm gold/amber tones (OKLCH)
- Verified build passes with `pnpm build`
