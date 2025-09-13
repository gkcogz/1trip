export type BlogPost = {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
}

// Şimdilik sadece EN içerikler
export const blogPosts: BlogPost[] = []

// Eğer md dosyalarını import.meta.glob ile okuyorsan:
const files = import.meta.glob("../content/blog/*.md", { eager: true }) as Record<
  string,
  { default: string }
>

function parseFrontmatter(raw: string) {
  const match = /^---\n([\s\S]*?)\n---/.exec(raw)
  if (!match) return { data: {}, content: raw }
  const frontmatter = Object.fromEntries(
    match[1].split("\n").map((line) => line.split(":").map((x) => x.trim()))
  )
  const content = raw.slice(match[0].length).trim()
  return { data: frontmatter, content }
}

for (const [path, mod] of Object.entries(files)) {
  // sadece İngilizce olan dosyaları al (ör: .../how-to-plan-your-trip.md)
  if (path.endsWith("-tr.md") || path.endsWith("-de.md")) continue

  const raw = mod.default as string
  const { data, content } = parseFrontmatter(raw)
  const fileName = path.split("/").pop()!
  const slug = fileName.replace(/\.md$/, "")

  blogPosts.push({
    slug,
    title: data.title || slug,
    date: data.date || new Date().toISOString(),
    excerpt: data.excerpt || "",
    content,
  })
}

// Tarihe göre sırala
blogPosts.sort((a, b) => (a.date > b.date ? -1 : 1))
