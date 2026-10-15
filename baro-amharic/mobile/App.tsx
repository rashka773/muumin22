import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "@/navigation/RootNavigator";
import { LessonProvider } from "@/context/LessonContext";
import { ProgressProvider } from "@/context/ProgressContext";
import { colors } from "@/theme/colors";

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.card,
    text: colors.cream,
    border: colors.border,
    primary: colors.gold,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <LessonProvider>
        <ProgressProvider>
          <NavigationContainer theme={navigationTheme}>
            <StatusBar style="light" />
            <RootNavigator />
          </NavigationContainer>
        </ProgressProvider>
      </LessonProvider>
    </SafeAreaProvider>
  );
}
