import React, { useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../lib/api";
import Button from "../../components/Button";
import { colors, spacing } from "../../lib/theme";

interface JobAnalysis {
  title: string;
  company: string;
  requirements: string[];
  skills: string[];
  description: string;
}

interface Resume {
  id: string;
  name: string;
}

export default function QuickApplyScreen() {
  const [jobInput, setJobInput] = useState("");
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [tailoredResult, setTailoredResult] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [tailoring, setTailoring] = useState(false);
  const [generatingCL, setGeneratingCL] = useState(false);
  const [showTailored, setShowTailored] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(false);

  const handleAnalyze = async () => {
    if (!jobInput.trim()) {
      Alert.alert("Error", "Please enter a job URL or description");
      return;
    }
    setAnalyzing(true);
    setAnalysis(null);
    setTailoredResult(null);
    setCoverLetter(null);
    setAtsScore(null);
    try {
      const isUrl = jobInput.trim().startsWith("http");
      const result = await api.analyzeJob(
        isUrl ? { url: jobInput.trim() } : { description: jobInput.trim() }
      );
      setAnalysis(result.analysis || result);
      setAtsScore(result.atsScore ?? null);

      // Fetch resumes
      try {
        const resumeData = await api.getResumes();
        setResumes(resumeData.resumes || resumeData || []);
        if (resumeData.resumes?.length > 0 || resumeData.length > 0) {
          const list = resumeData.resumes || resumeData;
          setSelectedResume(list[0].id);
        }
      } catch {
        setResumes([]);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to analyze job");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTailor = async () => {
    if (!selectedResume) {
      Alert.alert("Error", "Please select a resume");
      return;
    }
    setTailoring(true);
    try {
      const result = await api.tailorResume({
        resumeId: selectedResume,
        jobDescription: jobInput.trim(),
      });
      setTailoredResult(result.tailored || result.content || JSON.stringify(result));
      setShowTailored(true);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to tailor resume");
    } finally {
      setTailoring(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!selectedResume) {
      Alert.alert("Error", "Please select a resume");
      return;
    }
    setGeneratingCL(true);
    try {
      const result = await api.generateCoverLetter({
        resumeId: selectedResume,
        jobDescription: jobInput.trim(),
      });
      setCoverLetter(result.coverLetter || result.content || JSON.stringify(result));
      setShowCoverLetter(true);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to generate cover letter");
    } finally {
      setGeneratingCL(false);
    }
  };

  const reset = () => {
    setJobInput("");
    setAnalysis(null);
    setResumes([]);
    setSelectedResume(null);
    setAtsScore(null);
    setTailoredResult(null);
    setCoverLetter(null);
    setShowTailored(false);
    setShowCoverLetter(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Quick Apply</Text>
        <Text style={styles.subtitle}>
          Paste a job URL or description to get started
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textArea}
            placeholder="Paste job URL or description here..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            value={jobInput}
            onChangeText={setJobInput}
          />
          <Button
            title={analyzing ? "Analyzing..." : "Analyze Job"}
            onPress={handleAnalyze}
            loading={analyzing}
            disabled={!jobInput.trim()}
            style={styles.analyzeButton}
          />
        </View>

        {analysis && (
          <>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons
                  name="briefcase"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.cardTitle}>Job Details</Text>
              </View>
              <Text style={styles.jobTitle}>{analysis.title}</Text>
              <Text style={styles.jobCompany}>{analysis.company}</Text>

              {analysis.requirements && analysis.requirements.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Requirements</Text>
                  {analysis.requirements.slice(0, 5).map((req, i) => (
                    <View key={i} style={styles.bulletRow}>
                      <Text style={styles.bullet}>-</Text>
                      <Text style={styles.bulletText}>{req}</Text>
                    </View>
                  ))}
                </View>
              )}

              {analysis.skills && analysis.skills.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Key Skills</Text>
                  <View style={styles.tagsRow}>
                    {analysis.skills.map((skill, i) => (
                      <View key={i} style={styles.skillTag}>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {atsScore !== null && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons
                    name="analytics"
                    size={20}
                    color={colors.warning}
                  />
                  <Text style={styles.cardTitle}>ATS Score Preview</Text>
                </View>
                <Text
                  style={[
                    styles.bigScore,
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

            {resumes.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Select Resume</Text>
                {resumes.map((resume) => (
                  <TouchableOpacity
                    key={resume.id}
                    style={[
                      styles.resumeOption,
                      selectedResume === resume.id &&
                        styles.resumeOptionActive,
                    ]}
                    onPress={() => setSelectedResume(resume.id)}
                  >
                    <Ionicons
                      name={
                        selectedResume === resume.id
                          ? "radio-button-on"
                          : "radio-button-off"
                      }
                      size={20}
                      color={
                        selectedResume === resume.id
                          ? colors.primary
                          : colors.textSecondary
                      }
                    />
                    <Text style={styles.resumeName}>{resume.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.actionButtons}>
              <Button
                title={tailoring ? "Tailoring..." : "Tailor Resume"}
                onPress={handleTailor}
                loading={tailoring}
                disabled={!selectedResume}
                style={styles.actionButton}
              />
              <Button
                title={generatingCL ? "Generating..." : "Generate Cover Letter"}
                onPress={handleGenerateCoverLetter}
                loading={generatingCL}
                disabled={!selectedResume}
                variant="secondary"
                style={styles.actionButton}
              />
            </View>

            {tailoredResult && (
              <View style={styles.card}>
                <TouchableOpacity
                  style={styles.expandHeader}
                  onPress={() => setShowTailored(!showTailored)}
                >
                  <Text style={styles.cardTitle}>Tailored Resume</Text>
                  <Ionicons
                    name={showTailored ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
                {showTailored && (
                  <Text style={styles.resultText}>{tailoredResult}</Text>
                )}
              </View>
            )}

            {coverLetter && (
              <View style={styles.card}>
                <TouchableOpacity
                  style={styles.expandHeader}
                  onPress={() => setShowCoverLetter(!showCoverLetter)}
                >
                  <Text style={styles.cardTitle}>Cover Letter</Text>
                  <Ionicons
                    name={showCoverLetter ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
                {showCoverLetter && (
                  <Text style={styles.resultText}>{coverLetter}</Text>
                )}
              </View>
            )}

            <Button
              title="Start Over"
              onPress={reset}
              variant="ghost"
              style={styles.resetButton}
            />
          </>
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
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl + spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    marginBottom: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  textArea: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    color: colors.text,
    fontSize: 15,
    minHeight: 120,
    marginBottom: spacing.md,
  },
  analyzeButton: {
    marginTop: 0,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  jobTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 2,
  },
  jobCompany: {
    color: colors.textSecondary,
    fontSize: 15,
    marginBottom: spacing.sm,
  },
  section: {
    marginTop: spacing.sm,
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 4,
    paddingRight: spacing.md,
  },
  bullet: {
    color: colors.textSecondary,
    marginRight: spacing.sm,
    fontSize: 14,
  },
  bulletText: {
    color: colors.text,
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  skillTag: {
    backgroundColor: colors.primary + "20",
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  skillText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  bigScore: {
    fontSize: 48,
    fontWeight: "800",
    textAlign: "center",
    marginVertical: spacing.sm,
  },
  resumeOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: 10,
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  resumeOptionActive: {
    backgroundColor: colors.primary + "10",
  },
  resumeName: {
    color: colors.text,
    fontSize: 15,
  },
  actionButtons: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  expandHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  resetButton: {
    marginTop: spacing.sm,
  },
});
