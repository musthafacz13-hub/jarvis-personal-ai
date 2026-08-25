import type { CommandResult } from "@/lib/jarvis-types";

const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

function nextWeekday(base: Date, target: number) {
  const candidate = new Date(base);
  const delta = (target - candidate.getDay() + 7) % 7 || 7;
  candidate.setDate(candidate.getDate() + delta);
  return candidate;
}

function parseWhen(input: string, now = new Date()) {
  const date = new Date(now);
  date.setSeconds(0, 0);
  const normalized = input.toLowerCase();
  if (/\btomorrow\b/.test(normalized)) date.setDate(date.getDate() + 1);
  else {
    const weekday = weekdays.find((day) => new RegExp(`\\b${day}\\b`).test(normalized));
    if (weekday) {
      const next = nextWeekday(date, weekdays.indexOf(weekday));
      date.setFullYear(next.getFullYear(), next.getMonth(), next.getDate());
    }
  }
  const timeMatch = normalized.match(/\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/);
  if (timeMatch) {
    let hour = Number(timeMatch[1]);
    const minute = Number(timeMatch[2] ?? 0);
    if (timeMatch[3] === "pm" && hour < 12) hour += 12;
    if (timeMatch[3] === "am" && hour === 12) hour = 0;
    date.setHours(hour, minute, 0, 0);
  } else date.setHours(9, 0, 0, 0);
  return date;
}

function cleanTitle(input: string) {
  return input.replace(/\b(?:today|tomorrow|sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/gi, "").replace(/\bat\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?\b/gi, "").replace(/\bfor\s+\d+\s*(?:minute|minutes|hour|hours)\b/gi, "").replace(/\s+/g, " ").trim().replace(/[,.]$/, "");
}

function parseDuration(input: string) {
  const match = input.match(/\bfor\s+(\d+)\s*(minute|minutes|hour|hours)\b/i);
  if (!match) return 60;
  return /hour/i.test(match[2]) ? Number(match[1]) * 60 : Number(match[1]);
}

function prettyDate(value: Date) {
  return value.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export function interpretCommand(raw: string, now = new Date()): CommandResult {
  const input = raw.trim();
  const normalized = input.toLowerCase();
  if (/\b(?:what(?:'s| is)|show|read|give)\b.*\b(?:schedule|agenda|today|upcoming)\b/.test(normalized)) return { draft: { kind: "agenda" }, response: "Certainly. I will prepare your current agenda.", requiresConfirmation: false };
  if (/^(?:remind me to|create (?:a )?reminder|add (?:a )?reminder)\b/.test(normalized)) {
    const remainder = input.replace(/^(?:remind me to|create (?:a )?reminder(?: to)?|add (?:a )?reminder(?: to)?)\s*/i, "");
    const dueAt = parseWhen(remainder, now);
    const title = cleanTitle(remainder) || "Untitled reminder";
    return { draft: { kind: "reminder", title, dueAt: dueAt.toISOString() }, response: `I can remind you to ${title.toLowerCase()} on ${prettyDate(dueAt)}. Shall I add it?`, requiresConfirmation: true };
  }
  if (/^(?:add|create|schedule)\b.*\b(?:event|meeting|appointment|call)\b|^(?:add|create|schedule)\s+(?:an?\s+)?(?:meeting|appointment|call)\b/.test(normalized)) {
    const remainder = input.replace(/^(?:add|create|schedule)\s+(?:an?\s+)?/i, "");
    const startsAt = parseWhen(remainder, now);
    const endsAt = new Date(startsAt.getTime() + parseDuration(remainder) * 60_000);
    const title = cleanTitle(remainder) || "Untitled event";
    return { draft: { kind: "event", title, startsAt: startsAt.toISOString(), endsAt: endsAt.toISOString() }, response: `I can add ${title} on ${prettyDate(startsAt)}. Shall I put that on your calendar?`, requiresConfirmation: true };
  }
  return { draft: { kind: "unknown" }, response: "I can help with your agenda, reminders, and calendar. Try saying: ‘Remind me to call Rahul tomorrow at 6 PM.’", requiresConfirmation: false };
}

export function describeDraft(result: CommandResult) {
  const { draft } = result;
  if (draft.kind === "reminder") return `Reminder: ${draft.title} · ${prettyDate(new Date(draft.dueAt))}`;
  if (draft.kind === "event") return `Event: ${draft.title} · ${prettyDate(new Date(draft.startsAt))}`;
  return "No account change will be made.";
}
