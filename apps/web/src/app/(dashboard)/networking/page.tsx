"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Copy,
  Check,
  ArrowLeft,
  Linkedin,
  Mail,
  MessageSquare,
  UserPlus,
  HandshakeIcon,
  Heart,
  AlertTriangle,
  Clock,
  Lightbulb,
} from "lucide-react";

const MESSAGE_TYPES = [
  {
    id: "linkedin-connection" as const,
    label: "LinkedIn Connection Request",
    description: "Send a connection request with a personalized note",
    icon: UserPlus,
    color: "blue",
  },
  {
    id: "linkedin-message" as const,
    label: "LinkedIn Message",
    description: "Message someone you are already connected with",
    icon: Linkedin,
    color: "blue",
  },
  {
    id: "informational-interview" as const,
    label: "Informational Interview Request",
    description: "Ask to learn about their role or company",
    icon: MessageSquare,
    color: "purple",
  },
  {
    id: "referral-request" as const,
    label: "Referral Request",
    description: "Ask for a referral to an open position",
    icon: HandshakeIcon,
    color: "green",
  },
  {
    id: "thank-you-after-meeting" as const,
    label: "Thank You After Meeting",
    description: "Follow up after an informational chat or interview",
    icon: Heart,
    color: "pink",
  },
  {
    id: "cold-email-recruiter" as const,
    label: "Cold Email to Recruiter",
    description: "Reach out to a recruiter you do not know",
    icon: Mail,
    color: "orange",
  },
];

type MessageType = (typeof MESSAGE_TYPES)[number]["id"];

interface MessageResult {
  type: string;
  subjectLine: string;
  mainMessage: string;
  followUpMessage: string;
  tips: string[];
  donts: string[];
  bestTimeToSend: string;
  expectedResponseRate: string;
}

interface HistoryItem {
  type: MessageType;
  recipientName: string;
  company: string;
  result: MessageResult;
  timestamp: Date;
}

const colorClasses: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
  green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
  pink: "bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400",
  orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
};

export default function NetworkingPage() {
  const [selectedType, setSelectedType] = useState<MessageType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<MessageResult | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [form, setForm] = useState({
    recipientName: "",
    recipientRole: "",
    recipientCompany: "",
    howFound: "",
    yourRole: "",
    goal: "",
    additionalContext: "",
  });

  const handleGenerate = async () => {
    if (!selectedType) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/ai/networking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          context: form,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate message");
      }

      const data = await res.json();
      setResult(data);
      setHistory((prev) => [
        {
          type: selectedType,
          recipientName: form.recipientName,
          company: form.recipientCompany,
          result: data,
          timestamp: new Date(),
        },
        ...prev,
      ].slice(0, 20));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleBack = () => {
    setSelectedType(null);
    setResult(null);
    setError("");
    setForm({
      recipientName: "",
      recipientRole: "",
      recipientCompany: "",
      howFound: "",
      yourRole: "",
      goal: "",
      additionalContext: "",
    });
  };

  // Type selection view
  if (!selectedType) {
    return (
      <div className="space-y-6 max-w-5xl">
        <div>
          <h1 className="text-3xl font-bold">Networking Assistant</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Generate personalized professional messages with AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MESSAGE_TYPES.map((type) => (
            <Card
              key={type.id}
              className="cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
              onClick={() => setSelectedType(type.id)}
            >
              <CardContent className="p-6">
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${colorClasses[type.color]}`}
                >
                  <type.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1">{type.label}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {type.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {history.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Recent Messages</h3>
            <div className="space-y-2">
              {history.map((item, i) => {
                const typeInfo = MESSAGE_TYPES.find(
                  (t) => t.id === item.type
                );
                return (
                  <Card key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-8 w-8 rounded-lg flex items-center justify-center ${colorClasses[typeInfo?.color || "blue"]}`}
                        >
                          {typeInfo && <typeInfo.icon className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {typeInfo?.label} - {item.recipientName || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.company} &middot;{" "}
                            {item.timestamp.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyText(item.result.mainMessage, `history-${i}`)
                        }
                      >
                        {copiedField === `history-${i}` ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  const typeInfo = MESSAGE_TYPES.find((t) => t.id === selectedType);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{typeInfo?.label}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {typeInfo?.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form + Result */}
        <div className="lg:col-span-2 space-y-6">
          {!result && (
            <Card>
              <CardHeader>
                <CardTitle>Message Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Recipient Name</Label>
                    <Input
                      placeholder="e.g., Jane Smith"
                      value={form.recipientName}
                      onChange={(e) =>
                        setForm({ ...form, recipientName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Their Role</Label>
                    <Input
                      placeholder="e.g., Engineering Manager"
                      value={form.recipientRole}
                      onChange={(e) =>
                        setForm({ ...form, recipientRole: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Their Company</Label>
                    <Input
                      placeholder="e.g., Google"
                      value={form.recipientCompany}
                      onChange={(e) =>
                        setForm({ ...form, recipientCompany: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>How You Found Them</Label>
                    <Input
                      placeholder="e.g., LinkedIn, mutual connection, conference"
                      value={form.howFound}
                      onChange={(e) =>
                        setForm({ ...form, howFound: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Your Role / Background</Label>
                  <Input
                    placeholder="e.g., Senior Frontend Developer with 5 years experience"
                    value={form.yourRole}
                    onChange={(e) =>
                      setForm({ ...form, yourRole: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>What You Want</Label>
                  <Input
                    placeholder="e.g., Learn about their team, get a referral, informational chat"
                    value={form.goal}
                    onChange={(e) =>
                      setForm({ ...form, goal: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Additional Context (optional)</Label>
                  <Textarea
                    placeholder="Any other details that might help personalize the message..."
                    rows={3}
                    value={form.additionalContext}
                    onChange={(e) =>
                      setForm({ ...form, additionalContext: e.target.value })
                    }
                  />
                </div>
                <Button onClick={handleGenerate} disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <MessageSquare className="h-4 w-4 mr-2" />
                  )}
                  Generate Message
                </Button>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20">
              <CardContent className="p-4 text-red-700 dark:text-red-400">
                {error}
              </CardContent>
            </Card>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
              <p className="text-gray-500">Crafting your message...</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4">
              {result.subjectLine && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-base">
                      <span>Subject Line</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyText(result.subjectLine, "subject")
                        }
                      >
                        {copiedField === "subject" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{result.subjectLine}</p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <span>Main Message</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyText(result.mainMessage, "main")}
                    >
                      {copiedField === "main" ? (
                        <Check className="h-4 w-4 mr-1" />
                      ) : (
                        <Copy className="h-4 w-4 mr-1" />
                      )}
                      {copiedField === "main" ? "Copied!" : "Copy"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
                    {result.mainMessage}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <span>Follow-Up (if no response after 1 week)</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyText(result.followUpMessage, "followup")
                      }
                    >
                      {copiedField === "followup" ? (
                        <Check className="h-4 w-4 mr-1" />
                      ) : (
                        <Copy className="h-4 w-4 mr-1" />
                      )}
                      {copiedField === "followup" ? "Copied!" : "Copy"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
                    {result.followUpMessage}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  New Message
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setResult(null);
                    setError("");
                  }}
                >
                  Edit Context & Regenerate
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Tips Sidebar */}
        <div className="space-y-4">
          {result && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    Timing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Best time:</span>{" "}
                    {result.bestTimeToSend}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Response rate:</span>{" "}
                    {result.expectedResponseRate}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600" />
                    Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.tips.map((tip, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Badge
                          variant="secondary"
                          className="h-5 w-5 rounded-full flex items-center justify-center p-0 flex-shrink-0 mt-0.5"
                        >
                          {i + 1}
                        </Badge>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-200 dark:border-red-900">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2 text-red-700 dark:text-red-400">
                    <AlertTriangle className="h-4 w-4" />
                    What NOT to Do
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.donts.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-red-700 dark:text-red-400"
                      >
                        <span className="flex-shrink-0">&#10005;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          )}

          {!result && (
            <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
                  Quick Tips
                </h4>
                <ul className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
                  <li>Fill in as much detail as possible for better results</li>
                  <li>Mention specific details about the recipient</li>
                  <li>Be clear about your goal</li>
                  <li>Include how you found them for a personal touch</li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
