"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register required components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  chartData: { date: string; orders: number }[];
}

export default function VendorDashboardChart({ chartData }: ChartProps) {
  const data = {
    labels: chartData.map((data) => data.date), // X-axis labels (dates)
    datasets: [
      {
        label: "Orders",
        data: chartData.map((data) => data.orders), // Y-axis data
        borderColor: "#6D28D9", // Purple Line
        backgroundColor: "rgba(109, 40, 217, 0.3)", // Purple Background with Transparency
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#6D28D9",
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
          color: "#E5E5E5", // Light Gray Text for Legend
        },
      },
    },
    scales: {
      x: {
        grid: {
          drawBorder: false,
          color: "rgba(255, 255, 255, 0.1)", // Subtle Grid Lines
        },
        ticks: {
          color: "#E5E5E5", // Light Gray Tick Labels
        },
      },
      y: {
        grid: {
          drawBorder: false,
          color: "rgba(255, 255, 255, 0.1)", // Subtle Grid Lines
        },
        ticks: {
          color: "#E5E5E5", // Light Gray Tick Labels
        },
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="shadow-md bg-[#1F2937] text-white">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#E5E5E5]">
            Orders Chart
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <Line data={data} options={options} />
        </CardContent>
      </Card>
    </div>
  );
}
