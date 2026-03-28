export interface JobData {
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
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

function htmlToText(html: string): string {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent?.trim() || "";
}

/**
 * Wait for a selector to appear in the DOM using MutationObserver.
 * Resolves with the element or null after timeout.
 */
export function waitForSelector(
  selector: string,
  timeoutMs = 5000
): Promise<Element | null> {
  return new Promise((resolve) => {
    const existing = document.querySelector(selector);
    if (existing) {
      resolve(existing);
      return;
    }

    let resolved = false;
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el && !resolved) {
        resolved = true;
        observer.disconnect();
        resolve(el);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        observer.disconnect();
        resolve(null);
      }
    }, timeoutMs);
  });
}

export function extractLinkedInJob(): JobData | null {
  const title = getTextContent([
    ".job-details-jobs-unified-top-card__job-title",
    ".jobs-unified-top-card__job-title",
    ".t-24.t-bold.inline",
    "h1.topcard__title",
    ".job-details-jobs-unified-top-card__job-title h1",
    ".jobs-unified-top-card__job-title a",
    '[data-testid="job-title"]',
    ".jobs-details__main-content h1",
    "h1"
  ]);

  const company = getTextContent([
    ".job-details-jobs-unified-top-card__company-name",
    ".jobs-unified-top-card__company-name",
    ".job-details-jobs-unified-top-card__company-name a",
    'a[data-tracking-control-name="public_jobs_topcard-org-name"]',
    ".topcard__org-name-link",
    ".jobs-unified-top-card__subtitle-primary-grouping .app-aware-link",
    ".jobs-details__main-content .jobs-unified-top-card__company-name",
    '[data-testid="company-name"]'
  ]);

  const location = getTextContent([
    ".job-details-jobs-unified-top-card__bullet",
    ".jobs-unified-top-card__bullet",
    ".topcard__flavor--bullet",
    ".jobs-unified-top-card__subtitle-secondary-grouping .tvm__text",
    ".job-details-jobs-unified-top-card__primary-description-container .tvm__text",
    '[data-testid="job-location"]'
  ]);

  // Extract salary if visible
  const salary = getTextContent([
    ".job-details-jobs-unified-top-card__job-insight--highlight span",
    ".salary-main-rail__current-range",
    ".compensation__salary",
    ".jobs-unified-top-card__job-insight span:first-child",
    '[data-testid="salary-info"]'
  ]);

  const descriptionHTML = getInnerHTML([
    ".jobs-description__content",
    "#job-details",
    ".jobs-box__html-content",
    ".description__text",
    ".jobs-description-content__text",
    ".jobs-description__content .jobs-box__html-content",
    '[data-testid="job-description"]'
  ]);

  const description = htmlToText(descriptionHTML);

  if (!title && !description) {
    return null;
  }

  return {
    title: title || "Unknown Position",
    company: company || "Unknown Company",
    location: location || "",
    description,
    salary: salary || undefined,
    url: window.location.href,
    source: "linkedin"
  };
}

export function extractIndeedJob(): JobData | null {
  const title = getTextContent([
    ".jobsearch-JobInfoHeader-title",
    'h1[data-testid="jobsearch-JobInfoHeader-title"]',
    ".icl-u-xs-mb--xs.icl-u-xs-mt--none h1",
    '[data-testid="job-title"]',
    ".jobTitle",
    "h1"
  ]);

  const company = getTextContent([
    '[data-testid="inlineHeader-companyName"]',
    ".jobsearch-InlineCompanyRating",
    '[data-testid="inlineHeader-companyName"] a',
    ".icl-u-lg-mr--sm.icl-u-xs-mr--xs a",
    '[data-testid="company-name"]',
    ".jobsearch-CompanyInfoContainer a"
  ]);

  const location = getTextContent([
    '[data-testid="job-location"]',
    '[data-testid="inlineHeader-companyLocation"]',
    ".jobsearch-JobInfoHeader-subtitle .css-6z8o9s",
    ".jobsearch-JobInfoHeader-subtitle div:last-child",
    '[data-testid="jobsearch-CompanyInfoContainer"] div:last-child'
  ]);

  const salary = getTextContent([
    "#salaryInfoAndJobType span",
    '[data-testid="attribute_snippet_testid"]',
    ".jobsearch-JobMetadataHeader-item",
    ".salary-snippet-container",
    ".metadata .attribute_snippet"
  ]);

  const descriptionHTML = getInnerHTML([
    "#jobDescriptionText",
    ".jobsearch-JobComponent-description",
    ".jobsearch-jobDescriptionText",
    '[data-testid="jobDescriptionText"]'
  ]);

  const description = htmlToText(descriptionHTML);

  if (!title && !description) {
    return null;
  }

  return {
    title: title || "Unknown Position",
    company: company || "Unknown Company",
    location: location || "",
    description,
    salary: salary || undefined,
    url: window.location.href,
    source: "indeed"
  };
}

export function extractGlassdoorJob(): JobData | null {
  const title = getTextContent([
    '[data-test="job-title"]',
    ".job-title",
    ".e1tk4kwz5",
    'h1[data-testid="job-title"]',
    ".css-1vg6q84",
    ".JobDetails_jobTitle__Rw_gn",
    "h1"
  ]);

  const company = getTextContent([
    '[data-test="employer-name"]',
    ".employer-name",
    ".e1tk4kwz1",
    '[data-testid="employer-name"]',
    ".css-16nw49e",
    ".EmployerProfile_compactEmployerName__LE242",
    ".JobDetails_companyName__mGlnp"
  ]);

  const location = getTextContent([
    '[data-test="location"]',
    ".location",
    ".e1tk4kwz4",
    '[data-testid="job-location"]',
    ".css-1buaf54",
    ".JobDetails_location__mSg5h"
  ]);

  const salary = getTextContent([
    '[data-test="detailSalary"]',
    ".salary-estimate",
    ".css-1xe2xww",
    ".SalaryEstimate_averageEstimate__xF_7h",
    ".JobDetails_salaryEstimate__QpbTW"
  ]);

  const descriptionHTML = getInnerHTML([
    ".jobDescriptionContent",
    '[data-test="jobDescriptionContent"]',
    ".desc",
    ".JobDetails_jobDescription__uW_fK",
    ".job-description",
    "#JobDescriptionContainer",
    ".css-r3vfwl"
  ]);

  const description = htmlToText(descriptionHTML);

  if (!title && !description) {
    return null;
  }

  return {
    title: title || "Unknown Position",
    company: company || "Unknown Company",
    location: location || "",
    description,
    salary: salary || undefined,
    url: window.location.href,
    source: "glassdoor"
  };
}
