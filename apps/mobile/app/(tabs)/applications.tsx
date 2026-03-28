import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../lib/api";
import ApplicationCard from "../../components/ApplicationCard";
import { colors, spacing } from "../../lib/theme";

const FILTERS = ["All", "Saved", "Applied", "Interview", "Offer", "Rejected"];

interface Application {
  id: string;
  company: string;
  title: string;
  status: string;
  atsScore?: number;
  createdAt: string;
}

export default function ApplicationsScreen() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchApplications = useCallback(async () => {
    try {
      const result = await api.getApplications();
      setApplications(result.applications || result || []);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchApplications();
    }, [fetchApplications])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchApplications();
  };

  const filteredApps =
    activeFilter === "All"
      ? applications
      : applications.filter(
          (app) =>
            app.status.toLowerCase() === activeFilter.toLowerCase()
        );

  const handleDelete = (id: string) => {
    Alert.alert("Delete Application", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.deleteApplication(id);
            setApplications((prev) => prev.filter((a) => a.id !== id));
          } catch {
            Alert.alert("Error", "Failed to delete application");
          }
        },
      },
    ]);
  };

  const renderFilterChip = (filter: string) => {
    const isActive = activeFilter === filter;
    return (
      <TouchableOpacity
        key={filter}
        style={[styles.chip, isActive && styles.chipActive]}
        onPress={() => setActiveFilter(filter)}
      >
        <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
          {filter}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }: { item: Application }) => (
    <ApplicationCard
      company={item.company}
      title={item.title}
      status={item.status}
      atsScore={item.atsScore}
      dateApplied={item.createdAt}
      onPress={() => handleDelete(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Applications</Text>
        <Text style={styles.count}>{applications.length} total</Text>
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={FILTERS}
          renderItem={({ item }) => renderFilterChip(item)}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filteredApps.length > 0 ? (
        <FlatList
          data={filteredApps}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons
            name="briefcase-outline"
            size={64}
            color={colors.textSecondary}
          />
          <Text style={styles.emptyTitle}>No applications found</Text>
          <Text style={styles.emptySubtext}>
            {activeFilter === "All"
              ? "Start tracking your job applications by using Quick Apply"
              : `No applications with "${activeFilter}" status`}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "700",
  },
  count: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  filterContainer: {
    marginBottom: spacing.sm,
  },
  filterList: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary + "20",
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "500",
  },
  chipTextActive: {
    color: colors.primary,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "600",
    marginTop: spacing.md,
  },
  emptySubtext: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: spacing.sm,
    lineHeight: 20,
  },
});
