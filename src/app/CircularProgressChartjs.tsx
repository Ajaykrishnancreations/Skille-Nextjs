import { useEffect, useRef } from 'react';
import * as Chart from 'chart.js/auto';

interface CircularProgressChartProps {
  organization: number;
  admin: number;
  purchased: number;
}

const CircularProgressChartjs: React.FC<CircularProgressChartProps> = ({ organization, admin, purchased }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance:any = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        // Destroy existing chart if it exists
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        // Create new chart
        chartInstance.current = new Chart.default(ctx, {
          type: 'doughnut',
          data: {
            labels: ["Purchased", "Enrolled by Admin", "Free within organization"],
            datasets: [
              {
                data: [purchased, admin, organization],
                backgroundColor: ['#4CAF50', '#E0E0E0', '#1e6356'],
                hoverBackgroundColor: ['#4CAF50', '#E0E0E0', '#1e6356'],
                borderWidth: 0,
              },
            ],
          },
          options: {
            cutout: '50%',
            responsive: true,
            maintainAspectRatio: false,
          },
        });
      }
    }

    // Cleanup function to destroy the chart when the component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [organization, admin, purchased]);

  return (
    <canvas
      ref={(canvas) => {
        chartRef.current = canvas;
      }}
    />
  );
};

export default CircularProgressChartjs;
