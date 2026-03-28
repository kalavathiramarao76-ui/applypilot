import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "../lib/theme";
import StatusBadge from "./StatusBadge";

interface ApplicationCardProps {
  company: string;
  title: string;
  status: string;
  atsScore?: number;
  dateApplied?: string;
  onPress?: () => void;
}

export default function ApplicationCard({
  company,
  title,
  status,
  atsScore,
  dateApplied,
  onPress,
}: ApplicationCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.companyIcon}>
          <Text style={styles.companyInitial}>
            {company.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.company} numberOfLines={1}>
            {company}
          </Text>
        </View>
        {atsScore !== undefined && (
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>ATS</Text>
            <Text
              style={[
                styles.scoreValue,
                {
                  color:
                    atsScore >= 80
                      ? colors.success
                      : atsScore >= 60
                      ? colors.warning
                      : colors.error,
                },
              ]}
            >
              {atsScore}%
            </Text>
          </View>
        )}
      </View>
      <View style={styles.footer}>
        <StatusBadge status={status} />
        {dateApplied && (
          <Text style={styles.date}>
            {new Date(dateApplied).toLocaleDateString()}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  companyIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  companyInitial: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "700",
  },
  info: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  company: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  scoreContainer: {
    alignItems: "center",
    marginLeft: spacing.sm,
  },
  scoreLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: "600",
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});
