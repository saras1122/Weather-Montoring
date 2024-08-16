import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const LineChart = ({value}) => {
  const daily = value?.daily || [];
  const labels = daily.map(day => day.title);
  const dataPoints = daily.map(day => day.temp);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Temperature",
        data: dataPoints,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)"
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      }
    }
  };

  return (
    <div style={{ width: '600px', height: '400px' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
