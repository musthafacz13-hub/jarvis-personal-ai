import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { completeReminder, createEvent, createReminder, deleteEvent, deleteReminder, getPermissionSnapshot, loadAgenda, requestJarvisPermissions } from "@/lib/calendar-service";
import type { AgendaItem, CommandDraft, PermissionSnapshot } from "@/lib/jarvis-types";

const KEY = "jarvis-preferences-v1";
type JarvisContextValue = { agenda: AgendaItem[]; permissions: PermissionSnapshot; isRefreshing: boolean; spokenResponses: boolean; refresh: () => Promise<void>; requestAccess: () => Promise<void>; setSpokenResponses: (value: boolean) => Promise<void>; executeDraft: (draft: CommandDraft) => Promise<string>; completeReminderById: (id: string) => Promise<void>; deleteItem: (item: AgendaItem) => Promise<void>; };
const JarvisContext = createContext<JarvisContextValue | null>(null);

export function JarvisProvider({ children }: { children: ReactNode }) {
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [permissions, setPermissions] = useState<PermissionSnapshot>({ calendar: "undetermined", reminders: "undetermined", notifications: "undetermined" });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [spokenResponses, setSpokenResponsesState] = useState(true);
  const refresh = useCallback(async () => { setIsRefreshing(true); try { setPermissions(await getPermissionSnapshot()); setAgenda(await loadAgenda()); } finally { setIsRefreshing(false); } }, []);
  useEffect(() => { AsyncStorage.getItem(KEY).then((saved) => { if (!saved) return; const parsed = JSON.parse(saved) as { spokenResponses?: boolean }; if (typeof parsed.spokenResponses === "boolean") setSpokenResponsesState(parsed.spokenResponses); }).catch(() => undefined); refresh().catch(() => undefined); }, [refresh]);
  const requestAccess = useCallback(async () => { setIsRefreshing(true); try { setPermissions(await requestJarvisPermissions()); setAgenda(await loadAgenda()); } finally { setIsRefreshing(false); } }, []);
  const setSpokenResponses = useCallback(async (value: boolean) => { setSpokenResponsesState(value); await AsyncStorage.setItem(KEY, JSON.stringify({ spokenResponses: value })); }, []);
  const executeDraft = useCallback(async (draft: CommandDraft) => { if (draft.kind === "agenda") { await refresh(); return "Your agenda is up to date."; } if (draft.kind === "reminder") { await createReminder(draft); await refresh(); return `Done. I added the reminder: ${draft.title}.`; } if (draft.kind === "event") { await createEvent(draft); await refresh(); return `Done. ${draft.title} is on your calendar.`; } return "No change was made."; }, [refresh]);
  const completeReminderById = useCallback(async (id: string) => { await completeReminder(id); await refresh(); }, [refresh]);
  const deleteItem = useCallback(async (item: AgendaItem) => { if (item.kind === "reminder") await deleteReminder(item.id); else await deleteEvent(item.id); await refresh(); }, [refresh]);
  const value = useMemo(() => ({ agenda, permissions, isRefreshing, spokenResponses, refresh, requestAccess, setSpokenResponses, executeDraft, completeReminderById, deleteItem }), [agenda, permissions, isRefreshing, spokenResponses, refresh, requestAccess, setSpokenResponses, executeDraft, completeReminderById, deleteItem]);
  return <JarvisContext.Provider value={value}>{children}</JarvisContext.Provider>;
}
export function useJarvis() { const context = useContext(JarvisContext); if (!context) throw new Error("useJarvis must be used inside JarvisProvider"); return context; }
