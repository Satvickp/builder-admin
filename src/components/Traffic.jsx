// TrafficSource.js
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { FaDesktop, FaTabletAlt, FaPhone } from 'react-icons/fa';
import 'chart.js/auto';
import './Style.css'

const TrafficSource = () => {
  const data = {
    labels: ['Desktop', 'Tablet', 'Phone'],
    datasets: [
      {
        data: [63, 15, 22],
        backgroundColor: ['#6366F1', '#34D399', '#F59E0B'],
        hoverBackgroundColor: ['#4F46E5', '#059669', '#D97706'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: '70%',
  };

  return (
    <div className="traffic-source-container">
      <h3>Traffic source</h3>
      <div className="chart-wrapper">
        <Doughnut data={data} options={options} />
      </div>
      <div className="icons-wrapper">
        <div className="icon-item">
          <FaDesktop size={24} />
          <p>Desktop</p>
          <span>63%</span>
        </div>
        <div className="icon-item">
          <FaTabletAlt size={24} />
          <p>Tablet</p>
          <span>15%</span>
        </div>
        <div className="icon-item">
          <FaPhone size={24} />
          <p>Phone</p>
          <span>22%</span>
        </div>
      </div>
    </div>
  );
};

export default TrafficSource;
