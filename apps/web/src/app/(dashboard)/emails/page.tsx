"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Mail,
  Heart,
  DollarSign,
  LogOut,
  ThumbsUp,
  ThumbsDown,
  Users,
  Send,
  Loader2,
  Copy,
  Check,
  Sparkles,
  Lightbulb,
  Clock,
} from "lucide-react";
import type { Job } from "@applypilot/shared";

const emailTypes = [
  { value: "follow-up", label: "Follow Up", icon: Clock, color: "from-blue-500 to-blue-600", description: "Check in after applying or an interview" },
  { value: "thank-you", label: "Thank You", icon: Heart, color: "from-pink-500 to-rose-600", description: "Post-interview gratitude" },
  { value: "negotiate", label: "Negotiate Offer", icon: DollarSign, color: "from-green-500 to-emerald-600", description: "Salary and benefits negotiation" },
  { value: "withdraw", label: "Withdraw", icon: LogOut, color: "from-gray-500 to-gray-600", description: "Gracefully decline to continue" },
  { value: "accept", label: "Accept Offer", icon: ThumbsUp, color: "from-emerald-500 to-teal-600", description: "Formally accept a job offer" },
  { value: "decline", label: "Decline Offer", icon: ThumbsDown, color: "from-red-500 to-orange-600", description: "Politely decline a job offer" },
  { value: "networking", label: "Networking", icon: Users, color: "from-purple-500 to-violet-600", description: "Connect with industry professionals" },
  { value: "cold-outreach", label: "Cold Outreach", icon: Send, color: "from-indigo-500 to-blue-600", description: "Reach out to a target company" },
];

interface GeneratedEmail {
  subject: string;
  body: string;
  tips: string[];
}

interface HistoryItem {
  type: string;
  email: GeneratedEmail;
  timestamp: Date;
}

export default function EmailsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState<GeneratedEmail | null>(null);
  const [editedBody, setEditedBody] = useState("");
  const [editedSubject, setEditedSubject] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch("/api/jobs");
        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs || []);
        }
      } catch (err) {
        console.error("Failed to load jobs:", err);
      }
    }
    loadJobs();
  }, []);

  function openGenerator(type: string) {
    setSelectedType(type);
    setDialogOpen(true);
    setGeneratedEmail(null);
    setSelectedJob("");
    setContext("");
    setCopied(false);
  }

  async function generateEmail() {
    if (!selectedType) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          jobId: selectedJob || undefined,
          context: context || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedEmail(data);
        setEditedBody(data.body);
        setEditedSubject(data.subject);
        setHistory((prev) => [
          { type: selectedType!, email: data, timestamp: new Date() },
          ...prev,
        ]);
      }
    } catch (err) {
      console.error("Failed to generate email:", err);
    } finally {
      setLoading(false);
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(
        `Subject: ${editedSubject}\n\n${editedBody}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }

  const currentTypeInfo = emailTypes.find((t) => t.value === selectedType);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Email Templates</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Generate professional emails for every stage of your job search
        </p>
      </div>

      {/* Email type grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {emailTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => openGenerator(type.value)}
            className="group text-left"
          >
            <Card className="h-full hover:shadow-lg transition-all hover:border-blue-200 dark:hover:border-blue-800 group-hover:scale-[1.02]">
              <CardContent className="p-5">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-3`}>
                  <type.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold mb-1">{type.label}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {type.description}
                </p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      {/* History section */}
      {history.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Emails</h2>
          <div className="space-y-3">
            {history.slice(0, 5).map((item, i) => {
              const typeInfo = emailTypes.find((t) => t.value === item.type);
              return (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${typeInfo?.color || "from-gray-500 to-gray-600"} flex items-center justify-center`}>
                        {typeInfo && <typeInfo.icon className="h-4 w-4 text-white" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.email.subject}</p>
                        <p className="text-xs text-gray-500">
                          {typeInfo?.label} -- {item.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedType(item.type);
                        setGeneratedEmail(item.email);
                        setEditedBody(item.email.body);
                        setEditedSubject(item.email.subject);
                        setDialogOpen(true);
                        setCopied(false);
                      }}
                    >
                      View
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Generator dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {currentTypeInfo && (
                <div className={`h-7 w-7 rounded-lg bg-gradient-to-br ${currentTypeInfo.color} flex items-center justify-center`}>
                  <currentTypeInfo.icon className="h-3.5 w-3.5 text-white" />
                </div>
              )}
              {currentTypeInfo?.label || "Generate"} Email
            </DialogTitle>
            <DialogDescription>
              {currentTypeInfo?.description}
            </DialogDescription>
          </DialogHeader>

          {!generatedEmail ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Related Job (optional)
                </label>
                <Select value={selectedJob} onValueChange={setSelectedJob}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a job for context" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map((j) => (
                      <SelectItem key={j.id} value={j.id}>
                        {j.jobTitle} - {j.companyName || "Unknown"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Additional Context (optional)
                </label>
                <Textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Add any specific details... e.g., interviewer's name, specific topics discussed, your counter-offer amount"
                  className="min-h-[80px]"
                />
              </div>

              <Button
                onClick={generateEmail}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Email
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Subject</label>
                <Input
                  value={editedSubject}
                  onChange={(e) => setEditedSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Body</label>
                <Textarea
                  value={editedBody}
                  onChange={(e) => setEditedBody(e.target.value)}
                  className="min-h-[250px] font-mono text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={copyToClipboard} className="flex-1">
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setGeneratedEmail(null);
                    setCopied(false);
                  }}
                >
                  Regenerate
                </Button>
              </div>

              {generatedEmail.tips.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-4">
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-2 flex items-center gap-1">
                    <Lightbulb className="h-4 w-4" /> Pro Tips
                  </p>
                  <ul className="space-y-1">
                    {generatedEmail.tips.map((tip, i) => (
                      <li key={i} className="text-xs text-amber-600 dark:text-amber-400 flex items-start gap-1.5">
                        <span className="mt-0.5">--</span> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
