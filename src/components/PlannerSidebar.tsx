import { useI18n } from '../i18n'

type PlannerSidebarProps = {
  onUndo?: () => void
  onRedo?: () => void
  onImportJSON?: () => void
  onExportJSON?: () => void
  onExportCSV?: () => void
  onGeneratePDF?: () => void
}

export default function PlannerSidebar({
  onUndo,
  onRedo,
  onImportJSON,
  onExportJSON,
  onExportCSV,
  onGeneratePDF,
}: PlannerSidebarProps) {
  const { t } = useI18n()

  const actions = [
    { label: t('topbar.importJSON') || 'Import', icon: '📥', action: onImportJSON },
    { label: t('topbar.exportJSON') || 'Export JSON', icon: '🧾', action: onExportJSON },
    { label: t('topbar.exportCSV') || 'Export CSV', icon: '📊', action: onExportCSV },
    { label: t('topbar.print') || 'Print / PDF', icon: '🖨️', action: onGeneratePDF },
    { label: t('topbar.undo') || 'Undo', icon: '↩️', action: onUndo },
    { label: t('topbar.redo') || 'Redo', icon: '↪️', action: onRedo },
  ]

  return (
    // Ana kapsayıcıyı "oyuncak kumandası" gibi görünecek şekilde güncelledik
    <aside
      className="fixed top-1/2 left-4 -translate-y-1/2 w-16 p-3 
                 bg-white/70 backdrop-blur-md border border-gray-200/80 
                 rounded-full shadow-2xl z-30 print:hidden
                 flex flex-col items-center gap-3
                 animate-breathing-glow" // Özel animasyon sınıfını ekledik
    >
      {/* Kumandanın üzerindeki küçük ışık gibi bir detay */}
      <div className="w-2.5 h-2.5 bg-red-400 rounded-full opacity-70 mb-2 shadow-inner"></div>

      {actions.map(({ label, icon, action }) => (
        <button
          key={label}
          onClick={action}
          title={label}
          className="sidebar-btn text-xl" // CSS'te tanımladığımız özel buton stilini kullandık
        >
          {icon}
        </button>
      ))}
    </aside>
  )
}