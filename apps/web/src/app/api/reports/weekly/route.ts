import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { applications, jobs, aiGenerations } from "@zypply/shared";
import { eq, and, gte, desc } from "@zypply/shared";
import { generateAI } from "@/lib/ai";

export async function GET(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const threeWeeksAgo = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000);
    const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

    // Get all applications for the last 4 weeks
    const allApps = await db
      .select()
      .from(applications)
      .where(
        and(
          eq(applications.userId, session.userId),
          gte(applications.createdAt, fourWeeksAgo)
        )
      )
      .orderBy(desc(applications.createdAt));

    // Get all user applications for streak calculation
    const allUserApps = await db
      .select({ createdAt: applications.createdAt })
      .from(applications)
      .where(eq(applications.userId, session.userId))
      .orderBy(desc(applications.createdAt));

    // Bucket by week
    const thisWeek = allApps.filter(
      (a) => a.createdAt && new Date(a.createdAt) >= oneWeekAgo
    );
    const lastWeek = allApps.filter(
      (a) =>
        a.createdAt &&
        new Date(a.createdAt) >= twoWeeksAgo &&
        new Date(a.createdAt) < oneWeekAgo
    );
    const week3 = allApps.filter(
      (a) =>
        a.createdAt &&
        new Date(a.createdAt) >= threeWeeksAgo &&
        new Date(a.createdAt) < twoWeeksAgo
    );
    const week4 = allApps.filter(
      (a) =>
        a.createdAt &&
        new Date(a.createdAt) >= fourWeeksAgo &&
        new Date(a.createdAt) < threeWeeksAgo
    );

    // Stats
    const thisWeekApplied = thisWeek.filter(
      (a) => a.status && a.status !== "saved"
    ).length;
    const lastWeekApplied = lastWeek.filter(
      (a) => a.status && a.status !== "saved"
    ).length;
    const thisWeekResponses = thisWeek.filter(
      (a) =>
        a.status &&
        ["screening", "interview", "offer", "rejected"].includes(a.status)
    ).length;
    const lastWeekResponses = lastWeek.filter(
      (a) =>
        a.status &&
        ["screening", "interview", "offer", "rejected"].includes(a.status)
    ).length;
    const thisWeekInterviews = thisWeek.filter(
      (a) => a.status === "interview" || a.status === "offer"
    ).length;
    const lastWeekInterviews = lastWeek.filter(
      (a) => a.status === "interview" || a.status === "offer"
    ).length;

    // ATS score trend
    const thisWeekAts = thisWeek
      .filter((a) => a.atsScore != null)
      .map((a) => a.atsScore!);
    const lastWeekAts = lastWeek
      .filter((a) => a.atsScore != null)
      .map((a) => a.atsScore!);
    const avgAtsThisWeek =
      thisWeekAts.length > 0
        ? Math.round(
            thisWeekAts.reduce((a, b) => a + b, 0) / thisWeekAts.length
          )
        : null;
    const avgAtsLastWeek =
      lastWeekAts.length > 0
        ? Math.round(
            lastWeekAts.reduce((a, b) => a + b, 0) / lastWeekAts.length
          )
        : null;

    // Weekly trend (last 4 weeks)
    const weeklyTrend = [
      { week: "4 weeks ago", count: week4.length },
      { week: "3 weeks ago", count: week3.length },
      { week: "2 weeks ago", count: lastWeek.length },
      { week: "This week", count: thisWeek.length },
    ];

    // Streak calculation
    let streak = 0;
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    let checkDate = new Date(weekStart);
    while (true) {
      const weekEnd = new Date(checkDate);
      const weekBegin = new Date(
        checkDate.getTime() - 7 * 24 * 60 * 60 * 1000
      );
      const hasApps = allUserApps.some(
        (a) =>
          a.createdAt &&
          new Date(a.createdAt) >= weekBegin &&
          new Date(a.createdAt) < weekEnd
      );
      if (hasApps) {
        streak++;
        checkDate = weekBegin;
      } else {
        break;
      }
    }

    // Pipeline health
    const pipelineGrowing = thisWeek.length >= lastWeek.length;
    const totalInPipeline = allApps.filter(
      (a) =>
        a.status &&
        ["applied", "screening", "interview"].includes(a.status)
    ).length;

    // AI insights
    const statsContext = {
      thisWeekApplied,
      lastWeekApplied,
      thisWeekResponses,
      thisWeekInterviews,
      avgAtsThisWeek,
      avgAtsLastWeek,
      pipelineGrowing,
      totalInPipeline,
      streak,
      weeklyTrend: weeklyTrend.map((w) => w.count),
    };

    let aiInsights = {
      insights: [
        "Keep up the momentum with your applications!",
        "Consider tailoring your resume for each role to improve response rates.",
      ],
      actionItems: [
        "Apply to at least 5 jobs this week",
        "Follow up on any pending applications older than 1 week",
      ],
    };

    try {
      const text = await generateAI({
        messages: [{ role: "user", content: `You are a supportive career coach. Based on this user's weekly job search stats, provide brief motivational insights and specific action items.

Stats: ${JSON.stringify(statsContext)}

Respond in JSON:
{
  "insights": ["2-3 specific insights about their search pattern"],
  "actionItems": ["3-4 specific action items for next week"]
}` }],
        maxTokens: 1024,
      });

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiInsights = JSON.parse(jsonMatch[0]);
      }
    } catch {
      // Use default insights if AI fails
    }

    await db.insert(aiGenerations).values({
      userId: session.userId,
      type: "weekly_report",
      input: statsContext as Record<string, unknown>,
      output: JSON.stringify(aiInsights),
    });

    return Response.json({
      period: {
        start: oneWeekAgo.toISOString(),
        end: now.toISOString(),
      },
      stats: {
        applicationsSent: { thisWeek: thisWeekApplied, lastWeek: lastWeekApplied },
        responsesReceived: { thisWeek: thisWeekResponses, lastWeek: lastWeekResponses },
        interviewsScheduled: { thisWeek: thisWeekInterviews, lastWeek: lastWeekInterviews },
        atsScoreTrend: { thisWeek: avgAtsThisWeek, lastWeek: avgAtsLastWeek },
      },
      weeklyTrend,
      pipelineHealth: {
        growing: pipelineGrowing,
        totalActive: totalInPipeline,
      },
      streak,
      insights: aiInsights.insights,
      actionItems: aiInsights.actionItems,
    });
  } catch (error) {
    console.error("Weekly report error:", error);
    return Response.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
