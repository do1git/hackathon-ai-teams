"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { CCMessages } from "@/components/chat/cc-messages";
import { PromptForm } from "@/components/chat/prompt-form";
import { WorkspacePanel } from "@/components/workspace/workspace-panel";
import type { SessionEntry, ConversationResponse } from "@/lib/types";
import { PanelRight, Home as HomeIcon, Globe } from "lucide-react";

// Pending message type for optimistic UI
interface PendingMessage {
  id: string;
  content: string;
  timestamp: string;
}

type Theme = 'lobby' | 'moorim' | 'galactic' | 'arcane' | 'fantasy';

const LANGUAGES = [
  { code: '한국어', label: '🇰🇷 한국어' },
  { code: 'English', label: '🇺🇸 English' },
  { code: '日本語', label: '🇯🇵 日本語' },
  { code: '中文', label: '🇨🇳 中文' },
];

const WORLDS = [
  {
    icon: "🗡️",
    title: "강호에 미친놈이 나타났다",
    desc: "무공, 협객, 그리고 막장 사이다 강호 활극",
    theme: "moorim" as Theme,
  },
  {
    icon: "🚀",
    title: "은하 끝에서 살아남기",
    desc: "우주 생존, 한 치 앞도 모르는 성간 서바이벌",
    theme: "galactic" as Theme,
  },
  {
    icon: "🪄",
    title: "최하급 마법사의 역습",
    desc: "바닥에서 시작하는 언더독 마법 성장기",
    theme: "arcane" as Theme,
  },
  {
    icon: "💻",
    title: "퇴사한 개발자, 이세계 왕국을 리팩토링하다",
    desc: "코드 리뷰 대신 왕국 리뷰, 개발자 이세계 전직물",
    theme: "fantasy" as Theme,
  }
];

export default function Home() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [status, setStatus] = useState<ConversationResponse["status"]>("idle");
  const [serverMessages, setServerMessages] = useState<SessionEntry[]>([]);
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [activeTheme, setActiveTheme] = useState<Theme>("lobby");
  const [language, setLanguage] = useState('한국어');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [characterStats, setCharacterStats] = useState<{
    name?: string;
    class?: string;
    world?: string;
    level?: number;
    hp?: number;
    maxHp?: number;
    mp?: number;
    maxMp?: number;
    attack?: number;
    defense?: number;
    xp?: number;
    xpToNext?: number;
    gold?: number;
    inventory?: string[];
    turnCount?: number;
    runCount?: number;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Track post-completion poll attempts to avoid infinite polling
  const postCompletionPollsRef = useRef(0);

  const getUserMessageText = useCallback((content: string | unknown[]): string => {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      return content
        .filter((b: any) => b.type === "text" && b.text)
        .map((b: any) => b.text)
        .join("\n");
    }
    return "";
  }, []);

  const parseStatsFromMessages = useCallback((msgs: SessionEntry[]) => {
    for (let i = msgs.length - 1; i >= 0; i--) {
      const m = msgs[i];
      if (m.type !== "assistant") continue;
      const text = typeof m.message.content === "string"
        ? m.message.content
        : Array.isArray(m.message.content)
          ? m.message.content.filter((b: any) => b.type === "text").map((b: any) => b.text).join("\n")
          : "";
      if (!text.includes("📊")) continue;

      const nameMatch = text.match(/📊\s*(.+?)\s*\|\s*Lv\.(\d+)\s+(.+?)\s*\|\s*🌍\s*(.+)/);
      const hpMatch = text.match(/❤️\s*HP:\s*(\d+)\/(\d+)/);
      const mpMatch = text.match(/💧\s*MP:\s*(\d+)\/(\d+)/);
      const atkMatch = text.match(/⚔️\s*ATK:\s*(\d+)/);
      const defMatch = text.match(/🛡️\s*DEF:\s*(\d+)/);
      const goldMatch = text.match(/💰\s*(?:GOLD:\s*)?(\d+)/);
      const xpMatch = text.match(/✨\s*XP:\s*(\d+)\/(\d+)/);
      const invMatch = text.match(/🎒\s*INV:\s*\[?([^\]\n]*)\]?/);
      const turnMatch = text.match(/🔄\s*TURN:\s*(\d+)/);
      const runMatch = text.match(/💀\s*RUN:\s*(\d+)/);

      if (nameMatch && hpMatch) {
        setCharacterStats({
          name: nameMatch[1].trim(),
          level: parseInt(nameMatch[2]),
          class: nameMatch[3].trim(),
          world: nameMatch[4].trim(),
          hp: parseInt(hpMatch[1]),
          maxHp: parseInt(hpMatch[2]),
          mp: mpMatch ? parseInt(mpMatch[1]) : 0,
          maxMp: mpMatch ? parseInt(mpMatch[2]) : 50,
          attack: atkMatch ? parseInt(atkMatch[1]) : 10,
          defense: defMatch ? parseInt(defMatch[1]) : 5,
          gold: goldMatch ? parseInt(goldMatch[1]) : 0,
          xp: xpMatch ? parseInt(xpMatch[1]) : 0,
          xpToNext: xpMatch ? parseInt(xpMatch[2]) : 100,
          inventory: invMatch ? invMatch[1].split(',').map((s: string) => s.trim()).filter(Boolean) : [],
          turnCount: turnMatch ? parseInt(turnMatch[1]) : 0,
          runCount: runMatch ? parseInt(runMatch[1]) : 1,
        });
        return;
      }
    }
  }, []);

  // Check if a pending message has a matching user message in server data.
  // Used to remove pending messages once the server confirms them.
  const hasPendingMatch = useCallback(
    (pending: PendingMessage, serverMsgs: SessionEntry[]) => {
      return serverMsgs.some(
        (m) =>
          m.type === "user" &&
          getUserMessageText(m.message.content) === pending.content
      );
    },
    [getUserMessageText]
  );

  // Polling for conversation updates
  // Keeps polling while "running", and also after "completed"/"error" if
  // pending messages haven't appeared in server data yet (volume sync delay).
  useEffect(() => {
    if (!conversationId) return;

    const isDone = status === "completed" || status === "error";

    // Stop polling once done AND all pending messages are resolved (or retries exhausted)
    if (isDone && (pendingMessages.length === 0 || postCompletionPollsRef.current >= 10)) return;
    if (!isDone && status !== "running") return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/conversations/${conversationId}`);
        if (response.ok) {
          const data: ConversationResponse = await response.json();

          // Update server messages
          setServerMessages(data.messages);

          // Remove only the pending messages that now appear in server data.
          // This handles both first-turn (no prior messages) and multi-turn
          // (prior messages exist but new ones haven't synced yet).
          if (data.messages.length > 0) {
            setPendingMessages((prev) =>
              prev.filter((p) => !hasPendingMatch(p, data.messages))
            );
          }

          if (data.status === "completed" || data.status === "error") {
            postCompletionPollsRef.current++;
          }

          setStatus(data.status);
          setErrorMessage(data.errorMessage || null);
          setRefreshTrigger((prev) => prev + 1);

          if (data.messages.length > 0) {
            parseStatsFromMessages(data.messages);
          }
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [conversationId, status, pendingMessages.length, hasPendingMatch]);

  // Compute combined messages: server messages + pending messages as SessionEntry
  const messages: SessionEntry[] = [
    ...serverMessages,
    ...pendingMessages.map((p): SessionEntry => ({
      type: "user",
      uuid: p.id,
      parentUuid: serverMessages.length > 0 ? serverMessages[serverMessages.length - 1].uuid : null,
      sessionId: "",
      timestamp: p.timestamp,
      isSidechain: false,
      message: {
        role: "user",
        content: p.content,
      },
    })),
  ];

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const userScrolledUpRef = useRef(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const onScroll = () => {
      const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
      userScrolledUpRef.current = distanceFromBottom > 100;
    };
    container.addEventListener('scroll', onScroll);
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!userScrolledUpRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [serverMessages, pendingMessages]);

  const handleSubmit = useCallback(
    async (content: string) => {
      setIsSubmitting(true);
      setErrorMessage(null);
      postCompletionPollsRef.current = 0;

      // Prefix first message with language tag (metadata for the agent)
      const isFirstMessage = !conversationId;
      const messageContent = isFirstMessage ? `[Language: ${language}] ${content}` : content;

      // Add pending message immediately for optimistic UI (show original content, not the tag)
      const pendingId = `pending-${Date.now()}`;
      const pendingMsg: PendingMessage = {
        id: pendingId,
        content,
        timestamp: new Date().toISOString(),
      };
      setPendingMessages((prev) => [...prev, pendingMsg]);

      try {
        const response = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId,
            content: messageContent,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to send message");
        }

        const data = await response.json();
        setConversationId(data.conversationId);
        setStatus("running");
      } catch (error) {
        // Remove pending message on error
        setPendingMessages((prev) => prev.filter((m) => m.id !== pendingId));
        setErrorMessage(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setIsSubmitting(false);
      }
    },
    [conversationId, language]
  );

  const handleWorldSelect = (world: typeof WORLDS[0]) => {
    setActiveTheme(world.theme);
    handleSubmit(world.title);
  };

  const handleReset = () => {
    setActiveTheme("lobby");
    setConversationId(null);
    setServerMessages([]);
    setPendingMessages([]);
    setStatus("idle");
    setErrorMessage(null);
    setCharacterStats(null);
  };

  const isLoading = status === "running" || isSubmitting;
  const hasMessages = messages.length > 0;

  return (
    <div data-theme={activeTheme} className="flex h-screen flex-col bg-background min-h-screen transition-colors duration-1000">
      {/* Header - RPG Style */}
      <header className="flex items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md px-4 h-[60px] sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xl font-bold text-primary rpg-title-glow">📜 Chronicles of Dimensions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowLangMenu((v) => !v)}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-sm"
              title="Language"
            >
              <Globe className="w-4 h-4" />
              <span>{LANGUAGES.find((l) => l.code === language)?.label ?? language}</span>
            </button>
            {showLangMenu && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowLangMenu(false)} />
                <div className="absolute right-0 top-full mt-1 z-30 min-w-[140px] rounded-md border border-border bg-background shadow-lg py-1">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLanguage(l.code); setShowLangMenu(false); }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors ${language === l.code ? 'text-primary font-medium' : 'text-foreground'}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          {activeTheme !== 'lobby' && (
            <button
              onClick={handleReset}
              className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Return to Lobby"
            >
              <HomeIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Chat panel */}
        <ResizablePanel defaultSize={showWorkspace ? 55 : 100} minSize={40}>
          <div className="flex h-full flex-col relative">
            {/* Messages area */}
            <div className="flex-1 overflow-auto" ref={scrollContainerRef}>
              {!hasMessages ? (
                <div className="flex min-h-full flex-col items-center justify-center px-4 py-10 animate-fade-in-up">
                  <div className="text-center mb-12 space-y-4">
                    <h1 className="font-mono text-5xl md:text-6xl font-bold text-primary rpg-title-glow mb-2">
                      Chronicles of Dimensions
                    </h1>
                    <p className="text-xl text-muted-foreground delay-100 animate-fade-in-up">
                      Infinite Tales
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mb-12 delay-200 animate-fade-in-up">
                    {WORLDS.map((world) => (
                      <button
                        key={world.title}
                        onClick={() => handleWorldSelect(world)}
                        className="rpg-card text-left group"
                        disabled={isLoading}
                      >
                        <div className="flex items-start gap-4">
                          <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{world.icon}</span>
                          <div>
                            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{world.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{world.desc}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="w-full max-w-xl delay-300 animate-fade-in-up">
                    <PromptForm
                      onSubmit={handleSubmit}
                      isLoading={isLoading}
                      disabled={status === "running"}
                      placeholder="또는 직접 입력하여 모험을 시작하세요..."
                    />
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto px-4 py-6">
                  <CCMessages entries={messages} />
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Error display - RPG Themed */}
            {errorMessage && (
              <div className="mx-4 mb-2 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive shadow-lg animate-fade-in-up">
                <span className="mr-2">⚠️</span>
                서버와의 연결이 불안정합니다. 잠시 후 다시 시도해주세요.
              </div>
            )}

            {/* Status indicator - RPG Themed */}
            {status === "running" && hasMessages && (
              <div className="mx-4 mb-2 text-sm text-primary/80 font-mono flex items-center justify-center">
                <span className="animate-pulse mr-2">🔮</span>
                <span className="shimmer">스토리 텔러가 이야기를 준비하고 있습니다...</span>
              </div>
            )}

            {/* Bottom prompt form (only when there are messages) */}
            {hasMessages && (
              <div className="border-t border-border/40 bg-background/80 backdrop-blur-sm p-4">
                <div className="max-w-3xl mx-auto">
                  {characterStats && characterStats.name && (
                    <div className="rpg-status-bar mb-3">
                      <div className="rpg-status-bar-row">
                        <span className="rpg-status-name">📊 {characterStats.name}</span>
                        <span className="rpg-status-tag">Lv.{characterStats.level ?? 1} {characterStats.class ?? ''}</span>
                        <span className="rpg-status-tag">🔄 T{characterStats.turnCount ?? 0} | 💀 R{characterStats.runCount ?? 1}</span>
                      </div>
                      <div className="rpg-status-bar-row rpg-status-bars">
                        <div className="rpg-bar-group">
                          <span className="rpg-bar-label">❤️ HP</span>
                          <div className="rpg-bar-track">
                            <div
                              className="rpg-bar-fill rpg-bar-hp"
                              style={{ width: `${Math.max(0, Math.min(100, ((characterStats.hp ?? 0) / (characterStats.maxHp ?? 100)) * 100))}%` }}
                            />
                          </div>
                          <span className="rpg-bar-value">{characterStats.hp ?? 0}/{characterStats.maxHp ?? 100}</span>
                        </div>
                        <div className="rpg-bar-group">
                          <span className="rpg-bar-label">💧 MP</span>
                          <div className="rpg-bar-track">
                            <div
                              className="rpg-bar-fill rpg-bar-mp"
                              style={{ width: `${Math.max(0, Math.min(100, ((characterStats.mp ?? 0) / (characterStats.maxMp ?? 50)) * 100))}%` }}
                            />
                          </div>
                          <span className="rpg-bar-value">{characterStats.mp ?? 0}/{characterStats.maxMp ?? 50}</span>
                        </div>
                        <div className="rpg-bar-group">
                          <span className="rpg-bar-label">✨ XP</span>
                          <div className="rpg-bar-track">
                            <div
                              className="rpg-bar-fill rpg-bar-xp"
                              style={{ width: `${Math.max(0, Math.min(100, ((characterStats.xp ?? 0) / (characterStats.xpToNext ?? 100)) * 100))}%` }}
                            />
                          </div>
                          <span className="rpg-bar-value">{characterStats.xp ?? 0}/{characterStats.xpToNext ?? 100}</span>
                        </div>
                      </div>
                      <div className="rpg-status-bar-row rpg-status-stats">
                        <span>⚔️ ATK {characterStats.attack ?? 10}</span>
                        <span>🛡️ DEF {characterStats.defense ?? 5}</span>
                        <span>💰 {characterStats.gold ?? 0}G</span>
                        {characterStats.inventory && characterStats.inventory.length > 0 && (
                          <span className="rpg-status-inv">🎒 {characterStats.inventory.join(', ')}</span>
                        )}
                      </div>
                    </div>
                  )}
                  <PromptForm
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    disabled={status === "running"}
                    placeholder="행동을 선택하거나 자유롭게 입력하세요..."
                  />
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>

        {showWorkspace && (
          <>
            <ResizableHandle className="bg-border/40" />
            <ResizablePanel defaultSize={45} minSize={25}>
              <WorkspacePanel
                conversationId={conversationId}
                refreshTrigger={refreshTrigger}
                onClose={() => setShowWorkspace(false)}
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}


