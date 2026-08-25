import { Platform } from "react-native";
import * as Calendar from "expo-calendar";
import * as Notifications from "expo-notifications";
import type { AgendaItem, EventDraft, PermissionSnapshot, PermissionState, ReminderDraft } from "@/lib/jarvis-types";

function normalizeStatus(status?: string): PermissionState { return status === "granted" ? "granted" : status === "denied" ? "denied" : "undetermined"; }
function unavailable(): PermissionSnapshot { return { calendar: "unavailable", reminders: "unavailable", notifications: "unavailable" }; }

export async function getPermissionSnapshot(): Promise<PermissionSnapshot> {
  if (Platform.OS === "web") return unavailable();
  const calendar = await Calendar.getCalendarPermissionsAsync();
  const reminders = Platform.OS === "ios" ? await Calendar.getRemindersPermissionsAsync() : null;
  const notifications = await Notifications.getPermissionsAsync();
  return { calendar: normalizeStatus(calendar.status), reminders: reminders ? normalizeStatus(reminders.status) : "unavailable", notifications: normalizeStatus(notifications.status) };
}

export async function requestJarvisPermissions(): Promise<PermissionSnapshot> {
  if (Platform.OS === "web") return unavailable();
  await Calendar.requestCalendarPermissionsAsync();
  if (Platform.OS === "ios") await Calendar.requestRemindersPermissionsAsync();
  await Notifications.requestPermissionsAsync();
  return getPermissionSnapshot();
}

export async function loadAgenda(): Promise<AgendaItem[]> {
  if (Platform.OS === "web") return [];
  const permissions = await getPermissionSnapshot();
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const end = new Date(start); end.setDate(end.getDate() + 14);
  const items: AgendaItem[] = [];
  if (permissions.calendar === "granted") {
    const ids = (await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT)).filter((calendar) => calendar.isVisible !== false).map((calendar) => calendar.id);
    if (ids.length) items.push(...(await Calendar.getEventsAsync(ids, start, end)).map((event) => ({ id: event.id, kind: "event" as const, title: event.title || "Untitled event", startsAt: new Date(event.startDate).toISOString(), endsAt: new Date(event.endDate).toISOString(), source: event.calendarId })));
  }
  if (Platform.OS === "ios" && permissions.reminders === "granted") {
    const ids = (await Calendar.getCalendarsAsync(Calendar.EntityTypes.REMINDER)).map((calendar) => calendar.id);
    items.push(...(await Calendar.getRemindersAsync(ids, Calendar.ReminderStatus.INCOMPLETE, start, end)).map((reminder) => ({ id: reminder.id ?? `${reminder.calendarId ?? "reminder"}-${reminder.title ?? "untitled"}-${String(reminder.dueDate ?? "")}`, kind: "reminder" as const, title: reminder.title || "Untitled reminder", startsAt: reminder.dueDate ? new Date(reminder.dueDate).toISOString() : null, completed: reminder.completed, source: reminder.calendarId })));
  }
  return items.sort((a, b) => !a.startsAt ? 1 : !b.startsAt ? -1 : new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}

export async function createReminder(draft: ReminderDraft) {
  if (Platform.OS !== "ios") throw new Error("Reminders are available on iPhone only.");
  const dueAt = new Date(draft.dueAt);
  const id = await Calendar.createReminderAsync(null, { title: draft.title, dueDate: dueAt, startDate: dueAt, completed: false });
  const permission = await Notifications.getPermissionsAsync();
  if (permission.status === "granted" && dueAt.getTime() > Date.now()) await Notifications.scheduleNotificationAsync({ content: { title: "Jarvis reminder", body: draft.title, sound: false }, trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: dueAt } });
  return id;
}

export async function createEvent(draft: EventDraft) {
  if (Platform.OS === "web") throw new Error("Calendar access requires the signed iPhone build.");
  const calendar = await Calendar.getDefaultCalendarAsync();
  if (!calendar.id) throw new Error("No default calendar is available on this iPhone.");
  return Calendar.createEventAsync(calendar.id, { title: draft.title, startDate: new Date(draft.startsAt), endDate: new Date(draft.endsAt), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC", alarms: [{ relativeOffset: -10 }] });
}

export async function completeReminder(id: string) { const reminder = await Calendar.getReminderAsync(id); await Calendar.updateReminderAsync(id, { ...reminder, completed: true }); }
export async function deleteReminder(id: string) { await Calendar.deleteReminderAsync(id); }
export async function deleteEvent(id: string) { await Calendar.deleteEventAsync(id, {}); }
