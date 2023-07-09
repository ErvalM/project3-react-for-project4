import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.js';
import LeadForm from './components/LeadForm.js';
import ExpenseTracker from './components/ExpenseTracker.js';
import Dashboard from './components/Dashboard';
import Goal from './components/Goal'
import './styleComponents/background.css';

function App() {
  const [revenue, setRevenue] = useState(0);
  const [totalClosed, setTotalClosed] = useState(0)
  const [listingGoal, setListingGoal] = useState(0);
  const [buyerGoal, setBuyerGoal] = useState(0)
  const [listingToAchieve, setListingToAchieve] = useState(0);
  const [buyerToAchieve, setBuyerToAchieve] = useState(0);

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route exact path="/dashboard" element={
            <Dashboard
            revenue={revenue}
            totalClosed={totalClosed} 
            listingGoal={listingGoal}
            buyerGoal={buyerGoal}
            listingToAchieve={listingToAchieve}
            buyerToAchieve={buyerToAchieve}
          />} />
          <Route path="/login" element={<Login />} />
          <Route path="/leadform" element={<LeadForm setTotalClosed={setTotalClosed} />} />
          <Route path="/expensetracker" element={
            <ExpenseTracker 
            setRevenue={setRevenue} 
          />} />
          <Route path="/goal" element={
          <Goal
            setListingGoal={setListingGoal} 
            setBuyerGoal={setBuyerGoal}
            setListingToAchieve={setListingToAchieve}
            setBuyerToAchieve={setBuyerToAchieve}
          />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;