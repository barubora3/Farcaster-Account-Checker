export const PieChartComponent = ({ x, y }: { x: number; y: number }) => {
  const percentage = (x / y) * 100;

  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${
    (percentage / 100) * circumference
  } ${circumference}`;

  return (
    <svg width="300" height="300">
      <circle
        cx="150"
        cy="150"
        r={radius}
        fill="transparent"
        stroke="#e0e0e0"
        strokeWidth="30"
      />
      <circle
        cx="150"
        cy="150"
        r={radius}
        fill="transparent"
        stroke="#0088FE"
        strokeWidth="30"
        strokeDasharray={strokeDasharray}
        transform="rotate(-90 150 150)"
      />
      <text x="50%" y="50%" textAnchor="middle" dy=".3em">
        {`${percentage.toFixed(1)}%`}
      </text>
      <text x="50%" y="60%" textAnchor="middle" dy=".3em">
        {`(${x} / ${y})`}
      </text>
    </svg>
  );
};

export const generateSvgString = ({ x, y }: { x: number; y: number }) => {
  const percentage = (x / y) * 100;
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${
    (percentage / 100) * circumference
  } ${circumference}`;

  return `
    <svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <circle cx="150" cy="150" r="${radius}" fill="transparent" stroke="#e0e0e0" stroke-width="30" />
      <circle cx="150" cy="150" r="${radius}" fill="transparent" stroke="#0088FE" stroke-width="30" stroke-dasharray="${strokeDasharray}" transform="rotate(-90 150 150)" />
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-weight="bold">${percentage.toFixed(
        1
      )}%</text>
      <text x="50%" y="60%" text-anchor="middle" dy=".3em" font-weight="bold">(${x} / ${y})</text>    </svg>
  `;
};
