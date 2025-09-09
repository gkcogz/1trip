export default function About() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="card p-8">
        {/* Header with favicon */}
        <div className="flex items-center gap-3 mb-6">
          <img
            src="/favicon.png"
            alt="OneTrip logo"
            className="w-10 h-10 rounded-lg shadow-md"
          />
          <h1 className="section-title text-3xl">About OneTrip</h1>
        </div>

        <p className="text-[var(--color-muted)] leading-relaxed mb-8">
          ✈️ OneTrip is a minimalist trip planner designed for explorers who value clarity
          and speed. Add stops, link them with transport modes, jot down activities,
          and manage budgets—all in one place.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="glass p-5 rounded-2xl">
            <div className="text-2xl mb-1">🗺️</div>
            <h3 className="font-bold mb-1">Route Planning</h3>
            <p className="text-sm opacity-80">Build multi-leg trips quickly.</p>
          </div>
          <div className="glass p-5 rounded-2xl">
            <div className="text-2xl mb-1">📒</div>
            <h3 className="font-bold mb-1">Activities</h3>
            <p className="text-sm opacity-80">Keep track of things to do.</p>
          </div>
          <div className="glass p-5 rounded-2xl">
            <div className="text-2xl mb-1">💶</div>
            <h3 className="font-bold mb-1">Budget</h3>
            <p className="text-sm opacity-80">Estimate and split costs fairly.</p>
          </div>
        </div>

        {/* Creator Card */}
        <div className="glass p-5 rounded-2xl flex items-center gap-4">
          <img
            src="/creator.png"
            alt="Creator avatar"
            className="w-12 h-12 rounded-full shadow-md"
          />
          <div>
            <p className="font-semibold text-[var(--color-accent)]">Created by Oğuz Can Gökçe</p>
            <p className="text-sm text-[var(--color-muted)]">
              Traveler, builder, and storyteller. Developing tools that make planning simple ✨
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
