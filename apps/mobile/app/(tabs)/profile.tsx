import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../lib/api";
import Button from "../../components/Button";
import { colors, spacing } from "../../lib/theme";

export default function ProfileScreen() {
  const { user, logout, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [headline, setHeadline] = useState(user?.headline || "");
  const [summary, setSummary] = useState(user?.summary || "");
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    try {
      const profile = await api.getProfile();
      const data = profile.user || profile;
      setName(data.name || "");
      setHeadline(data.headline || "");
      setSummary(data.summary || "");
      setSkills(data.skills || []);
    } catch {
      // use existing user data
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateProfile({ name, headline, summary, skills });
      await refreshUser();
      Alert.alert("Success", "Profile updated");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials || "?"}</Text>
          </View>
          <Text style={styles.nameDisplay}>{name || "Your Name"}</Text>
          {user?.tier && (
            <View
              style={[
                styles.tierBadge,
                user.tier === "pro" && styles.tierBadgePro,
              ]}
            >
              <Ionicons
                name={user.tier === "pro" ? "diamond" : "person"}
                size={14}
                color={
                  user.tier === "pro" ? colors.warning : colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.tierText,
                  user.tier === "pro" && styles.tierTextPro,
                ]}
              >
                {user.tier === "pro" ? "Pro" : "Free"} Plan
              </Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Personal Info</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your full name"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={styles.label}>Headline</Text>
          <TextInput
            style={styles.input}
            value={headline}
            onChangeText={setHeadline}
            placeholder="e.g. Senior Software Engineer"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={styles.label}>Summary</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={summary}
            onChangeText={setSummary}
            placeholder="Brief professional summary..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.tagsContainer}>
            {skills.map((skill) => (
              <TouchableOpacity
                key={skill}
                style={styles.tag}
                onPress={() => removeSkill(skill)}
              >
                <Text style={styles.tagText}>{skill}</Text>
                <Ionicons
                  name="close-circle"
                  size={16}
                  color={colors.primary}
                />
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.addSkillRow}>
            <TextInput
              style={[styles.input, styles.skillInput]}
              value={newSkill}
              onChangeText={setNewSkill}
              placeholder="Add a skill..."
              placeholderTextColor={colors.textSecondary}
              onSubmitEditing={addSkill}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.addButton} onPress={addSkill}>
              <Ionicons name="add" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title="Save Profile"
          onPress={handleSave}
          loading={saving}
          style={styles.saveButton}
        />

        {user?.tier !== "pro" && (
          <Button
            title="Upgrade to Pro"
            onPress={() =>
              Alert.alert("Upgrade", "Pro upgrade coming soon!")
            }
            variant="outline"
            style={styles.upgradeButton}
          />
        )}

        <Button
          title="Logout"
          onPress={handleLogout}
          variant="ghost"
          textStyle={styles.logoutText}
          style={styles.logoutButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl + spacing.xl,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  avatarText: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "700",
  },
  nameDisplay: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  tierBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: 20,
    gap: spacing.xs,
  },
  tierBadgePro: {
    backgroundColor: colors.warning + "20",
  },
  tierText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  tierTextPro: {
    color: colors.warning,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "500",
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontSize: 15,
  },
  textArea: {
    minHeight: 80,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary + "20",
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: 8,
    gap: spacing.xs,
  },
  tagText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "500",
  },
  addSkillRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  skillInput: {
    flex: 1,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    marginBottom: spacing.sm,
  },
  upgradeButton: {
    marginBottom: spacing.sm,
  },
  logoutButton: {
    marginTop: spacing.md,
  },
  logoutText: {
    color: colors.error,
  },
});
