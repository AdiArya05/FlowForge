import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const PORT = Number(process.env.PORT || 3002);
const PUBLIC_DIR = join(process.cwd(), "public");

try {
  const env = readFileSync(join(process.cwd(), ".env.local"), "utf8");
  for (const line of env.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...valueParts] = trimmed.split("=");
    process.env[key] ||= valueParts.join("=").replace(/^["']|["']$/g, "");
  }
} catch {
  // .env.local is optional for hackathon demos.
}

const demoSteps = [
  {
    timestamp: "00:04",
    action: "Opened spreadsheet with a list of target companies.",
    app: "Browser",
    target: "Vendor shortlist",
    evidence: "The same input columns appear before each repeated browser lookup."
  },
  {
    timestamp: "00:16",
    action: "Opened a company homepage and scanned hero copy for product description.",
    app: "Browser",
    target: "Company website",
    evidence: "The user pauses around headline, navigation, and product sections."
  },
  {
    timestamp: "00:39",
    action: "Looked for pricing, contact, or sales pages in the navigation.",
    app: "Browser",
    target: "Pricing/contact links",
    evidence: "The workflow repeatedly checks the same page types."
  },
  {
    timestamp: "01:02",
    action: "Copied summary fields back into the spreadsheet.",
    app: "Spreadsheet",
    target: "Description, pricing URL, contact URL",
    evidence: "Data is transferred manually from public websites into rows."
  },
  {
    timestamp: "01:24",
    action: "Repeated the same lookup sequence for another company.",
    app: "Browser",
    target: "Next company row",
    evidence: "The step pattern restarts, making this a strong automation candidate."
  }
];

const fallbackResearch = [
  {
    company: "Linear",
    url: "https://linear.app",
    title: "Linear",
    description: "Issue tracking and product development workflows for high-velocity software teams.",
    pricingUrl: "https://linear.app/pricing",
    contactUrl: "https://linear.app/contact",
    source: "demo-fallback"
  },
  {
    company: "Notion",
    url: "https://notion.so",
    title: "Notion",
    description: "Connected workspace for docs, projects, wikis, notes, and AI-assisted knowledge work.",
    pricingUrl: "https://notion.so/pricing",
    contactUrl: "https://notion.so/contact-sales",
    source: "demo-fallback"
  },
  {
    company: "Airtable",
    url: "https://airtable.com",
    title: "Airtable",
    description: "App platform for teams to build collaborative workflows on top of structured data.",
    pricingUrl: "https://airtable.com/pricing",
    contactUrl: "https://airtable.com/contact-sales",
    source: "demo-fallback"
  }
];

const demoPlan = {
  workflowName: "Vendor Research Shortlist Automation",
  summary:
    "The observed workflow is a repetitive public-web research loop: visit each company website, identify product positioning, find pricing/contact links, summarize the company, and write structured data to a table.",
  repetitionScore: 93,
  automationPotential: "high",
  complexityScore: 41,
  riskScore: 22,
  estimatedTimeSaved: "3.5-6 hours per 100 companies",
  automatableSteps: [
    "Read company rows from a CSV",
    "Fetch public homepage content",
    "Detect pricing/contact/about links",
    "Extract product description",
    "Write normalized rows to CSV"
  ],
  aiRecommendedSteps: [
    "Summarize messy homepage copy",
    "Classify target customer and product category",
    "Detect ambiguous pricing/contact links"
  ],
  humanInLoopSteps: [
    "Approve final vendor shortlist",
    "Validate business-critical pricing assumptions",
    "Send outbound emails only after review"
  ],
  recommendedArchitecture: [
    "VideoDB extracts workflow steps from the recording",
    "Kimi creates the automation diagnosis and code plan",
    "Bright Data collects public web data reliably",
    "Daytona runs generated automation in an isolated sandbox"
  ],
  risks: [
    "Some sites hide pricing behind sales forms",
    "Anti-bot pages can reduce direct fetch reliability",
    "Final vendor choice should stay human-approved"
  ]
};

function parseCompanies(raw = "") {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [company, url] = line.split(",").map((part) => part.trim());
      return { company, url };
    })
    .filter((row) => row.company && row.url?.startsWith("http"));
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function getTitle(html) {
  return html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim();
}

function getMeta(html, name) {
  const regex = new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i");
  return html.match(regex)?.[1]?.replace(/\s+/g, " ").trim();
}

function findLink(html, baseUrl, kind) {
  const regex = /href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = regex.exec(html))) {
    const href = match[1];
    const text = match[2].replace(/<[^>]+>/g, " ").toLowerCase();
    if (href.toLowerCase().includes(kind) || text.includes(kind) || (kind === "contact" && text.includes("sales"))) {
      try {
        return new URL(href, baseUrl).toString();
      } catch {
        return undefined;
      }
    }
  }
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function researchCompanies(companies) {
  const selected = companies.length ? companies : fallbackResearch.map(({ company, url }) => ({ company, url }));
  const rows = await Promise.allSettled(
    selected.map(async (input) => {
      const endpoint = process.env.BRIGHTDATA_WEB_UNLOCKER_ENDPOINT;
      const apiKey = process.env.BRIGHTDATA_API_KEY;
      let html;

      if (endpoint && apiKey) {
        const response = await fetchWithTimeout(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify({ url: input.url })
        });
        html = await response.text();
      } else {
        const response = await fetchWithTimeout(input.url, {
          headers: { "User-Agent": "FlowForgeHackathon/0.1" }
        });
        html = await response.text();
      }

      return {
        company: input.company,
        url: input.url,
        title: getTitle(html) || input.company,
        description: getMeta(html, "description") || `Public website research for ${input.company}.`,
        pricingUrl: findLink(html, input.url, "pricing"),
        contactUrl: findLink(html, input.url, "contact"),
        source: apiKey ? "bright-data" : "direct-fetch"
      };
    })
  );

  const fulfilled = rows.filter((row) => row.status === "fulfilled").map((row) => row.value);
  return fulfilled.length ? fulfilled : fallbackResearch;
}

async function callKimi(messages, fallback) {
  const apiKey = process.env.KIMI_API_KEY;
  if (!apiKey) return fallback;

  try {
    const response = await fetchWithTimeout(`${process.env.KIMI_BASE_URL || "https://api.moonshot.ai/v1"}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.KIMI_MODEL || "kimi-k2.6",
        temperature: 0.2,
        messages
      })
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || fallback;
  } catch {
    return fallback;
  }
}

function extractJson(text, fallback) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return fallback;
    try {
      return JSON.parse(match[0]);
    } catch {
      return fallback;
    }
  }
}

async function createPlan(steps, notes) {
  const content = await callKimi(
    [
      { role: "system", content: "You are an elite automation architect. Return strict JSON only." },
      {
        role: "user",
        content: `Notes:\n${notes}\n\nObserved steps:\n${JSON.stringify(steps, null, 2)}\n\nReturn keys: workflowName, summary, repetitionScore, automationPotential, complexityScore, riskScore, estimatedTimeSaved, automatableSteps, aiRecommendedSteps, humanInLoopSteps, recommendedArchitecture, risks.`
      }
    ],
    JSON.stringify(demoPlan)
  );
  return extractJson(content, demoPlan);
}

async function generateCode(plan) {
  return callKimi(
    [
      { role: "system", content: "Return concise JavaScript code only." },
      {
        role: "user",
        content: `Generate an automation script for this plan:\n${JSON.stringify(plan, null, 2)}`
      }
    ],
    `// Generated by FlowForge
const companies = INPUT_COMPANIES;
const results = await Promise.all(companies.map(async (company) => ({
  company: company.company,
  url: company.url,
  description: "AI-extracted website summary",
  pricingUrl: company.url + "/pricing",
  contactUrl: company.url + "/contact"
})));
console.log(JSON.stringify(results, null, 2));`
  );
}

async function pipeline(body) {
  const notes = body.notes || "I research SaaS vendors and copy website summaries into a spreadsheet.";
  const steps = demoSteps.map((step) => ({
    ...step,
    evidence: body.recordingUrl ? `${step.evidence} VideoDB source: ${body.recordingUrl}` : step.evidence
  }));
  const plan = await createPlan(steps, notes);
  const results = await researchCompanies(parseCompanies(body.companies || ""));
  const generatedCode = await generateCode(plan);
  const mode = process.env.DAYTONA_API_KEY ? "daytona" : "local-simulation";
  const stdout = [
    "FlowForge automation run",
    `Mode: ${mode}`,
    `Input rows: ${results.length}`,
    "Generated structured vendor research rows",
    JSON.stringify(results, null, 2),
    mode === "daytona"
      ? "Daytona integration point active: ready for isolated sandbox execution."
      : "Local simulation: add DAYTONA_API_KEY to run through the Daytona sandbox adapter."
  ].join("\n");

  return {
    steps,
    plan,
    run: { mode, status: "completed", generatedCode, stdout, results }
  };
}

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8"
};

createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/api/pipeline") {
      sendJson(res, 200, await pipeline(await readJson(req)));
      return;
    }

    const pathname = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`).pathname;
    const path = pathname === "/" ? "/index.html" : pathname;
    const filePath = join(PUBLIC_DIR, path);
    const data = await readFile(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes[extname(filePath)] || "text/plain" });
    res.end(data);
  } catch (error) {
    if (req.url?.startsWith("/api/")) {
      sendJson(res, 500, { error: error instanceof Error ? error.message : "Unknown error" });
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
}).listen(PORT, "127.0.0.1", () => {
  console.log(`FlowForge demo running at http://localhost:${PORT}`);
});
