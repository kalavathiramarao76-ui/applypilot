import { Storage } from "@plasmohq/storage";

const API_BASE = "http://localhost:3000";

async function fetchWithAuth(
  path: string,
  options?: RequestInit
): Promise<Response> {
  const storage = new Storage();
  const token = await storage.get("token");
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers
    }
  });
}

export const api = {
  getProfile: () => fetchWithAuth("/api/auth/me").then((r) => r.json()),

  getResumes: () => fetchWithAuth("/api/resumes").then((r) => r.json()),

  analyzeJob: (data: { description: string; title?: string; company?: string }) =>
    fetchWithAuth("/api/ai/analyze-job", {
      method: "POST",
      body: JSON.stringify(data)
    }).then((r) => r.json()),

  tailorResume: (data: {
    resumeId: string;
    jobDescription: string;
    jobTitle?: string;
    company?: string;
  }) =>
    fetchWithAuth("/api/ai/tailor", {
      method: "POST",
      body: JSON.stringify(data)
    }).then((r) => r.json()),

  generateCoverLetter: (data: {
    resumeId: string;
    jobDescription: string;
    jobTitle?: string;
    company?: string;
  }) =>
    fetchWithAuth("/api/ai/cover-letter", {
      method: "POST",
      body: JSON.stringify(data)
    }).then((r) => r.json()),

  saveJob: (data: {
    title: string;
    company: string;
    location?: string;
    description: string;
    url?: string;
    source?: string;
  }) =>
    fetchWithAuth("/api/jobs", {
      method: "POST",
      body: JSON.stringify(data)
    }).then((r) => r.json()),

  createApplication: (data: { jobId: string; resumeId: string }) =>
    fetchWithAuth("/api/applications", {
      method: "POST",
      body: JSON.stringify(data)
    }).then((r) => r.json())
};
