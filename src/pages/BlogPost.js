import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, Link } from "react-router-dom";
import { blogPosts } from "../lib/loadBlogPosts";
import ReactMarkdown from "react-markdown";
export default function BlogPost() {
    const { slug } = useParams();
    const post = blogPosts.find((p) => p.slug === slug);
    if (!post) {
        return (_jsxs("div", { className: "max-w-3xl mx-auto p-6", children: [_jsx("h1", { className: "text-2xl font-bold text-red-600", children: "Post not found" }), _jsx(Link, { to: "/blog", className: "btn mt-4", children: "\u2190 Back to Blog" })] }));
    }
    return (_jsx("div", { className: "max-w-5xl mx-auto p-6", children: _jsxs("div", { className: "glass rounded-2xl p-8 shadow-xl space-y-8 animate-fadeIn", children: [_jsxs("header", { className: "space-y-2 border-b border-[var(--color-border)] pb-4", children: [_jsx("h1", { className: "text-4xl font-extrabold text-[var(--color-brand)]", children: post.title }), _jsx("p", { className: "text-sm text-[var(--color-muted)]", children: new Date(post.date).toDateString() })] }), _jsx("article", { className: "prose lg:prose-xl max-w-none text-[var(--color-ink)]", children: _jsx(ReactMarkdown, { children: post.content }) }), _jsx(Link, { to: "/blog", className: "btn bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-600)]", children: "\u2190 Back to Blog" })] }) }));
}
