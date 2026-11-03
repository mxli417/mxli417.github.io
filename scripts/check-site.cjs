"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "_site");
const requiredFiles = [
  "index.html",
  "projects/index.html",
  "blog/index.html",
  "research/index.html",
  "assets/css/main.css",
  "assets/css/site.css",
  "assets/css/skins/light.css",
  "assets/js/site.js",
];

const problems = [];

for (const relativePath of requiredFiles) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    problems.push(`missing build output: ${relativePath}`);
  }
}

const htmlFiles = requiredFiles.filter((file) => file.endsWith(".html"));
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
}

if (problems.length) {
  console.error("FAIL: generated-site smoke check");
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}

console.log("PASS: generated routes, theme assets, scripts, and landmarks are present.");
