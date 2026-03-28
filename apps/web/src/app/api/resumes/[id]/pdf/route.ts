import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { resumes, eq } from "@zypply/shared";
import type { ResumeContent } from "@zypply/shared";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function generateResumeHtml(content: ResumeContent, name: string): string {
  const { personalInfo, summary, experiences, education, skills, certifications, projects } = content;

  const experienceHtml = (experiences || [])
    .map(
      (exp) => `
      <div class="experience-item">
        <div class="exp-header">
          <div>
            <strong>${escapeHtml(exp.title)}</strong>
            <span class="company"> | ${escapeHtml(exp.company)}</span>
          </div>
          <div class="date">${escapeHtml(exp.startDate)}${exp.current ? " - Present" : exp.endDate ? ` - ${escapeHtml(exp.endDate)}` : ""}</div>
        </div>
        <ul>${(exp.bullets || []).map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>
      </div>`
    )
    .join("");

  const educationHtml = (education || [])
    .map(
      (edu) => `
      <div class="edu-item">
        <div class="exp-header">
          <div><strong>${escapeHtml(edu.degree)} in ${escapeHtml(edu.field)}</strong></div>
          <div class="date">${escapeHtml(edu.graduationDate)}</div>
        </div>
        <div>${escapeHtml(edu.institution)}${edu.gpa ? ` | GPA: ${escapeHtml(edu.gpa)}` : ""}</div>
      </div>`
    )
    .join("");

  const skillsHtml =
    skills && skills.length > 0
      ? `<div class="section"><h2>Skills</h2><p>${skills.map((s) => escapeHtml(s)).join(" &bull; ")}</p></div>`
      : "";

  const certificationsHtml =
    certifications && certifications.length > 0
      ? `<div class="section"><h2>Certifications</h2><ul>${certifications.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}</ul></div>`
      : "";

  const projectsHtml =
    projects && projects.length > 0
      ? `<div class="section"><h2>Projects</h2>${projects.map((p) => `<div class="project-item"><strong>${escapeHtml(p.name)}</strong>${p.url ? ` - <a href="${escapeHtml(p.url)}">${escapeHtml(p.url)}</a>` : ""}<p>${escapeHtml(p.description)}</p></div>`).join("")}</div>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(name)}</title>
<style>
  @page { margin: 0.5in; size: letter; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Georgia', 'Times New Roman', serif; font-size: 11pt; line-height: 1.4; color: #1a1a1a; max-width: 8.5in; margin: 0 auto; padding: 0.5in; }
  .header { text-align: center; margin-bottom: 16px; border-bottom: 2px solid #1a1a1a; padding-bottom: 12px; }
  .header h1 { font-size: 22pt; letter-spacing: 1px; margin-bottom: 6px; }
  .contact { font-size: 10pt; color: #444; }
  .contact span { margin: 0 6px; }
  .section { margin-bottom: 14px; }
  .section h2 { font-size: 12pt; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #999; padding-bottom: 3px; margin-bottom: 8px; color: #1a1a1a; }
  .summary { font-style: italic; color: #333; margin-bottom: 4px; }
  .experience-item, .edu-item, .project-item { margin-bottom: 10px; }
  .exp-header { display: flex; justify-content: space-between; align-items: baseline; }
  .company { color: #444; }
  .date { font-size: 10pt; color: #666; white-space: nowrap; }
  ul { padding-left: 18px; margin-top: 4px; }
  li { margin-bottom: 2px; font-size: 10.5pt; }
  a { color: #1a1a1a; }
  @media print {
    body { padding: 0; }
    .no-print { display: none; }
  }
</style>
</head>
<body>
  <div class="header">
    <h1>${escapeHtml(personalInfo.name)}</h1>
    <div class="contact">
      ${personalInfo.email ? `<span>${escapeHtml(personalInfo.email)}</span>` : ""}
      ${personalInfo.phone ? `<span>|</span><span>${escapeHtml(personalInfo.phone)}</span>` : ""}
      ${personalInfo.location ? `<span>|</span><span>${escapeHtml(personalInfo.location)}</span>` : ""}
      ${personalInfo.linkedin ? `<span>|</span><span><a href="${escapeHtml(personalInfo.linkedin)}">LinkedIn</a></span>` : ""}
      ${personalInfo.website ? `<span>|</span><span><a href="${escapeHtml(personalInfo.website)}">${escapeHtml(personalInfo.website)}</a></span>` : ""}
    </div>
  </div>

  ${summary ? `<div class="section"><h2>Summary</h2><p class="summary">${escapeHtml(summary)}</p></div>` : ""}

  ${experiences && experiences.length > 0 ? `<div class="section"><h2>Experience</h2>${experienceHtml}</div>` : ""}

  ${education && education.length > 0 ? `<div class="section"><h2>Education</h2>${educationHtml}</div>` : ""}

  ${skillsHtml}
  ${certificationsHtml}
  ${projectsHtml}
</body>
</html>`;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [resume] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, id))
      .limit(1);

    if (!resume || resume.userId !== session.userId) {
      return Response.json({ error: "Resume not found" }, { status: 404 });
    }

    const content = resume.content as ResumeContent;
    const html = generateResumeHtml(content, resume.name);

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="${resume.name.replace(/[^a-zA-Z0-9-_]/g, "_")}.html"`,
      },
    });
  } catch (error) {
    console.error("GET resume PDF error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
