"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(process.argv[2] || path.join(__dirname, "..", "_site"));
const requiredFiles = [
  "index.html",
  "projects/index.html",
  "blog/index.html",
  "research/index.html",
  "about_me/index.html",
  "papers/index.html",
  "legal/index.html",
  "404.html",
  "assets/css/main.css",
  "assets/css/site.css",
  "assets/css/skins/light.css",
  "assets/js/site.js",
  "assets/imgs/style_transfer_result_at_iteration_34.png",
  "assets/imgs/bookie_dashboard_upper.png",
  "assets/imgs/bookie_dashboard_upper_mid.png",
  "assets/imgs/bookie_dashboard_lower_mid.png",
  "assets/imgs/bookie_dashboard_lower_foot.png",
  "assets/imgs/bookie_dashboard_footer.png",
];

const problems = [];

for (const relativePath of requiredFiles) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    problems.push(`missing build output: ${relativePath}`);
  }
}

const htmlFiles = [];
const collectHtml = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) collectHtml(absolutePath);
    else if (entry.name.endsWith(".html")) {
      htmlFiles.push(path.relative(root, absolutePath).replaceAll("\\", "/"));
    }
  }
};

if (fs.existsSync(root)) collectHtml(root);

for (const relativePath of htmlFiles) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) continue;

  const html = fs.readFileSync(absolutePath, "utf8");
  if (html.includes("{{") || html.includes("{%")) {
    problems.push(`unrendered Liquid markup in ${relativePath}`);
  }
  if (!html.includes("/assets/css/main.css")) {
    problems.push(`theme stylesheet missing from ${relativePath}`);
  }
  if (!html.includes("/assets/css/site.css")) {
    problems.push(`site stylesheet missing from ${relativePath}`);
  }
  if (!html.includes("/assets/js/site.js")) {
    problems.push(`site script missing from ${relativePath}`);
  }
  if (!html.includes('id="primary-nav"')) {
    problems.push(`primary navigation missing from ${relativePath}`);
  }
  if (!html.includes('id="main"')) {
    problems.push(`main landmark missing from ${relativePath}`);
  }

  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    const attributes = match[1];
    const src = attributes.match(/\bsrc=["']([^"']+)["']/i)?.[1];
    if (!/\balt=["'][^"']*["']/i.test(attributes)) {
      problems.push(`image without alt text in ${relativePath}`);
    }
    if (src?.startsWith("/")) {
      const assetPath = path.join(root, decodeURIComponent(src.split(/[?#]/, 1)[0]).slice(1));
      if (!fs.existsSync(assetPath)) {
        problems.push(`missing image ${src} referenced by ${relativePath}`);
      }
    }
  }
}

const siteCssPath = path.join(root, "assets/css/site.css");
if (fs.existsSync(siteCssPath)) {
  const siteCss = fs.readFileSync(siteCssPath, "utf8");
  if (!/\.layout--post\s+\.page-wrapper\s*\{[^}]*display:\s*block/s.test(siteCss)) {
    problems.push("single-column post layout override missing from assets/css/site.css");
  }
}

if (!htmlFiles.some((file) => file.includes("looking-for-the-uncertain-theory-of-optimal-search"))) {
  problems.push("optimal-search article was not generated");
}

if (problems.length) {
  console.error("FAIL: generated-site smoke check");
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}

console.log(`PASS: ${htmlFiles.length} generated pages, routes, theme assets, scripts, landmarks, and post layout are valid.`);
