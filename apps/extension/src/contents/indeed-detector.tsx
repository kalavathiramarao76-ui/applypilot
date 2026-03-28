import type { PlasmoCSConfig } from "plasmo";
import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

import { extractIndeedJob, type JobData } from "~lib/extractors";

import cssText from "data-text:~style.css";

export const config: PlasmoCSConfig = {
  matches: ["https://www.indeed.com/viewjob*", "https://www.indeed.com/jobs*"]
};

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

export const getRootContainer = () => {
  const container = document.createElement("div");
  container.id = "applypilot-indeed-root";
  document.body.appendChild(container);
  return container;
};

function IndeedDetector() {
  const [jobData, setJobData] = useState<JobData | null>(null);

  useEffect(() => {
    detectJob();

    const observer = new MutationObserver(() => {
      detectJob();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    const listener = (message: any) => {
      if (message.type === "ANALYZE_PAGE") {
        detectJob();
        if (jobData) {
          window.dispatchEvent(
            new CustomEvent("applypilot:analyze", { detail: jobData })
          );
        }
      }
    };
    chrome.runtime.onMessage.addListener(listener);

    return () => {
      observer.disconnect();
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  function detectJob() {
    const data = extractIndeedJob();
    if (data) {
      setJobData(data);
      chrome.runtime.sendMessage({ type: "JOB_DETECTED", data });
    }
  }

  function handleClick() {
    if (jobData) {
      window.dispatchEvent(
        new CustomEvent("applypilot:analyze", { detail: jobData })
      );
    }
  }

  if (!jobData) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 2147483647
      }}>
      <button
        onClick={handleClick}
        className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-bg-gradient-to-r plasmo-from-indigo-600 plasmo-to-purple-600 plasmo-text-white plasmo-rounded-full plasmo-px-4 plasmo-py-3 plasmo-shadow-lg hover:plasmo-shadow-xl plasmo-transition-all hover:plasmo-scale-105 plasmo-border-0 plasmo-cursor-pointer plasmo-text-sm plasmo-font-medium"
        title="Analyze this job with ApplyPilot">
        <Sparkles size={18} />
        <span>ApplyPilot</span>
      </button>
    </div>
  );
}

export default IndeedDetector;
