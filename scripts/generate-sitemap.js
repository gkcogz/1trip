// scripts/generate-sitemap.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Import blogPosts via your loader
import { blogPosts } from "../src/lib/loadBlogPosts.js";

const BASE_URL = "https://1trip.app";

// Static pages
const staticUrls = [
  { loc: "/", priority: "1.0", changefreq: "daily" },
  { loc: "/blog", priority: "0.8", changefreq: "weekly" },
  { loc: "/about", priority: "0.5", changefreq: "yearly" },
  { loc: "/contact", priority: "0.5", changefreq: "yearly" },
];

// Blog posts (taken from loadBlogPosts)
const blogUrls = blogPosts.map((post) => ({
  loc: `/blog/${post.slug}`,
  priority: "0.7",
  changefreq: "yearly",
}));

const urls = [...staticUrls, ...blogUrls];

// Build XML
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${BASE_URL}${u.loc}</loc>
    <priority>${u.priority}</priority>
    <changefreq>${u.changefreq}</changefreq>
  </url>`
  )
  .join("\n")}
</urlset>
`;

// Ensure /public exists
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.resolve(__dirname, "../public/sitemap.xml");

fs.writeFileSync(outPath, xml, "utf-8");
console.log("✅ sitemap.xml generated at", outPath);
