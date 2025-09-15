// scripts/generate-sitemap.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BASE_URL = "https://1trip.app";

// Static pages
const staticUrls = [
  { loc: "/", priority: "1.0", changefreq: "daily" },
  { loc: "/blog", priority: "0.8", changefreq: "weekly" },
  { loc: "/about", priority: "0.5", changefreq: "yearly" },
  { loc: "/contact", priority: "0.5", changefreq: "yearly" }
];

// Blog posts from /content/blog
const blogDir = path.resolve("content/blog");
const blogFiles = fs.readdirSync(blogDir).filter((f) => f.endsWith(".md"));

const blogUrls = blogFiles.map((file) => {
  const raw = fs.readFileSync(path.join(blogDir, file), "utf-8");
  const { data } = matter(raw);
  const slug = data.slug || file.replace(/\.md$/, "");
  return { loc: `/blog/${slug}`, priority: "0.7", changefreq: "yearly" };
});

const urls = [...staticUrls, ...blogUrls];

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
</urlset>`;

fs.writeFileSync("public/sitemap.xml", xml, "utf-8");
console.log("✅ sitemap.xml generated with", blogUrls.length, "blog posts");
