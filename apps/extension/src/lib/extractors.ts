export interface JobData {
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  source: "linkedin" | "indeed" | "glassdoor" | "unknown";
}

function getTextContent(selectors: string[]): string {
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el?.textContent?.trim()) {
      return el.textContent.trim();
    }
  }
  return "";
}

function getInnerHTML(selectors: string[]): string {
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el?.innerHTML?.trim()) {
      return el.innerHTML.trim();
    }
  }
  return "";
}

export function extractLinkedInJob(): JobData | null {
  const title = getTextContent([
    ".job-details-jobs-unified-top-card__job-title",
    ".jobs-unified-top-card__job-title",
    ".t-24.t-bold.inline",
    "h1.topcard__title",
    "h1"
  ]);

  const company = getTextContent([
    ".job-details-jobs-unified-top-card__company-name",
    ".jobs-unified-top-card__company-name",
    'a[data-tracking-control-name="public_jobs_topcard-org-name"]',
    ".topcard__org-name-link",
    ".jobs-unified-top-card__subtitle-primary-grouping .app-aware-link"
  ]);

  const location = getTextContent([
    ".job-details-jobs-unified-top-card__bullet",
    ".jobs-unified-top-card__bullet",
    ".topcard__flavor--bullet",
    ".jobs-unified-top-card__subtitle-secondary-grouping .tvm__text"
  ]);

  const descriptionHTML = getInnerHTML([
    ".jobs-description__content",
    "#job-details",
    ".jobs-box__html-content",
    ".description__text"
  ]);

  // Convert HTML to plain text for description
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = descriptionHTML;
  const description = tempDiv.textContent?.trim() || "";

  if (!title && !description) {
    return null;
  }

  return {
    title: title || "Unknown Position",
    company: company || "Unknown Company",
    location: location || "",
    description,
    url: window.location.href,
    source: "linkedin"
  };
}

export function extractIndeedJob(): JobData | null {
  const title = getTextContent([
    ".jobsearch-JobInfoHeader-title",
    'h1[data-testid="jobsearch-JobInfoHeader-title"]',
    ".icl-u-xs-mb--xs.icl-u-xs-mt--none h1",
    "h1"
  ]);

  const company = getTextContent([
    '[data-testid="inlineHeader-companyName"]',
    ".jobsearch-InlineCompanyRating",
    '[data-testid="inlineHeader-companyName"] a',
    ".icl-u-lg-mr--sm.icl-u-xs-mr--xs a"
  ]);

  const location = getTextContent([
    '[data-testid="job-location"]',
    '[data-testid="inlineHeader-companyLocation"]',
    ".jobsearch-JobInfoHeader-subtitle .css-6z8o9s",
    ".jobsearch-JobInfoHeader-subtitle div:last-child"
  ]);

  const descriptionHTML = getInnerHTML([
    "#jobDescriptionText",
    ".jobsearch-JobComponent-description",
    ".jobsearch-jobDescriptionText"
  ]);

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = descriptionHTML;
  const description = tempDiv.textContent?.trim() || "";

  if (!title && !description) {
    return null;
  }

  return {
    title: title || "Unknown Position",
    company: company || "Unknown Company",
    location: location || "",
    description,
    url: window.location.href,
    source: "indeed"
  };
}
