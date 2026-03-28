import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../lib/theme";

const statusColors: Record<string, { bg: string; text: string }> = {
  saved: { bg: "#334155", text: "#94A3B8" },
  applied: { bg: "#1E3A5F", text: "#60A5FA" },
  interview: { bg: "#1A3636", text: "#34D399" },
  offer: { bg: "#1C2B1A", text: "#4ADE80" },
  rejected: { bg: "#3B1515", text: "#F87171" },
  default: { bg: colors.surfaceLight, text: colors.textSecondary },
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toLowerCase();
  const colorScheme = statusColors[normalized] || statusColors.default;

  return (
    <View style={[styles.badge, { backgroundColor: colorScheme.bg }]}>
      <Text style={[styles.text, { color: colorScheme.text }]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
