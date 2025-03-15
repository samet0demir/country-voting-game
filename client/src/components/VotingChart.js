import React, { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const VotingChart = ({ countries }) => {
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'pie'
  
  // Sort countries by votes (descending)
  const sortedCountries = [...countries].sort((a, b) => b.votes_count - a.votes_count);
  
  // Take top 10 countries
  const topCountries = sortedCountries.slice(0, 10);
  
  // Generate random colors for pie chart
  const generateColors = (count) => {
    const colors = [];
    const backgroundColors = [];
    
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      
      colors.push(`rgba(${r}, ${g}, ${b}, 1)`);
      backgroundColors.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
    }
    
    return { colors, backgroundColors };
  };
  
  const { colors, backgroundColors } = generateColors(topCountries.length);
  
  // Bar chart data
  const barChartData = {
    labels: topCountries.map(country => country.name),
    datasets: [
      {
        label: 'Votes',
        data: topCountries.map(country => country.votes_count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Pie chart data
  const pieChartData = {
    labels: topCountries.map(country => country.name),
    datasets: [
      {
        data: topCountries.map(country => country.votes_count),
        backgroundColor: backgroundColors,
        borderColor: colors,
        borderWidth: 1,
      },
    ],
  };
  
  // Chart options
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top 10 Voted Countries',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Vote Distribution',
      },
    },
  };

  return (
    <div>
      <div className="mb-3">
        <div className="btn-group w-100">
          <button 
            className={`btn ${chartType === 'bar' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setChartType('bar')}
          >
            Bar Chart
          </button>
          <button 
            className={`btn ${chartType === 'pie' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setChartType('pie')}
          >
            Pie Chart
          </button>
        </div>
      </div>
      
      {chartType === 'bar' ? (
        <Bar data={barChartData} options={barOptions} />
      ) : (
        <Pie data={pieChartData} options={pieOptions} />
      )}
    </div>
  );
};

export default VotingChart;