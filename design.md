# Jarvis Personal AI — Mobile Interface Design

## Product intent

Jarvis is a calm, capable personal assistant for an iPhone XR. The MVP is designed for a **single user in portrait orientation** and prioritizes fast, one-handed voice commands over dense controls. The interface must feel like a first-party iOS utility: restrained, legible, quiet when idle, and explicit before a command changes personal data.

## Screen list

| Screen | Primary content and functionality |
| --- | --- |
| **Home / Briefing** | Shows a short greeting, the next upcoming event, outstanding reminders, assistant status, and a large tap-to-talk control. It is the primary daily-use screen. |
| **Voice Session** | A focused listening state with a live transcript, cancel control, and a subtle listening pulse. After recognition, it shows the interpreted command and Jarvis response. |
| **Agenda** | Displays today's Calendar events and reminders in chronological order. The user can refresh permissions/data and open a concise spoken or visual summary. |
| **Reminders** | Shows open reminders and supports creating, completing, editing, or deleting a reminder. Destructive changes require confirmation. |
| **Calendar** | Shows upcoming events and supports creating, editing, or deleting an event. Changes require confirmation before EventKit is called. |
| **Command Review** | Explains the parsed voice command in plain English, including the exact reminder/event change that will be made. The user can confirm, edit, or cancel. |
| **Settings & Permissions** | Explains microphone, speech recognition, Calendar, Reminders, and notification access. It also controls spoken responses and the Jarvis tone. |

## Primary content and hierarchy

The Home screen uses an iOS-safe layout for the iPhone XR notch and home indicator. The upper third contains a short status line such as “Good afternoon. You have two items requiring attention.” The middle area contains one high-priority agenda card and one reminders card. The lower third is reserved for the large circular voice button, reachable with the thumb. A small text prompt entry point remains available for quiet environments.

The listening state replaces secondary UI rather than opening a complex dashboard. It uses a dark graphite canvas, a soft electric-blue audio ring, a large transcript, and a single cancel control. If recognition is unavailable, the app clearly offers manual command entry rather than silently failing.

## Key user flows

| User goal | Flow |
| --- | --- |
| **Ask for today’s schedule** | User taps the voice button → says “What is on my schedule today?” → Jarvis fetches permitted Calendar and Reminders data → displays and speaks a concise briefing. |
| **Create a reminder** | User taps the voice button → says “Remind me to call Rahul tomorrow at 6 PM” → parser proposes title and due time → Command Review shows details → user confirms → reminder is created → Jarvis confirms aloud. |
| **Create a calendar event** | User taps the voice button → says “Add a meeting with Sarah Friday at 3 PM for one hour” → parser extracts details → Command Review → user confirms → event is saved → Jarvis confirms aloud. |
| **View open tasks** | User opens Reminders from the tab bar → sees open items ordered by due date → completes an item or opens it for editing → confirmation is shown for deletion. |
| **Set up access** | User opens Settings → taps the relevant permission action → iOS permission dialog appears → the screen updates to show the permission status and clear next action. |

## Color choices

The brand avoids a literal movie-interface imitation while keeping a precise, technical assistant mood. **Graphite #0B1020** is the default dark canvas; **midnight navy #101A33** gives cards visual depth; **arc blue #38BDF8** is reserved for the speaking/listening state and primary actions; **signal cyan #67E8F9** marks live transcript accents; **warm ivory #F8FAFC** supports readable primary text; **slate #94A3B8** is used for secondary text; **confirmation green #34D399**, **attention amber #FBBF24**, and **destructive red #FB7185** communicate system status.

Light mode remains available but uses very pale blue-grey surfaces rather than pure white. The default remains dark mode to establish the assistant-like experience while reducing perceived glare during voice interaction.

## Interaction and accessibility decisions

Each touch target is at least 44 by 44 points. The main listening control is substantially larger than secondary actions and placed close to the bottom edge without colliding with the home indicator. Interface text respects Dynamic Type, and all controls have meaningful accessibility labels. Spoken confirmations are mirrored in text. Haptics are used only when listening starts, when a command is confirmed, and when an error needs attention.

## MVP boundary

The first release includes **tap-to-talk**, manual text command fallback, local command parsing for common reminder/calendar tasks, concise Jarvis-style responses, EventKit-based Calendar and Reminders operations, local notifications, and a permission/settings screen. It excludes always-on wake-word detection, unrestricted reading of Messages/WhatsApp/other-app notifications, cloud accounts, third-party message sending, and unbounded AI chat. These are intentionally deferred to preserve the 20-hour timeline and the zero-cost requirement.
