import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "@/theme/colors";

export default function BrandHeader() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.wrapper}>
      <Image
        source={require("../../assets/green logo.webp")}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="Baro Amharic logo"
      />
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate("Profile")}
        accessibilityRole="button"
        accessibilityLabel="Open profile"
      >
        <Text style={styles.profileInitial}>A</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: {
    flex: 1,
    height: 58,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    marginLeft: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitial: { color: colors.cream, fontSize: 17, fontWeight: "700" },
});
