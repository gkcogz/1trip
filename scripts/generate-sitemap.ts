// scripts/generate-sitemap.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BASE_URL = "https://1trip.app";

// Format date → YYYY-MM-DD
const formatDate = (d: Date) => d.toISOString().split("T")[0];

// Static pages
const staticUrls = [
  { loc: "/", priority: "1.0", changefreq: "daily", lastmod: new Date() },
  { loc: "/blog", priority: "0.8", changefreq: "weekly", lastmod: new Date() },
  { loc: "/about", priority: "0.5", changefreq: "yearly", lastmod: new Date() },
  { loc: "/contact", priority: "0.5", changefreq: "yearly", lastmod: new Date() }
];

// Blog posts from src/content/blog
const blogDir = path.resolve("src/content/blog");
const blogFiles = fs.existsSync(blogDir)
  ? fs.readdirSync(blogDir).filter((f) => f.endsWith(".md"))
  : [];

const blogUrls = blogFiles.map((file) => {
  const fullPath = path.join(blogDir, file);
  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data } = matter(raw);

  const slug = data.slug || file.replace(/\.md$/, "");
  const lastmod =
    data.date
      ? new Date(data.date)
      : fs.statSync(fullPath).mtime; // fallback to file modified time

  return {
    loc: `/blog/${slug}`,
    priority: "0.7",
    changefreq: "yearly",
    lastmod
  };
});

const urls = [...staticUrls, ...blogUrls];

// Build XML
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${BASE_URL}${u.loc}</loc>
    <lastmod>${formatDate(new Date(u.lastmod))}</lastmod>
    <priority>${u.priority}</priority>
    <changefreq>${u.changefreq}</changefreq>
  </url>`
  )
  .join("\n")}
</urlset>`;

fs.writeFileSync("public/sitemap.xml", xml, "utf-8");
console.log(`✅ sitemap.xml generated with ${blogUrls.length} blog posts`);
