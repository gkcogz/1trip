import { Link } from "react-router-dom"
import { blogPosts } from "../lib/loadBlogPosts"

export default function Blog() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">
          OneTrip Blog
        </h1>
        <p className="text-[var(--color-muted)] text-lg">
          Travel stories, guides, and updates from OneTrip.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {blogPosts.map((post) => (
          <article
            key={post.slug}
            className="glass p-6 space-y-3 transition-transform hover:shadow-2xl hover:-translate-y-1 rounded-2xl"
          >
            <span className="inline-block text-xs font-semibold px-2 py-1 rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand)]">
              {new Date(post.date).toDateString()}
            </span>
            <h2 className="text-2xl font-bold text-[var(--color-brand)] hover:underline">
              <Link to={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="text-[var(--color-muted)] line-clamp-3">{post.excerpt}</p>
            <Link
              to={`/blog/${post.slug}`}
              className="inline-block mt-2 text-[var(--color-brand)] font-semibold hover:underline"
            >
              Read more →
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
