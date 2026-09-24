// Consensus recession forecasts, a year in advance: 2 of 60 recessions
// predicted (Loungani, 2001). Pure SVG, zero dependencies. Each square is
// one recession; filled squares were caught in advance.
const COLS = 10;
const ROWS = 6;
const PREDICTED = 2;

const W = 640;
const H = 300;
const PLOT_LEFT = 40;
const PLOT_RIGHT = 600;
const PLOT_TOP = 24;
const PLOT_BOTTOM = 220;

const CELL = (PLOT_RIGHT - PLOT_LEFT) / COLS;
const SIZE = 34;

export default function RecessionDots() {
  const dots = [];
  for (let i = 0; i < COLS * ROWS; i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = PLOT_LEFT + col * CELL + (CELL - SIZE) / 2;
    const y = PLOT_TOP + row * ((PLOT_BOTTOM - PLOT_TOP) / ROWS) + 8;
    dots.push(
      <rect
        key={i}
        x={x}
        y={y}
        width={SIZE}
        height={SIZE}
        rx={6}
        fill={i < PREDICTED ? "#ffc6d5" : "none"}
        stroke={i < PREDICTED ? "#ffc6d5" : "#555"}
        strokeWidth={2}
      />,
    );
  }
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      role="img"
      aria-labelledby="recession-chart-title recession-chart-desc"
    >
      <title id="recession-chart-title">
        Consensus forecasts missed 58 of 60 recessions a year in advance
      </title>
      <desc id="recession-chart-desc">
        Grid of 60 squares, one per recession. 2 filled squares were predicted
        a year in advance; 58 outlined squares were missed. Loungani, 2001,
        International Journal of Forecasting.
      </desc>
      {dots}
      <g fontSize={14}>
        <rect
          x={PLOT_LEFT}
          y={PLOT_BOTTOM + 24}
          width={16}
          height={16}
          rx={4}
          fill="#ffc6d5"
        />
        <text x={PLOT_LEFT + 24} y={PLOT_BOTTOM + 37} fill="#f2f2f2">
          Predicted in advance (2)
        </text>
        <rect
          x={PLOT_LEFT + 260}
          y={PLOT_BOTTOM + 24}
          width={16}
          height={16}
          rx={4}
          fill="none"
          stroke="#555"
          strokeWidth={2}
        />
        <text x={PLOT_LEFT + 284} y={PLOT_BOTTOM + 37} fill="#f2f2f2">
          Missed (58)
        </text>
      </g>
    </svg>
  );
}
