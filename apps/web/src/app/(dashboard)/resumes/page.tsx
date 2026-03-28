"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Calendar } from "lucide-react";
import Link from "next/link";
import type { Resume } from "@applypilot/shared";

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/resumes");
        if (res.ok) {
          const data = await res.json();
          setResumes(data.resumes || []);
        }
      } catch (err) {
        console.error("Failed to load resumes:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Resume Vault</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your resumes and create tailored versions
          </p>
        </div>
        <Link href="/resumes/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Resume
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : resumes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No resumes yet. Upload your first resume to get started!
            </p>
            <Link href="/resumes/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Resume
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map((resume) => (
            <Link key={resume.id} href={`/resumes/${resume.id}`}>
            <Card
              className="hover:shadow-md transition-all hover:border-blue-200 dark:hover:border-blue-800 cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  {resume.isBase && (
                    <Badge variant="purple">Base</Badge>
                  )}
                </div>
                <h3 className="font-semibold mb-1">{resume.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <Calendar className="h-3.5 w-3.5" />
                  {resume.createdAt
                    ? new Date(resume.createdAt).toLocaleDateString()
                    : "N/A"}
                </div>
                {resume.tags && (resume.tags as string[]).length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {(resume.tags as string[]).slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
