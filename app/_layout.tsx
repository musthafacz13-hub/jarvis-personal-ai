import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import { ThemeProvider } from "@/lib/theme-provider";
import { JarvisProvider } from "@/lib/jarvis-context";

Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }) });

export default function RootLayout() {
  return <ThemeProvider><JarvisProvider><Stack><Stack.Screen name="(tabs)" options={{ headerShown: false }} /><Stack.Screen name="oauth/callback" options={{ headerShown: false }} /></Stack><StatusBar style="light" /></JarvisProvider></ThemeProvider>;
}
