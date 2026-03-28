import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { colors, spacing } from "../lib/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  if (variant === "outline") {
    return (
      <TouchableOpacity
        style={[styles.button, styles.outline, isDisabled && styles.disabled, style]}
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary} size="small" />
        ) : (
          <Text style={[styles.text, styles.outlineText, textStyle]}>
            {title}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  if (variant === "ghost") {
    return (
      <TouchableOpacity
        style={[styles.ghost, isDisabled && styles.disabled, style]}
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.7}
      >
        <Text style={[styles.ghostText, textStyle]}>{title}</Text>
      </TouchableOpacity>
    );
  }

  if (variant === "secondary") {
    return (
      <TouchableOpacity
        style={[styles.button, styles.secondary, isDisabled && styles.disabled, style]}
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color={colors.text} size="small" />
        ) : (
          <Text style={[styles.text, textStyle]}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.button, styles.primary, isDisabled && styles.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} size="small" />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surfaceLight,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghost: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  outlineText: {
    color: colors.primary,
  },
  ghostText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
});
