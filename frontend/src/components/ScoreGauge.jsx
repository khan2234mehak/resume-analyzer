import { motion } from 'framer-motion';

const COLOR_MAP = {
  signal: 'var(--color-signal)',
  verdant: 'var(--color-verdant)',
  ember: 'var(--color-ember)',
  amber: 'var(--color-amber)',
};

function colorForScore(score) {
  if (score >= 75) return COLOR_MAP.verdant;
  if (score >= 50) return COLOR_MAP.amber;
  return COLOR_MAP.ember;
}

/**
 * ScoreGauge — the product's signature device.
 * A segmented radial dial (not a plain progress ring) used consistently
 * for ATS Score, Resume Score, and Job Match % throughout the app.
 */
export default function ScoreGauge({ score = 0, label, size = 140, colorOverride }) {
  const radius = size / 2 - 12;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference * (1 - clamped / 100);
  const color = colorOverride || colorForScore(clamped);

  // Tick marks every 10% around the dial
  const ticks = Array.from({ length: 10 }, (_, i) => i * 36);

  return (
    <div className="flex flex-col items-center gap-2" style={{ width: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          {ticks.map((angle, i) => (
            <line
              key={i}
              x1={size / 2}
              y1={6}
              x2={size / 2}
              y2={12}
              stroke="var(--color-border)"
              strokeWidth={2}
              transform={`rotate(${angle} ${size / 2} ${size / 2})`}
            />
          ))}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={8}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono font-semibold" style={{ fontSize: size * 0.24, color: 'var(--color-ink)' }}>
            {Math.round(clamped)}
          </span>
          <span className="text-xs text-ink-muted" style={{ color: 'var(--color-ink-muted)' }}>/ 100</span>
        </div>
      </div>
      {label && <span className="text-sm font-medium" style={{ color: 'var(--color-ink-muted)' }}>{label}</span>}
    </div>
  );
}
