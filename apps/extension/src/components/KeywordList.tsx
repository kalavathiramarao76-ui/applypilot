import React from "react";
import { Check, X } from "lucide-react";

interface KeywordListProps {
  matched: string[];
  missing: string[];
}

export function KeywordList({ matched, missing }: KeywordListProps) {
  return (
    <div className="plasmo-space-y-2">
      <h4 className="plasmo-text-sm plasmo-font-semibold plasmo-text-gray-700">
        Keyword Match
      </h4>
      <div className="plasmo-flex plasmo-flex-wrap plasmo-gap-1.5">
        {matched.map((kw) => (
          <span
            key={`m-${kw}`}
            className="plasmo-inline-flex plasmo-items-center plasmo-gap-1 plasmo-px-2 plasmo-py-0.5 plasmo-rounded-full plasmo-text-xs plasmo-font-medium plasmo-bg-green-50 plasmo-text-green-700 plasmo-border plasmo-border-green-200">
            <Check size={12} />
            {kw}
          </span>
        ))}
        {missing.map((kw) => (
          <span
            key={`x-${kw}`}
            className="plasmo-inline-flex plasmo-items-center plasmo-gap-1 plasmo-px-2 plasmo-py-0.5 plasmo-rounded-full plasmo-text-xs plasmo-font-medium plasmo-bg-red-50 plasmo-text-red-700 plasmo-border plasmo-border-red-200">
            <X size={12} />
            {kw}
          </span>
        ))}
      </div>
      {matched.length + missing.length > 0 && (
        <p className="plasmo-text-xs plasmo-text-gray-500">
          {matched.length} of {matched.length + missing.length} keywords matched
        </p>
      )}
    </div>
  );
}
