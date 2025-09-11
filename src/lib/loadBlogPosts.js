import fm from "front-matter";
const files = import.meta.glob("../content/blog/*.md", { eager: true, as: "raw" });
export const blogPosts = Object.entries(files).map(([path, raw]) => {
    if (typeof raw !== "string") {
        console.error(`❌ Blog loader: ${path} beklenmedik formatta geldi:`, raw);
        return {
            slug: "invalid",
            title: "Invalid Post",
            date: "",
            excerpt: "",
            content: "",
        };
    }
    const parsed = fm(raw);
    return {
        slug: parsed.attributes.slug || path.split("/").pop()?.replace(/\.md$/, "") || "untitled",
        title: parsed.attributes.title || "Untitled",
        date: parsed.attributes.date || new Date().toISOString(),
        excerpt: parsed.attributes.excerpt || "",
        content: parsed.body,
    };
}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
