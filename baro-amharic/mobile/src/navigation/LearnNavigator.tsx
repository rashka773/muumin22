import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LearnCategoryScreen from "@/screens/Learn/LearnCategoryScreen";
import LearnCategoriesScreen from "@/screens/Learn/LearnCategoriesScreen";
import { Category } from "@/types/lesson";
import { colors } from "@/theme/colors";

export type LearnStackParamList = {
  Categories: undefined;
  erayo: { category: "erayo" };
  weedho: { category: "weedho" };
  wadahadal: { category: "wadahadal" };
  naxwe: { category: "naxwe" };
};

const Stack = createNativeStackNavigator<LearnStackParamList>();

const CATEGORIES: Category[] = ["erayo", "weedho", "wadahadal", "naxwe"];

export default function LearnNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Categories"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Categories" component={LearnCategoriesScreen} />
      {CATEGORIES.map((category) => (
        <Stack.Screen
          key={category}
          name={category}
          component={LearnCategoryScreen}
          initialParams={{ category }}
          options={{ headerShown: false }}
        />
      ))}
    </Stack.Navigator>
  );
}
