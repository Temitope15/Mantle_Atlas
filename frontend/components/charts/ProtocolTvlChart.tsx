import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export type ProtocolTvlPoint = {
  name: string;
  tvl: number;
};

type ProtocolTvlChartProps = {
  data: ProtocolTvlPoint[];
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
    style: "currency",
    currency: "USD",
  }).format(value);
};

export default function ProtocolTvlChart({
  data,
}: ProtocolTvlChartProps): JSX.Element {
  const labels = data.map((item) => item.name);
  const values = data.map((item) => item.tvl);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Protocol TVL",
        data: values,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.18)",
        fill: true,
        tension: 0.35,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#22c55e",
        pointBorderColor: "#166534",
        pointBorderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#e5e7eb",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: { parsed: { y: number } }) {
            return ` TVL: ${formatCurrency(context.parsed.y)}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#d1d5db",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.06)",
        },
      },
      y: {
        ticks: {
          color: "#d1d5db",
          callback: function (value: string | number) {
            return formatCurrency(Number(value));
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.06)",
        },
      },
    },
  };

  return (
    <div className="h-80 w-full rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Protocol TVL Trend</h3>
        <p className="text-sm text-slate-400">
          Relative TVL distribution across top Mantle protocols
        </p>
      </div>
      <div className="h-60 w-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
