import React from "react";

interface AtsScoreCircleProps {
  score: number;
  size?: number;
}

export function AtsScoreCircle({ score, size = 120 }: AtsScoreCircleProps) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const remaining = circumference - progress;

  const getColor = (s: number) => {
    if (s >= 75) return "#10B981";
    if (s >= 50) return "#F59E0B";
    return "#EF4444";
  };

  const getLabel = (s: number) => {
    if (s >= 75) return "Excellent";
    if (s >= 50) return "Good";
    return "Needs Work";
  };

  const color = getColor(score);

  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-gap-1">
      <svg width={size} height={size} className="plasmo-transform -plasmo-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={`${progress} ${remaining}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>
      <div
        className="plasmo-absolute plasmo-flex plasmo-flex-col plasmo-items-center plasmo-justify-center"
        style={{ width: size, height: size }}>
        <span className="plasmo-text-2xl plasmo-font-bold" style={{ color }}>
          {score}
        </span>
        <span className="plasmo-text-xs plasmo-text-gray-500">ATS Score</span>
      </div>
      <span className="plasmo-text-xs plasmo-font-medium" style={{ color }}>
        {getLabel(score)}
      </span>
    </div>
  );
}
