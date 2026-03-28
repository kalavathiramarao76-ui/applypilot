import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../lib/api";
import StatCard from "../../components/StatCard";
import ApplicationCard from "../../components/ApplicationCard";
import { colors, spacing } from "../../lib/theme";

interface DashboardData {
  totalApplications: number;
  appliedThisWeek: number;
  interviewRate: number;
  avgAtsScore: number;
  recentApplications: Array<{
    id: string;
    company: string;
    title: string;
    status: string;
    atsScore?: number;
    createdAt: string;
  }>;
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      const result = await api.getDashboard();
      setData(result);
    } catch {
      // Use fallback data if API not available
      setData({
        totalApplications: 0,
        appliedThisWeek: 0,
        interviewRate: 0,
        avgAtsScore: 0,
        recentApplications: [],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDashboard();
    }, [fetchDashboard])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>{firstName}</Text>
          </View>
          <TouchableOpacity style={styles.notifButton}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              icon="documents-outline"
              value={data?.totalApplications ?? 0}
              label="Total Applications"
              color={colors.primary}
            />
            <StatCard
              icon="trending-up-outline"
              value={data?.appliedThisWeek ?? 0}
              label="Applied This Week"
              color={colors.secondary}
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              icon="people-outline"
              value={`${data?.interviewRate ?? 0}%`}
              label="Interview Rate"
              color={colors.success}
            />
            <StatCard
              icon="analytics-outline"
              value={data?.avgAtsScore ?? 0}
              label="Avg ATS Score"
              color={colors.warning}
            />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Applications</Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/applications")}
          >
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {data?.recentApplications && data.recentApplications.length > 0 ? (
          data.recentApplications.slice(0, 5).map((app) => (
            <ApplicationCard
              key={app.id}
              company={app.company}
              title={app.title}
              status={app.status}
              atsScore={app.atsScore}
              dateApplied={app.createdAt}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="document-text-outline"
              size={48}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>No applications yet</Text>
            <Text style={styles.emptySubtext}>
              Start by using Quick Apply to find and apply to jobs
            </Text>
          </View>
        )}
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  greeting: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  name: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "700",
  },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  statsGrid: {
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "600",
  },
  viewAll: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing.xl + spacing.lg,
  },
  emptyText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
    marginTop: spacing.md,
  },
  emptySubtext: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xl,
  },
});
