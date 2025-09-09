import { useCallback, useState } from 'react'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name || !email || !message) {
      alert('Please fill in your name, email, and message.')
      return
    }
    const subject = encodeURIComponent(`OneTrip contact — ${name}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )
    window.location.href = `mailto:hello@onetrip.app?subject=${subject}&body=${body}`
  }, [name, email, message])

  return (
    <main className="mx-auto max-w-5xl p-6 text-[var(--color-ink)]">
      <div className="card p-8">
        {/* Header with favicon */}
        <div className="flex items-center gap-3 mb-6">
          <img
            src="/favicon.png"
            alt="OneTrip logo"
            className="w-10 h-10 rounded-lg shadow-md"
          />
          <h1 className="section-title text-3xl">Contact</h1>
        </div>

        <p className="text-[var(--color-muted)] leading-relaxed mb-8">
          <span className="mr-2">💌</span>
          Have feedback, ideas, or found a bug? Drop us a message.
        </p>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="block mb-1 text-sm font-medium">Your name</span>
              <input
                className="w-full"
                name="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="block mb-1 text-sm font-medium">Your email</span>
              <input
                className="w-full"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
          </div>

          <label className="block">
            <span className="block mb-1 text-sm font-medium">Your message</span>
            <textarea
              className="w-full"
              name="message"
              placeholder="How can we help?"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </label>

          <div className="flex items-center justify-end">
            <button className="btn" type="submit">Send</button>
          </div>
        </form>

        <div className="mt-6 text-sm text-[var(--color-muted)]">
          Prefer email? Write to <a href="mailto:hello@onetrip.app">hello@onetrip.app</a>
        </div>
      </div>
    </main>
  )
}
