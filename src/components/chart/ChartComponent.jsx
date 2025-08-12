import { useRef } from "react";

export function ChartComponent({
  type,
  data,
  title,
  width = 400,
  height = 300,
}) {
  const chartRef = useRef(null);
  const maxValue = Math.max(...data.map((item) => item.value));
  const colors = [
    "#007bff",
    "#28a745",
    "#ffc107",
    "#dc3545",
    "#6f42c1",
    "#fd7e14",
    "#20c997",
    "#e83e8c",
  ];

  const renderBarChart = () => {
    const barWidth = (width - 80) / data.length;
    const maxBarHeight = height - 80;

    return (
      <svg width={width} height={height}>
        <text
          x={width / 2}
          y="20"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
        >
          {title}
        </text>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * maxBarHeight;
          const x = 40 + index * barWidth + barWidth / 2;
          const y = height - 40 - barHeight;

          return (
            <g key={index}>
              <rect
                x={x - barWidth / 2 + 5}
                y={y}
                width={barWidth - 10}
                height={barHeight}
                fill={colors[index % colors.length]}
                rx="2"
              />
              <text
                x={x}
                y={y - 5}
                textAnchor="middle"
                fontSize="12"
                fill="#333"
              >
                {item.value}
              </text>
              <text
                x={x}
                y={height - 20}
                textAnchor="middle"
                fontSize="10"
                fill="#666"
              >
                {item.label}
              </text>
            </g>
          );
        })}
        <line
          x1="40"
          y1="40"
          x2="40"
          y2={height - 40}
          stroke="#ccc"
          strokeWidth="1"
        />
        <line
          x1="40"
          y1={height - 40}
          x2={width - 40}
          y2={height - 40}
          stroke="#ccc"
          strokeWidth="1"
        />
      </svg>
    );
  };

  const renderLineChart = () => {
    const chartWidth = width - 80;
    const chartHeight = height - 80;
    const pointSpacing = chartWidth / (data.length - 1);

    const points = data.map((item, index) => ({
      x: 40 + index * pointSpacing,
      y: height - 40 - (item.value / maxValue) * chartHeight,
    }));

    const pathData = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");

    return (
      <svg width={width} height={height}>
        <text
          x={width / 2}
          y="20"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
        >
          {title}
        </text>
        <path d={pathData} stroke="#007bff" strokeWidth="2" fill="none" />
        {points.map((point, index) => (
          <g key={index}>
            <circle cx={point.x} cy={point.y} r="4" fill="#007bff" />
            <text
              x={point.x}
              y={point.y - 10}
              textAnchor="middle"
              fontSize="12"
              fill="#333"
            >
              {data[index].value}
            </text>
            <text
              x={point.x}
              y={height - 20}
              textAnchor="middle"
              fontSize="10"
              fill="#666"
            >
              {data[index].label}
            </text>
          </g>
        ))}
        <line
          x1="40"
          y1="40"
          x2="40"
          y2={height - 40}
          stroke="#ccc"
          strokeWidth="1"
        />
        <line
          x1="40"
          y1={height - 40}
          x2={width - 40}
          y2={height - 40}
          stroke="#ccc"
          strokeWidth="1"
        />
      </svg>
    );
  };

  const renderPieChart = () => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return (
      <svg width={width} height={height}>
        <text
          x={width / 2}
          y="30"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
        >
          {title}
        </text>
        {data.map((item, index) => {
          const sliceAngle = (item.value / total) * 2 * Math.PI;
          const startAngle = currentAngle;
          const endAngle = currentAngle + sliceAngle;

          const x1 = centerX + radius * Math.cos(startAngle);
          const y1 = centerY + radius * Math.sin(startAngle);
          const x2 = centerX + radius * Math.cos(endAngle);
          const y2 = centerY + radius * Math.sin(endAngle);

          const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            "Z",
          ].join(" ");

          currentAngle += sliceAngle;

          const labelAngle = startAngle + sliceAngle / 2;
          const labelRadius = radius + 20;
          const labelX = centerX + labelRadius * Math.cos(labelAngle);
          const labelY = centerY + labelRadius * Math.sin(labelAngle);

          return (
            <g key={index}>
              <path
                d={pathData}
                fill={colors[index % colors.length]}
                stroke="white"
                strokeWidth="2"
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                fontSize="12"
                fill="#333"
              >
                {`${item.label} (${Math.round((item.value / total) * 100)}%)`}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  const renderChart = () => {
    switch (type) {
      case "bar":
        return renderBarChart();
      case "line":
        return renderLineChart();
      case "pie":
        return renderPieChart();
      default:
        return renderBarChart();
    }
  };

  return (
    <div
      ref={chartRef}
      style={{
        width: width,
        height: height,
        background: "white",
        borderRadius: "4px",
        border:'1px solid gray'
      }}
    >
      {renderChart()}
    </div>
  );
}
