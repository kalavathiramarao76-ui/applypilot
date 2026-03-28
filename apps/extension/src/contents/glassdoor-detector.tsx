import type { PlasmoCSConfig } from "plasmo";
import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

import {
  extractGlassdoorJob,
  waitForSelector,
  type JobData
} from "~lib/extractors";

import cssText from "data-text:~style.css";

export const config: PlasmoCSConfig = {
  matches: [
    "https://www.glassdoor.com/job-listing/*",
    "https://www.glassdoor.com/Job/*",
    "https://www.glassdoor.com/partner/jobListing*",
    "https://www.glassdoor.co.uk/job-listing/*",
    "https://www.glassdoor.co.uk/Job/*"
  ]
};

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

export const getRootContainer = () => {
  const container = document.createElement("div");
  container.id = "zypply-glassdoor-root";
  document.body.appendChild(container);
  return container;
};

function GlassdoorDetector() {
  const [jobData, setJobData] = useState<JobData | null>(null);

  useEffect(() => {
    // Wait for dynamic content to load, then detect
    async function init() {
      await waitForSelector('[data-test="job-title"], .job-title, h1', 5000);
      detectJob();
    }
    init();

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
            new CustomEvent("zypply:analyze", { detail: jobData })
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
    const data = extractGlassdoorJob();
    if (data) {
      setJobData(data);
      chrome.runtime.sendMessage({ type: "JOB_DETECTED", data });
    }
  }

  function handleClick() {
    if (jobData) {
      window.dispatchEvent(
        new CustomEvent("zypply:analyze", { detail: jobData })
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
        title="Analyze this job with Zypply">
        <Sparkles size={18} />
        <span>Zypply</span>
      </button>
    </div>
  );
}

export default GlassdoorDetector;
