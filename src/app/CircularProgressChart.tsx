import { useEffect, useRef } from 'react';
import * as Chart from 'chart.js/auto';
interface CircularProgressChartProps {
  progress: number;
}
const CircularProgressChart: React.FC<CircularProgressChartProps> = ({ progress }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        new Chart.default(ctx, {
          type: 'doughnut',
          data: {
            datasets: [
              {
                data: [progress, 100 - progress],
                backgroundColor: ['#4CAF50', '#E0E0E0'],
                hoverBackgroundColor: ['#4CAF50', '#E0E0E0'],
                borderWidth: 0,
              },
            ],
          },
          options: {
            cutout: '70%',
            responsive: true,
            maintainAspectRatio: false
          },
        });
      }
    }
  }, [progress]);

  return (
    <canvas
      ref={(canvas) => {
        chartRef.current = canvas;
      }}
    />
  );
};

export default CircularProgressChart;
