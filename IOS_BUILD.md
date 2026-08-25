# Jarvis for iPhone XR — Mac Build and Sideloading Guide

## What this MVP includes

Jarvis is an English-first personal assistant for iPhone XR. The initial build provides a **tap-to-talk command surface**, a text-command fallback, Calendar and Reminders permissions, agenda readout, approved Calendar/Reminder creation, local reminder alerts, and concise spoken responses. Commands that would create an event or reminder always show a review sheet before the change is committed.

The app intentionally does not attempt to read WhatsApp, Messages, Mail, or other-app notifications. It also does not use an always-on custom wake word. These features are outside the safe and reliable scope of a zero-cost iPhone MVP.

## Before building on the Mac

Use a Mac with a current version of Xcode installed and sign in to Xcode with the Apple ID that will install the app on the iPhone XR. Connect the iPhone with a cable, unlock it, and tap **Trust** if prompted. Keep the phone on iOS 16.4 or later for the best Calendar permission behavior.

This project uses native iOS modules for Speech recognition, Calendar, Reminders, and local notifications. It must be installed as a native development build; it cannot be tested fully from a browser preview or standard Expo Go.

## Build steps

First, download this project as a ZIP from the project controls, unzip it on the Mac, and open Terminal in the extracted folder. Then run the following commands:

```bash
pnpm install
npx expo prebuild --clean --platform ios
open ios/*.xcworkspace
```

In Xcode, select the project in the left sidebar, then select the app target. Under **Signing & Capabilities**, choose your Apple ID team and enable **Automatically manage signing**. Choose the connected iPhone XR as the run target and press **Run**.

> A free personal Apple ID can install a development-signed build on your own device, but Apple may require periodic re-signing. The iPhone may also ask you to trust the developer profile in **Settings → General → VPN & Device Management**.

## First launch checklist

On first launch, tap **Connect** on the Jarvis home screen. Approve access for Calendar, Reminders, and Notifications. Then tap the voice orb and approve Microphone and Speech Recognition access. If the device is in Silent Mode, turn the physical Silent switch off to hear spoken replies.

Try these commands after access is granted:

| Goal | Example command |
| --- | --- |
| Read agenda | “What is on my schedule today?” |
| Create reminder | “Remind me to call Rahul tomorrow at 6 PM.” |
| Create event | “Add meeting Friday at 3 PM for one hour.” |

Jarvis presents an explicit confirmation sheet for new events and reminders. Canceling the sheet means no calendar or reminder data changes.

## Validation notes

The included deterministic command tests can be run with `pnpm test`, and type checking with `pnpm check`. Physical iPhone validation is still required for microphone/Speech access and for reading/writing the owner’s actual Calendar and Reminders data, because those features are intentionally unavailable in a browser preview.
