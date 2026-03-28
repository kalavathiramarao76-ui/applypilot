import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { colors, spacing } from "../../lib/theme";

export default function SignupScreen() {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await signup(name.trim(), email.trim(), password);
    } catch (err: any) {
      Alert.alert("Signup Failed", err.message || "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoIcon}>AP</Text>
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.tagline}>
              Start your smarter job search today
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Full Name"
              icon="person-outline"
              placeholder="John Doe"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
            />
            <Input
              label="Email"
              icon="mail-outline"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <Input
              label="Password"
              icon="lock-closed-outline"
              placeholder="At least 6 characters"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password-new"
            />

            <Button
              title="Create Account"
              onPress={handleSignup}
              loading={loading}
              style={styles.button}
            />

            <View style={styles.linkContainer}>
              <Text style={styles.linkText}>Already have an account? </Text>
              <Link href="/(auth)/login" style={styles.link}>
                Sign In
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl + spacing.md,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  logoIcon: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  tagline: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  button: {
    marginTop: spacing.sm,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.lg,
  },
  linkText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  link: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
});
