import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";
import LearnNavigator from "@/navigation/LearnNavigator";
import HomeScreen from "@/screens/Home/HomeScreen";
import LessonScreen from "@/screens/Lesson/LessonScreen";
import PracticeScreen from "@/screens/Practice/PracticeScreen";
import SavedScreen from "@/screens/Saved/SavedScreen";
import ProgressScreen from "@/screens/Progress/ProgressScreen";
import { colors } from "@/theme/colors";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const stackScreenOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.cream,
  contentStyle: { backgroundColor: colors.background },
};

// Home tab: Home -> Lesson -> Practice, all pushed on one stack so the
// bottom tab bar stays visible per the brief's "permanent bottom navigation".
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="HomeRoot" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Lesson" component={LessonScreen} options={{ title: "" }} />
      <Stack.Screen name="Practice" component={PracticeScreen} options={{ title: "Practice" }} />
      <Stack.Screen name="Saved" component={SavedScreen} options={{ title: "Saved" }} />
    </Stack.Navigator>
  );
}

// Learn tab: category tabs -> Lesson -> Practice
function LearnStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="LearnRoot" component={LearnNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Lesson" component={LessonScreen} options={{ title: "" }} />
      <Stack.Screen name="Practice" component={PracticeScreen} options={{ title: "Practice" }} />
    </Stack.Navigator>
  );
}

// Profile tab: Progress -> Saved
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="ProgressRoot" component={ProgressScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Saved" component={SavedScreen} options={{ title: "Saved" }} />
    </Stack.Navigator>
  );
}

function TabIcon({ symbol }: { symbol: string }) {
  return <Text style={{ fontSize: 18 }}>{symbol}</Text>;
}

export default function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
      }}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ tabBarIcon: () => <TabIcon symbol="🏠" /> }} />
      <Tab.Screen name="Learn" component={LearnStack} options={{ tabBarIcon: () => <TabIcon symbol="📖" /> }} />
      <Tab.Screen
        name="PracticeTab"
        component={PracticeScreen}
        options={{ title: "Practice", tabBarIcon: () => <TabIcon symbol="✏️" /> }}
      />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ tabBarIcon: () => <TabIcon symbol="👤" /> }} />
    </Tab.Navigator>
  );
}
