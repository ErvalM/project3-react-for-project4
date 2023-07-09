import React, { useState, useEffect } from 'react';
import anenGroupLogo from './anengroup.png';
import { Navigate, useNavigate } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import { CgMenuGridR } from 'react-icons/cg';
import { RiDeleteBin6Line } from 'react-icons/ri';
import MenuItem from './MenuItem';
import SubMenu from './SubMenu';
import '../styleComponents/expense.css';
import axios from 'axios';


const ExpenseTracker = (props) => {
    const [expenses, setExpenses] = useState(localStorage.getItem('expenses') ? JSON.parse(localStorage.getItem('expenses')) : []);
    const [expenseName, setExpenseName] = useState('');
    const [expenseAmount, setExpenseAmount] = useState(0);
    const [expenseDuration, setExpenseDuration] = useState(0);
    const [profitAmount, setProfitAmount] = useState(0);
    const [date, setDate] = useState(new Date());
    const [loggedIn, setLoggedIn] = useState(true); //if user is already logged in
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExpenses = async () => {
          try {
            const response = await axios.get('https://react-backend-project-4.onrender.com/expenses/tracker');
            setExpenses(response.data);
          } catch (error) {
            console.error(error);
          }
        };
    
        fetchExpenses();
      }, []);

    const getMonthName = (month) => { // convert yyyy-mm to month name
        const monthNames = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        const [year, monthNum] = month.split('-');
        return `${monthNames[monthNum - 1]} ${year}`;
    };

    const totalProfitByMonth = expenses.reduce((result, expense) => {
        const month = expense.date ? expense.date.substring(0, 7) : ''; // month in yyyy-mm format
        const profit = parseFloat(expense.profit);
        const monthName = getMonthName(month); // get month name
        result[monthName] = (result[monthName] || 0) + profit; // add profit to month
        return result;
    }, {});
    
    const handleDateChange = (event) => {
        const dateString = event.target.value;
        const dateObject = new Date(dateString);
        setDate(dateObject);
    };
  
    const handleLogoutClick = () => {
      setLoggedIn(false);
      navigate('/login'); // redirect to login page if logged out
    };
  
    /* redirect to login page if not logged in yet */
    if (!loggedIn) {
      return <Navigate to="/login" />;
    }
    

    const addExpense = async (event) => {
        event.preventDefault();
        const newExpense = {
          date: date.toISOString().substring(0, 10),
          expenseName: expenseName,
          expenseAmount: `$${expenseAmount}`,
          expenseDuration: `${expenseDuration} days`,
          profit: `${profitAmount}`,
        };
      
        try {
          await axios.post('https://react-backend-project-4.onrender.com/expenses/', newExpense);
          setExpenses([...expenses, newExpense]);
          localStorage.setItem('expenses', JSON.stringify([...expenses, newExpense]));
          setExpenseName('');
          setExpenseAmount(0);
          setExpenseDuration(0);
          setProfitAmount(0);
          props.setRevenue(revenue);
        } catch (error) {
          console.error(error);
        }
      };
    

    const deleteExpense = async (index) => {
        try {
          const expenseId = expenses[index]._id;
          await axios.delete(`https://react-backend-project-4.onrender.com/expenses/${expenseId}`);
          const newExpenses = [...expenses];
          newExpenses.splice(index, 1);
          setExpenses(newExpenses);
          localStorage.setItem('expenses', JSON.stringify(newExpenses));
        } catch (error) {
          console.error(error);
        }
    };

    const totalExpense = expenses.reduce((total, expense) => {
        const amount = expense.amount || '0';
        return total + parseFloat(amount.replace('$', ''));
      }, 0);
    const totalProfit = expenses.reduce((total, expense) => total + parseFloat(expense.profit), 0);
    const revenue = totalProfit - totalExpense;

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
        <div>
            <h2 className="expense-header">Expense Tracker</h2>
            <form onSubmit={addExpense}>
                <div className="date-style">
                <label htmlFor="date">Date:</label>
                <input
                    type="date"
                    id="date" 
                    value={date.toISOString().substring(0, 10)}
                    onChange={handleDateChange}
                />
                <p>You selected: {date.toLocaleDateString()}</p>
                </div>
                <label htmlFor="expenseName">Expense Name:</label>
                <input
                    type="text"
                    id="expenseName"
                    value={expenseName}
                    onChange={(e) => setExpenseName(e.target.value)}
                />
                <label htmlFor="expenseAmount">Expense Amount:</label>
                <input
                    type="number"
                    id="expenseAmount"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                />
                <label htmlFor="expenseDuration">Expense Duration:</label>
                <input
                    type="number"
                    id="expenseDuration"
                    value={expenseDuration}
                    onChange={(e) => setExpenseDuration(e.target.value)}
                />
                <label htmlFor="profitAmount">Profit Amount:</label>
                <input
                    type="number"
                    id="profitAmount"
                    value={profitAmount}
                    onChange={(e) => setProfitAmount(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Expense Name</th>
                        <th>Expense Amount</th>
                        <th>Expense Duration</th>
                        <th>Profit Amount</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense, index) => (
                        <tr key={index}>
                            <td>{new Date(expense.date).toLocaleDateString()}</td>
                            <td>{expense.expenseName}</td>
                            <td>{expense.expenseAmount}</td>
                            <td>{expense.expenseDuration}</td>
                            <td>{expense.profit}</td>
                            <td>
                                <button onClick={() => deleteExpense(index)}><RiDeleteBin6Line /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <table>
                <thead>
                    <tr>
                        <th>Total Expense</th>
                        <th>Total Profit</th>
                        <th>Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${totalExpense}</td>
                        <td>${totalProfit}</td>
                        <td>${revenue}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    )
};


export default ExpenseTracker;
