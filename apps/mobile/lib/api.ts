import * as SecureStore from "expo-secure-store";

const API_BASE = "http://localhost:3000";

async function fetchWithAuth(path: string, options?: RequestInit) {
  const token = await SecureStore.getItemAsync("token");
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  login: (data: { email: string; password: string }) =>
    fetchWithAuth("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  signup: (data: { name: string; email: string; password: string }) =>
    fetchWithAuth("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getProfile: () => fetchWithAuth("/api/auth/me"),
  updateProfile: (data: Record<string, unknown>) =>
    fetchWithAuth("/api/auth/me", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  getApplications: () => fetchWithAuth("/api/applications"),
  createApplication: (data: Record<string, unknown>) =>
    fetchWithAuth("/api/applications", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateApplication: (id: string, data: Record<string, unknown>) =>
    fetchWithAuth(`/api/applications/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteApplication: (id: string) =>
    fetchWithAuth(`/api/applications/${id}`, { method: "DELETE" }),
  getResumes: () => fetchWithAuth("/api/resumes"),
  getDashboard: () => fetchWithAuth("/api/dashboard"),
  analyzeJob: (data: { url?: string; description?: string }) =>
    fetchWithAuth("/api/ai/analyze-job", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  tailorResume: (data: { resumeId: string; jobDescription: string }) =>
    fetchWithAuth("/api/ai/tailor", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  generateCoverLetter: (data: {
    resumeId: string;
    jobDescription: string;
  }) =>
    fetchWithAuth("/api/ai/cover-letter", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
