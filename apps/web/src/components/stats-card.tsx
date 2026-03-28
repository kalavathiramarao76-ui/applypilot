import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: { value: number; positive: boolean };
  className?: string;
  gradient?: string;
  iconColor?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
  gradient,
  iconColor,
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        "hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 overflow-hidden",
        className
      )}
    >
      <CardContent className="p-6 relative">
        {/* Subtle gradient background */}
        {gradient && (
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-50",
              gradient
            )}
          />
        )}
        <div className="relative flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {title}
            </p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
            {trend && (
              <p
                className={cn(
                  "text-xs font-medium",
                  trend.positive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.positive ? "+" : ""}
                {trend.value}% from last week
              </p>
            )}
          </div>
          <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-3">
            <Icon
              className={cn(
                "h-6 w-6",
                iconColor || "text-blue-600 dark:text-blue-400"
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
