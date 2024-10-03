import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function Graph({ transactions }) {
  const data = {
    labels: transactions.map(t => new Date(t.date).toLocaleDateString()), // Displaying formatted date as label
    datasets: [
      {
        label: 'Income',
        data: transactions.filter(t => t.type === 'income').map(t => parseFloat(t.amount)), // Ensure amounts are numbers
        borderColor: 'green',
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        fill: true, // Enable fill for the line graph
      },
      {
        label: 'Expense',
        data: transactions.filter(t => t.type === 'expense').map(t => parseFloat(t.amount)), // Ensure amounts are numbers
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        fill: true, // Enable fill for the line graph
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${parseFloat(context.raw).toLocaleString()} THB`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString() + ' THB'; // Display value with currency format
          },
        },
      },
    },
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
}
