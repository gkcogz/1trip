// src/components/SectionHeader.tsx
export default function SectionHeader({ title, action }:{ title:string; action?:React.ReactNode }){
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-[var(--color-accent)] border-b-2 border-[var(--color-brand)] pb-1">{title}</h2>
      <div>{action}</div>
    </div>
  )
}
