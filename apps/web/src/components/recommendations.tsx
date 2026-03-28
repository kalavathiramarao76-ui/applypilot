"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Search, TrendingUp } from "lucide-react";

interface Recommendation {
  title: string;
  company: string;
  reasoning: string;
  searchQuery: string;
  estimatedMatchScore: number;
  tips: string[];
}

interface RecommendResult {
  recommendations: Recommendation[];
  careerInsights: string;
}

export function Recommendations() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendResult | null>(null);

  async function loadRecommendations() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error("Failed to load recommendations:", err);
    } finally {
      setLoading(false);
    }
  }

  if (!result) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recommended For You</h2>
          <Button onClick={loadRecommendations} disabled={loading} size="sm">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Get AI Recommendations
              </>
            )}
          </Button>
        </div>
        <Card>
          <CardContent className="py-8 text-center">
            <Sparkles className="h-10 w-10 mx-auto text-purple-400 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Get AI-powered job recommendations based on your profile and application history.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recommended For You</h2>
        <Button onClick={loadRecommendations} disabled={loading} variant="outline" size="sm">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {result.recommendations?.slice(0, 6).map((rec, i) => (
          <Card key={i} className="hover:shadow-md transition-all hover:border-purple-200 dark:hover:border-purple-800">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-sm leading-tight">{rec.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{rec.company}</p>
                </div>
                <Badge
                  variant={rec.estimatedMatchScore >= 80 ? "success" : rec.estimatedMatchScore >= 60 ? "warning" : "secondary"}
                >
                  {rec.estimatedMatchScore}%
                </Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
                {rec.reasoning}
              </p>
              <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                <Search className="h-3 w-3" />
                <span className="truncate">{rec.searchQuery}</span>
              </div>
              {rec.tips?.[0] && (
                <div className="flex items-start gap-1.5 text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20 rounded p-2">
                  <TrendingUp className="h-3 w-3 mt-0.5 shrink-0" />
                  <span>{rec.tips[0]}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {result.careerInsights && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Career Insights</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{result.careerInsights}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
