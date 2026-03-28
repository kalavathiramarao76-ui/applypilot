import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Calendar, Target } from "lucide-react";
import type { Application, Job } from "@applypilot/shared";

const statusVariantMap: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "purple"> = {
  saved: "secondary",
  applied: "default",
  screening: "purple",
  interview: "warning",
  offer: "success",
  rejected: "destructive",
  withdrawn: "outline",
};

interface ApplicationCardProps {
  application: Application & { job?: Job | null };
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const statusVariant = statusVariantMap[application.status || "saved"] || "secondary";

  return (
    <Card className="hover:shadow-md transition-all hover:border-blue-200 dark:hover:border-blue-800">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">
                {application.job?.jobTitle || "Untitled Position"}
              </h3>
              <Badge variant={statusVariant} className="capitalize shrink-0">
                {application.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {application.job?.companyName || "Unknown Company"}
              </span>
              {application.atsScore && (
                <span className="flex items-center gap-1">
                  <Target className="h-3.5 w-3.5" />
                  ATS: {application.atsScore}%
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {application.createdAt
                  ? new Date(application.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
