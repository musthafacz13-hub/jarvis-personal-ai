import { Platform } from "react-native";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function TabLayout() {
  const colors = useColors(); const insets = useSafeAreaInsets(); const bottom = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  return <Tabs screenOptions={{ headerShown: false, tabBarButton: HapticTab, tabBarActiveTintColor: colors.tint, tabBarInactiveTintColor: colors.icon, tabBarStyle: { height: 56 + bottom, paddingTop: 8, paddingBottom: bottom, backgroundColor: colors.background, borderTopColor: colors.border } }}>
    <Tabs.Screen name="index" options={{ title: "Jarvis", tabBarIcon: ({ color }) => <IconSymbol name="waveform" size={24} color={color} /> }} />
    <Tabs.Screen name="agenda" options={{ title: "Agenda", tabBarIcon: ({ color }) => <IconSymbol name="calendar" size={23} color={color} /> }} />
    <Tabs.Screen name="reminders" options={{ title: "Tasks", tabBarIcon: ({ color }) => <IconSymbol name="checkmark.circle" size={24} color={color} /> }} />
    <Tabs.Screen name="settings" options={{ title: "Settings", tabBarIcon: ({ color }) => <IconSymbol name="gearshape.fill" size={23} color={color} /> }} />
  </Tabs>;
}
