// AA-Omniscience hallucination rates, exact builds, read live 2026-09-22.
// Pure SVG, zero dependencies. Hallucination rate = incorrect ÷ (incorrect +
// partial + not attempted): how often the model answers incorrectly when it
// should have refused or admitted not knowing. Effort settings differ
// (Gemini high, others max) — gaps are approximate, see Table 2.
const BARS = [
  { model: "Gemini", build: "3.8 Flash", value: 55, label: "55%" },
  { model: "Spark", build: "1.3", value: 33, label: "33%" },
  { model: "Sonnet", build: "5", value: 39, label: "39%" },
  { model: "DeepSeek", build: "V4 Pro 0813", value: 95, label: "95%" },
];

const W = 640;
const H = 440;
const PLOT_LEFT = 48;
const PLOT_RIGHT = 624;
const PLOT_TOP = 32;
const PLOT_BOTTOM = 324;
const BAR_WIDTH = 96;

const y = (v: number) => PLOT_BOTTOM - (v / 100) * (PLOT_BOTTOM - PLOT_TOP);

export default function OmniscienceChart() {
  const plotW = PLOT_RIGHT - PLOT_LEFT;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      role="img"
      aria-labelledby="omniscience-chart-title omniscience-chart-desc"
    >
      <title id="omniscience-chart-title">
        AA-Omniscience hallucination rates for four frontier models
      </title>
      <desc id="omniscience-chart-desc">
        Bar chart. Hallucination rate, lower better. Muse Spark 1.3: 33
        percent. Claude Sonnet 5: 39 percent. Gemini 3.8 Flash: 55 percent.
        DeepSeek V4 Pro 0813: 95 percent. Exact builds, read live on
        September 22, 2026. Reasoning effort differs across rows.
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
          <g key={bar.model}>
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
              y={PLOT_BOTTOM + 26}
              textAnchor="middle"
              fontSize={13}
              fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
              fill="#f2f2f2"
            >
              {bar.model}
            </text>
            <text
              x={cx}
              y={PLOT_BOTTOM + 48}
              textAnchor="middle"
              fontSize={12}
              fill="#cfcfcf"
            >
              {bar.build}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
