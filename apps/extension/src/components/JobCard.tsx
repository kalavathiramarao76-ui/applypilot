import React from "react";
import { Briefcase, Building2, MapPin } from "lucide-react";

import type { JobData } from "~lib/extractors";

interface JobCardProps {
  job: JobData;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="plasmo-rounded-lg plasmo-border plasmo-border-gray-200 plasmo-bg-white plasmo-p-3 plasmo-shadow-sm">
      <div className="plasmo-flex plasmo-items-start plasmo-gap-3">
        <div className="plasmo-rounded-lg plasmo-bg-indigo-50 plasmo-p-2">
          <Briefcase size={18} className="plasmo-text-indigo-600" />
        </div>
        <div className="plasmo-flex-1 plasmo-min-w-0">
          <h3 className="plasmo-text-sm plasmo-font-semibold plasmo-text-gray-900 plasmo-truncate">
            {job.title}
          </h3>
          <div className="plasmo-flex plasmo-items-center plasmo-gap-1 plasmo-mt-0.5">
            <Building2 size={12} className="plasmo-text-gray-400" />
            <span className="plasmo-text-xs plasmo-text-gray-600 plasmo-truncate">
              {job.company}
            </span>
          </div>
          {job.location && (
            <div className="plasmo-flex plasmo-items-center plasmo-gap-1 plasmo-mt-0.5">
              <MapPin size={12} className="plasmo-text-gray-400" />
              <span className="plasmo-text-xs plasmo-text-gray-500 plasmo-truncate">
                {job.location}
              </span>
            </div>
          )}
          <div className="plasmo-mt-1.5">
            <span className="plasmo-inline-flex plasmo-items-center plasmo-px-1.5 plasmo-py-0.5 plasmo-rounded plasmo-text-[10px] plasmo-font-medium plasmo-bg-blue-50 plasmo-text-blue-700 plasmo-capitalize">
              {job.source}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
