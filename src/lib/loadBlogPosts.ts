// src/lib/loadBlogPosts.ts (FINAL VERSION)
export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
};

export const blogPosts: BlogPost[] = [];

// Burada as: 'raw' kritik!
const files = import.meta.glob("../content/blog/*.md", {
  eager: true,
  as: "raw",
}) as Record<string, string>;

/**
 * Markdown dosyasının ham metnini alır, frontmatter (başlık bilgileri)
 * ve asıl içeriği (content) ayrıştırır.
 */
function parseFrontmatter(raw: string) {
  // DÜZELTME: Regex, Windows (\r\n) ve Unix (\n) satır sonlarını
  // destekleyecek şekilde güncellendi. (\r? eklendi)
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);

  // Eğer frontmatter bloğu bulunamazsa, tüm içeriği content olarak döndür
  if (!match) {
    return { data: {}, content: raw };
  }

  // Frontmatter bloğundaki satırları key-value çiftlerine dönüştür
  const frontmatter = Object.fromEntries(
    match[1].split("\n").map((line) => {
      // Satır sonundaki olası \r karakterini temizle
      const cleanLine = line.trim();
      const firstColonIndex = cleanLine.indexOf(":");
      if (firstColonIndex === -1) {
        return [cleanLine, ""];
      }
      const key = cleanLine.slice(0, firstColonIndex).trim();
      let value = cleanLine.slice(firstColonIndex + 1).trim();

      // Değerin başındaki ve sonundaki tırnak işaretlerini kaldırır
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      return [key, value];
    })
  );

  // Frontmatter bloğundan sonraki kısmı asıl içerik olarak al
  const content = raw.slice(match[0].length).trim();
  return { data: frontmatter, content };
}

// Tüm markdown dosyalarını döngüye al
for (const [path, raw] of Object.entries(files)) {
  // Türkçe veya Almanca dosyaları şimdilik atla
  if (path.endsWith("-tr.md") || path.endsWith("-de.md")) continue;

  const { data, content } = parseFrontmatter(raw);
  const fileName = path.split("/").pop()!;
  const slug = fileName.replace(/\.md$/, "");

  blogPosts.push({
    slug,
    title: data.title || slug,
    date: data.date || new Date().toISOString(),
    excerpt: data.excerpt || "",
    content, // artık temizlenmiş markdown içeriği
  });
}

// Tarihe göre sırala (en yeni yazılar en üstte)
blogPosts.sort((a, b) => (a.date > b.date ? -1 : 1));