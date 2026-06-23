// Lightweight, dependency-free charts (CSS + inline SVG) for the admin dashboard.

// Vertical bar chart. data: [{ label, value, color? }]
export function BarChart({ data, height = 200 }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  const barArea = height - 28 // headroom for the value label above each bar
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height }}>
        {data.map((d) => {
          const h = Math.round((d.value / max) * barArea)
          return (
            <div key={d.label} title={`${d.label}: ${d.value}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0A1F3D', marginBottom: '6px' }}>{d.value}</div>
              <div style={{ width: '100%', maxWidth: '48px', height: `${Math.max(h, d.value > 0 ? 4 : 2)}px`, background: d.color || '#0072CE', borderRadius: '6px 6px 0 0', transition: 'height 0.5s ease' }} />
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
        {data.map((d) => (
          <div key={d.label} style={{ flex: 1, fontSize: '11px', color: '#888', textAlign: 'center' }}>{d.label}</div>
        ))}
      </div>
    </div>
  )
}

// Area/line chart. points: [{ label, value }]
export function AreaChart({ points, height = 200, color = '#0072CE' }) {
  const W = 600
  const H = 220
  const pad = 30
  const innerW = W - pad * 2
  const innerH = H - pad * 2
  const max = Math.max(1, ...points.map((p) => p.value))
  const stepX = points.length > 1 ? innerW / (points.length - 1) : 0
  const px = (i) => pad + i * stepX
  const py = (v) => pad + innerH - (v / max) * innerH

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${px(i).toFixed(1)} ${py(p.value).toFixed(1)}`).join(' ')
  const area = `${line} L ${px(points.length - 1).toFixed(1)} ${(pad + innerH).toFixed(1)} L ${px(0).toFixed(1)} ${(pad + innerH).toFixed(1)} Z`
  const gridY = [0, 0.5, 1]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {gridY.map((g) => {
        const y = pad + innerH - g * innerH
        return (
          <g key={g}>
            <line x1={pad} y1={y} x2={W - pad} y2={y} stroke="#eef0f3" strokeWidth="1" />
            <text x={pad - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#bbb">{Math.round(g * max)}</text>
          </g>
        )
      })}
      <path d={area} fill={color} fillOpacity="0.12" />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={px(i)} cy={py(p.value)} r="3.5" fill="white" stroke={color} strokeWidth="2">
            <title>{`${p.label}: ${p.value}`}</title>
          </circle>
          <text x={px(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#999">{p.label}</text>
        </g>
      ))}
    </svg>
  )
}

// Donut chart. segments: [{ label, value, color }]
export function Donut({ segments, size = 168, thickness = 26 }) {
  const total = segments.reduce((s, x) => s + x.value, 0)
  const r = (size - thickness) / 2
  const c = 2 * Math.PI * r
  let acc = 0
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eef0f3" strokeWidth={thickness} />
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {total > 0 && segments.map((s, i) => {
          const frac = s.value / total
          const dash = frac * c
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={`${dash.toFixed(2)} ${(c - dash).toFixed(2)}`}
              strokeDashoffset={(-acc * c).toFixed(2)}
            >
              <title>{`${s.label}: ${s.value}`}</title>
            </circle>
          )
          acc += frac
          return el
        })}
      </g>
      <text x="50%" y="47%" textAnchor="middle" fontSize="28" fontWeight="800" fill="#0A1F3D" fontFamily="Montserrat, sans-serif">{total}</text>
      <text x="50%" y="61%" textAnchor="middle" fontSize="11" fill="#888">total</text>
    </svg>
  )
}
