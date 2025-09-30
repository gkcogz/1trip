// src/components/SectionHeader.tsx
export default function SectionHeader({
  title,
  subtitle,
  action
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[var(--color-accent)] border-b-2 border-[var(--color-brand)] pb-1">
          {title}
        </h2>
        <div>{action}</div>
      </div>
      {subtitle && (
        <p className="text-sm text-[var(--color-muted)] mt-1">
          {subtitle}
        </p>
      )}
    </div>
  )
}
