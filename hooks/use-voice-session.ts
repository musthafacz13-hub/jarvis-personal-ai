import { useCallback, useRef, useState } from "react";
import { Platform } from "react-native";
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from "expo-speech-recognition";

export function useVoiceSession({ onFinalTranscript }: { onFinalTranscript: (transcript: string) => void }) {
  const [isListening, setIsListening] = useState(false); const [transcript, setTranscript] = useState(""); const [error, setError] = useState<string | null>(null); const handler = useRef(onFinalTranscript); handler.current = onFinalTranscript;
  useSpeechRecognitionEvent("result", (event) => { const latest = event.results[0]?.transcript?.trim() ?? ""; setTranscript(latest); if (event.isFinal && latest) { setIsListening(false); handler.current(latest); } });
  useSpeechRecognitionEvent("error", (event) => { setIsListening(false); if (event.error !== "aborted") setError(event.message || "Jarvis could not hear that clearly."); });
  useSpeechRecognitionEvent("end", () => setIsListening(false));
  const start = useCallback(async () => { setTranscript(""); setError(null); if (Platform.OS === "web") { setError("Live speech recognition requires the signed iPhone build. Use the text command box in this preview."); return; } const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync(); if (permission.status !== "granted") { setError("Microphone and speech-recognition access are required for tap-to-talk."); return; } if (!ExpoSpeechRecognitionModule.isRecognitionAvailable()) { setError("Speech recognition is unavailable right now. Try the text command box."); return; } setIsListening(true); ExpoSpeechRecognitionModule.start({ lang: "en-US", interimResults: true, maxAlternatives: 1, contextualStrings: ["Jarvis", "reminder", "calendar", "agenda"], iosTaskHint: "confirmation", requiresOnDeviceRecognition: false }); }, []);
  const stop = useCallback(() => ExpoSpeechRecognitionModule.stop(), []);
  return { isListening, transcript, error, start, stop };
}
