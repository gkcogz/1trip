import { useParams, Link } from "react-router-dom"
import { blogPosts } from "../lib/loadBlogPosts"
import ReactMarkdown from "react-markdown"

export default function BlogPost() {
  const { slug } = useParams()
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-600">Post not found</h1>
        <Link to="/blog" className="btn mt-4">← Back to Blog</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="glass rounded-2xl p-8 shadow-xl space-y-8 animate-fadeIn">
        <header className="space-y-2 border-b border-[var(--color-border)] pb-4">
          <h1 className="text-4xl font-extrabold text-[var(--color-brand)]">
            {post.title}
          </h1>
          <p className="text-sm text-[var(--color-muted)]">
            {new Date(post.date).toDateString()}
          </p>
        </header>

        <article className="prose lg:prose-xl max-w-none text-[var(--color-ink)]">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>

        <Link
          to="/blog"
          className="btn bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-600)]"
        >
          ← Back to Blog
        </Link>
      </div>
    </div>
  )
}
