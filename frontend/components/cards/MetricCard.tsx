type MetricCardProps = {
  title: string
  value: string | number
  subtitle?: string
}

export default function MetricCard({
  title,
  value,
  subtitle,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/20">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-400">
          {title}
        </p>
        <p className="text-3xl font-semibold text-white">{value}</p>
        {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
      </div>
    </div>
  )
}
