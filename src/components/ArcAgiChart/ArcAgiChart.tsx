// Frontier AI snapshots when each ARC-AGI generation was introduced.
// Pure SVG, zero dependencies. These are dated snapshots under different
// harnesses and budgets — NOT one controlled learning curve (see Table 1
// and Appendix A of the essay). Bar heights are to a shared 0–100% scale.
const BARS = [
  { version: "ARC-AGI-1", context: "static · Feb 2026", value: 93.0, label: "93.0%" },
  { version: "ARC-AGI-2", context: "harder · 2025", value: 24.03, label: "24.03%" },
  { version: "ARC-AGI-3", context: "interactive · launch", value: 1.0, label: "<1%" },
];

const W = 640;
const H = 420;
const PLOT_LEFT = 48;
const PLOT_RIGHT = 624;
const PLOT_TOP = 32;
const PLOT_BOTTOM = 324;
const BAR_WIDTH = 110;

const y = (v: number) => PLOT_BOTTOM - (v / 100) * (PLOT_BOTTOM - PLOT_TOP);

export default function ArcAgiChart() {
  const plotW = PLOT_RIGHT - PLOT_LEFT;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      role="img"
      aria-labelledby="arc-agi-chart-title arc-agi-chart-desc"
    >
      <title id="arc-agi-chart-title">
        Frontier AI accuracy when each ARC-AGI generation was introduced
      </title>
      <desc id="arc-agi-chart-desc">
        Bar chart. ARC-AGI-1 static grids in February 2026: 93.0 percent.
        ARC-AGI-2 harder composition in the 2025 competition: 24.03 percent.
        ARC-AGI-3 interactive discovery at launch: below 1 percent. Figures
        come from different dates, harnesses, and resource budgets and are not
        directly comparable as a single learning curve.
      </desc>
      {[0, 25, 50, 75, 100].map((tick) => (
        <g key={tick}>
          <line
            x1={PLOT_LEFT}
            x2={PLOT_RIGHT}
            y1={y(tick)}
            y2={y(tick)}
            stroke="#444"
            strokeWidth={1}
          />
          <text
            x={PLOT_LEFT - 8}
            y={y(tick) + 5}
            textAnchor="end"
            fontSize={14}
            fill="#cfcfcf"
          >
            {tick}%
          </text>
        </g>
      ))}
      {BARS.map((bar, i) => {
        const cx = PLOT_LEFT + (plotW * (2 * i + 1)) / (2 * BARS.length);
        const top = y(bar.value);
        return (
          <g key={bar.version}>
            <rect
              x={cx - BAR_WIDTH / 2}
              y={top}
              width={BAR_WIDTH}
              height={PLOT_BOTTOM - top}
              fill="#ffc6d5"
            />
            <text
              x={cx}
              y={top - 8}
              textAnchor="middle"
              fontSize={16}
              fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
              fill="#f2f2f2"
            >
              {bar.label}
            </text>
            <text
              x={cx}
              y={PLOT_BOTTOM + 28}
              textAnchor="middle"
              fontSize={16}
              fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
              fill="#f2f2f2"
            >
              {bar.version}
            </text>
            <text
              x={cx}
              y={PLOT_BOTTOM + 52}
              textAnchor="middle"
              fontSize={14}
              fill="#cfcfcf"
            >
              {bar.context}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
