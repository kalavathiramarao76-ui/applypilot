"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Search,
  Building2,
  Users,
  TrendingUp,
  Star,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Newspaper,
  ArrowRight,
} from "lucide-react";

interface CompanyData {
  company: string;
  jobTitle?: string;
  overview: {
    description: string;
    industry: string;
    size: string;
    founded: string;
    fundingStage: string;
    headquarters: string;
    techStack: string[];
  };
  culture: {
    values: string[];
    workStyle: string;
    diversity: string;
    benefits: string[];
  };
  interviewProcess: {
    rounds: { stage: string; description: string; tips: string }[];
    duration: string;
    difficulty: string;
    commonQuestions: string[];
  };
  salaryInsights: {
    range: string;
    glassdoorRating: string;
    compensationNotes: string;
  };
  whatTheyLookFor: string[];
  prosAndCons: {
    pros: string[];
    cons: string[];
  };
  recentDevelopments: string[];
  tipsForApplicants: string[];
}

export default function CompanyPage() {
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CompanyData | null>(null);
  const [error, setError] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const handleSearch = async (name?: string) => {
    const searchName = name || companyName;
    if (!searchName.trim()) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch("/api/ai/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: searchName,
          jobTitle: jobTitle || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch company data");
      }

      const result = await res.json();
      setData(result);
      setRecentSearches((prev) => {
        const filtered = prev.filter(
          (s) => s.toLowerCase() !== searchName.toLowerCase()
        );
        return [searchName, ...filtered].slice(0, 8);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold">Company Intelligence</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Research any company with AI-powered insights
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Company name (e.g., Google, Stripe, Airbnb)"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSearch()
                }
              />
            </div>
            <div className="w-64">
              <Input
                placeholder="Job title (optional)"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSearch()
                }
              />
            </div>
            <Button onClick={() => handleSearch()} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2">Research</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {recentSearches.length > 0 && !data && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            Recent Searches
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {recentSearches.map((name) => (
              <Card
                key={name}
                className="cursor-pointer hover:border-blue-300 transition-colors"
                onClick={() => {
                  setCompanyName(name);
                  handleSearch(name);
                }}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-sm truncate">{name}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20">
          <CardContent className="p-4 text-red-700 dark:text-red-400">
            {error}
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-gray-500">
            Researching {companyName}... This may take a moment.
          </p>
        </div>
      )}

      {data && !loading && (
        <div className="space-y-6">
          {/* Company Header */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{data.company}</h2>
                  <p className="text-blue-100 mt-1">
                    {data.overview.industry} &middot; {data.overview.size}{" "}
                    employees &middot; {data.overview.headquarters}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">
                      {data.overview.fundingStage}
                    </Badge>
                    <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">
                      Founded {data.overview.founded}
                    </Badge>
                    {data.salaryInsights.glassdoorRating && (
                      <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">
                        <Star className="h-3 w-3 mr-1" />
                        {data.salaryInsights.glassdoorRating} rating
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="interview">Interview</TabsTrigger>
              <TabsTrigger value="culture">Culture</TabsTrigger>
              <TabsTrigger value="salary">Salary</TabsTrigger>
              <TabsTrigger value="tips">Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    Company Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {data.overview.description}
                  </p>
                  {data.overview.techStack.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500 mb-2">
                        Tech Stack
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {data.overview.techStack.map((tech) => (
                          <Badge key={tech} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Newspaper className="h-5 w-5 text-purple-600" />
                    Recent Developments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {data.recentDevelopments.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-purple-600">
                            {i + 1}
                          </span>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    What They Look For
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {data.whatTheyLookFor.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/10"
                      >
                        <ArrowRight className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interview" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-500">Rounds</p>
                    <p className="text-2xl font-bold">
                      {data.interviewProcess.rounds.length}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="text-2xl font-bold">
                      {data.interviewProcess.duration}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-500">Difficulty</p>
                    <p className="text-2xl font-bold">
                      {data.interviewProcess.difficulty}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Interview Rounds</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.interviewProcess.rounds.map((round, i) => (
                      <div
                        key={i}
                        className="relative pl-8 pb-4 last:pb-0 border-l-2 border-blue-200 dark:border-blue-800 last:border-transparent"
                      >
                        <div className="absolute left-[-9px] top-0 h-4 w-4 rounded-full bg-blue-600" />
                        <h4 className="font-semibold">{round.stage}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {round.description}
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                          Tip: {round.tips}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Common Interview Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {data.interviewProcess.commonQuestions.map((q, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                      >
                        <span className="text-sm font-medium text-blue-600 flex-shrink-0">
                          Q{i + 1}
                        </span>
                        <span className="text-sm">{q}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="culture" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Company Values</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {data.culture.values.map((value) => (
                      <Badge
                        key={value}
                        className="px-4 py-2 text-sm bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 dark:from-blue-950/30 dark:to-purple-950/30 dark:text-blue-300 border-0"
                      >
                        {value}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Work Style & Culture</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    {data.culture.workStyle}
                  </p>
                  <div>
                    <p className="font-medium text-sm text-gray-500 mb-1">
                      Diversity & Inclusion
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {data.culture.diversity}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Benefits & Perks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {data.culture.benefits.map((benefit, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2 rounded bg-green-50 dark:bg-green-900/10"
                      >
                        <Star className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-green-200 dark:border-green-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                      <ThumbsUp className="h-5 w-5" />
                      Pros
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {data.prosAndCons.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-green-600 mt-0.5">+</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="border-red-200 dark:border-red-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                      <ThumbsDown className="h-5 w-5" />
                      Cons
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {data.prosAndCons.cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-red-600 mt-0.5">-</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="salary" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Salary Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
                    <p className="text-lg font-semibold text-green-700 dark:text-green-400">
                      {data.salaryInsights.range}
                    </p>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {data.salaryInsights.compensationNotes}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tips" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    Tips for Standing Out
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.tipsForApplicants.map((tip, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/10"
                      >
                        <div className="h-8 w-8 rounded-full bg-yellow-200 dark:bg-yellow-800 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-yellow-700 dark:text-yellow-300">
                            {i + 1}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 pt-1">
                          {tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
