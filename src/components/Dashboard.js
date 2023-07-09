import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import anenGroupLogo from './anengroup.png';
import { slide as Menu } from 'react-burger-menu';
import { CgMenuGridR } from 'react-icons/cg';
import Chart from 'chart.js/auto';
import moment from 'moment';
import '../styleComponents/dashboard.css';

const Dashboard = (props) => {
  const [loggedIn, setLoggedIn] = useState(true); //if user is already logged in
  const [expenses, setExpenses] = useState(localStorage.getItem('expenses') ? JSON.parse(localStorage.getItem('expenses')) : []);
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  const revenueData = [0,0,0,0,0,0,0,0,0,0,0,0];

  
  console.log(expenses);
  
  expenses.map(expense => {
    let month = moment(expense.date, 'YYYY-MM-DD').format('M');
    console.log(month);
    revenueData[month-1] = revenueData[month-1] + parseInt(expense.profit)
  });
    console.log(revenueData);


  useEffect(() => {
    if (chartRef && chartRef.current) {
      const chart = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Revenue Chart',
            data: revenueData,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        }
      });
  
      // destroy the prev chart
      return () => {
        chart.destroy();
      };
    }
  }, [chartRef, revenueData]);

  useEffect(() => {
    if (doughnutChartRef && doughnutChartRef.current) {
      const chart = new Chart(doughnutChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [{
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
  
      // destroy the prev chart
      return () => {
        chart.destroy();
      };
    }
  }, [doughnutChartRef]);

  const handleLogoutClick = () => {
    setLoggedIn(false);
    navigate('/login'); // redirect to login page if logged out
  };

  /* redirect to login page if not logged in yet */
  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  return (
  <div>
    <div className="dashboard-container">
      <a href="https://www.facebook.com/media/set/?set=a.515909153665081&type=3" target="_blank">
        <img src={anenGroupLogo} alt="AnenGroup Logo" className="logo" />
      </a>
      <Menu right customBurgerIcon={<CgMenuGridR className="menu-icon" />} >
        <SubMenu path="/" title="Menu">
          <MenuItem path="/leadform" title="Lead" />
          <MenuItem path="/expensetracker" title="Expense" />
          <MenuItem path="/goal" title="Goal" />
          <div className="logout-wrapper">
            <MenuItem onClick={handleLogoutClick} title="Log Out" />
          </div>
        </SubMenu>
      </Menu>
    </div>
    <div className="dashboard-total">
      <div>
        Revenue:
        <p>${props.revenue >= 1000000 
          ? `${(props.revenue / 1000000).toFixed(2)}M` 
          : props.revenue >= 1000 
          ? `${(props.revenue / 1000).toFixed(0)}K` 
          : props.revenue}</p>
      </div>
      <div>
        Total Closed:
        <p>{props.totalClosed}</p>
      </div>
      <div>
        Listing Goal:
        <p>{props.listingGoal} / {props.listingToAchieve}</p>
      </div>
      <div>
        Buyer Goal:
        <p>{props.buyerGoal} / {props.buyerToAchieve}</p>
      </div>
    </div>
    <div className="chart-container">
      <div className="new-revenue-chart">
        <canvas ref={chartRef} id="revenue-chart">{props.revenue}</canvas>
      </div>
      <div className="doughnut-chart">
      <canvas ref={doughnutChartRef} />
      </div>
    </div>
  </div>
  );
};

const MenuItem = ({ path, title, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (path) {
      navigate(path);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <a onClick={handleClick} className="menu-item">
      {title}
    </a>
  );
};

const SubMenu = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTitleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div onClick={handleTitleClick} className="menu-item submenu-title">
        {title}
      </div>
      <div className={`submenu-content ${isOpen ? 'open' : ''}`}>{children}</div>
    </div>
  );
};

export default Dashboard;
