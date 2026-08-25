export type PermissionState = "granted" | "denied" | "undetermined" | "unavailable";

export type PermissionSnapshot = {
  calendar: PermissionState;
  reminders: PermissionState;
  notifications: PermissionState;
};

export type AgendaItem = {
  id: string;
  kind: "event" | "reminder";
  title: string;
  startsAt: string | null;
  endsAt?: string | null;
  completed?: boolean;
  source?: string;
};

export type ReminderDraft = {
  kind: "reminder";
  title: string;
  dueAt: string;
};

export type EventDraft = {
  kind: "event";
  title: string;
  startsAt: string;
  endsAt: string;
};

export type AgendaDraft = { kind: "agenda" };
export type UnknownDraft = { kind: "unknown" };
export type CommandDraft = ReminderDraft | EventDraft | AgendaDraft | UnknownDraft;

export type CommandResult = {
  draft: CommandDraft;
  response: string;
  requiresConfirmation: boolean;
};
