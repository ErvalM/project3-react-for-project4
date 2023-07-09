import React, { useState, useEffect } from 'react';
import anenGroupLogo from './anengroup.png';
import { Navigate, useNavigate } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import { CgMenuGridR } from 'react-icons/cg';
import MenuItem from './MenuItem';
import SubMenu from './SubMenu';
import '../styleComponents/goal.css';
import axios from 'axios';


const Goal = (props) => {
    const [listingGoal, setListingGoal] = useState(localStorage.getItem('listingGoal') || 0);
    const [buyersGoal, setBuyersGoal] = useState(localStorage.getItem('buyersGoal') || 0);
    const [listingProgress, setListingProgress] = useState(localStorage.getItem('listingProgress') || 0);
    const [buyersProgress, setBuyersProgress] = useState(localStorage.getItem('buyersProgress') || 0);
    const [toDoList, setToDoList] = useState(JSON.parse(localStorage.getItem('toDoList')) || []);
    const [loggedIn, setLoggedIn] = useState(true); //if user is already logged in
    const navigate = useNavigate();


    useEffect(() => {
        axios.get('https://react-backend-project-4.onrender.com/goals/todo')
          .then(response => {
            const goals = response.data;
            setListingGoal(goals.listingGoal);
            setBuyersGoal(goals.buyersGoal);
            setListingProgress(goals.listingProgress);
            setBuyersProgress(goals.buyersProgress);
          })
          .catch(error => {
            console.error(error);
          });
      }, []);

    const handleLogoutClick = () => {
      setLoggedIn(false);
      navigate('/login'); // redirect to login page if logged out
    };
  
    /* redirect to login page if not logged in yet */
    if (!loggedIn) {
      return <Navigate to="/login" />;
    }

    const handleListingGoalChange = (event) => {
        const newListingGoal = event.target.value;
        setListingGoal(newListingGoal);
        axios.post('https://react-backend-project-4.onrender.com/goals/todo', {
          listingGoal: newListingGoal,
          buyersGoal,
          listingProgress,
          buyersProgress
        })
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.error(error);
          });
    };

    const handleBuyersGoalChange = (event) => {
        setBuyersGoal(event.target.value);
        localStorage.setItem('buyersGoal', JSON.stringify(buyersGoal)) //data to browser local storage
        props.setBuyerToAchieve(buyersGoal);
    };

    const handleListingProgressChange = (event) => {
        setListingProgress(event.target.value);
        localStorage.setItem('listingProgress', JSON.stringify(listingProgress)) //data to browser local storage
        props.setListingGoal(listingProgress);
    };

    const handleBuyersProgressChange = (event) => {
        setBuyersProgress(event.target.value);
        localStorage.setItem('buyersProgress', JSON.stringify(buyersProgress)) //data to browser local storage
        props.setBuyerGoal(buyersProgress);
    };

    const handleToDoListChange = (event) => {
        setToDoList(event.target.value.split('\n'));
        localStorage.setItem('toDoList', JSON.stringify([toDoList])) //data to browser local storage
    };

    const handleToDoItemToggle = (index) => {
        setToDoList((prevToDoList) => {
          const newToDoList = [...prevToDoList];
          newToDoList[index] = newToDoList[index].startsWith('✅') 
            ? newToDoList[index].substring(1)
            : `✅ ${newToDoList[index]}`; // add or remove checkmark
          return newToDoList;
        });
        localStorage.setItem('toDoList', JSON.stringify(toDoList)); // update local storage
    };

    return (
        <div>
        <div className="dashboard-container">
        <a href="https://www.facebook.com/media/set/?set=a.515909153665081&type=3" target="_blank">
          <img src={anenGroupLogo} alt="AnenGroup Logo" className="logo" />
        </a>
        <Menu right customBurgerIcon={<CgMenuGridR className="menu-icon" />} >
          <SubMenu title="Menu">
            <MenuItem onClick={() => navigate('/')} title="Dashboard" />
            <MenuItem path="/leadform" title="Lead" />
            <MenuItem path="/expensetracker" title="Expense" />
            <MenuItem path="/goal" title="Goal" />
            <div className="logout-wrapper">
              <MenuItem onClick={handleLogoutClick} title="Log Out" />
            </div>
          </SubMenu>
        </Menu>
        </div>
                <h1 className="goal-header">My Goals</h1>
            <div className="labels">
            <div>
            <div className="goal">
            <label>
                Listing Goal:
                <input
                    type="number"
                    value={listingGoal}
                    onChange={handleListingGoalChange}
                />
                <button onClick={handleListingGoalChange}>Save Listing Goal</button>
            </label>
            <label>
                Buyers Goal:
                <input
                    type="number"
                    value={buyersGoal}
                    onChange={handleBuyersGoalChange}
                />
                <button onClick={handleBuyersGoalChange}>Save Buyer Goal</button>
            </label>
            </div>
            </div>
            <div className="progress">
            <label>
                Listing Progress:
                <input
                    type="number"
                    value={listingProgress}
                    onChange={handleListingProgressChange}
                />
                <button onClick={handleListingProgressChange}>Save Listing Progress</button>
            </label>
            <label>
                Buyers Progress:
                <input
                    type="number"
                    value={buyersProgress}
                    onChange={handleBuyersProgressChange}
                />
                <button onClick={handleBuyersProgressChange}>Save Buyer Progress</button>
            </label>
            </div>
            </div>
            <h2 className="todo-header">Daily To-Do List</h2>
        <div className="todo">
            <div className="text-area">
            <textarea 
                value={toDoList.join('\n')}
                onChange={handleToDoListChange}
            />
            <ul>
                {toDoList.map((item, index) => (
                    <li
                        key={index}
                        style={{textDecoration: item ? '' : 'none'}}
                        onClick={() => handleToDoItemToggle(index)}
                    >
                        {item}
                    </li>
                ))}
            </ul>
            </div>
        </div>
        </div>
    )
}

export default Goal;