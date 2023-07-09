import React, { useState, useEffect } from "react";
import anenGroupLogo from './anengroup.png';
import { Navigate, useNavigate } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import { CgMenuGridR } from 'react-icons/cg';
import { RiDeleteBin6Line } from 'react-icons/ri';
import MenuItem from './MenuItem';
import SubMenu from './SubMenu';
import '../styleComponents/lead.css';
import axios from 'axios';


 /* main lead form function */
const LeadForm = (props) => {
    const [leadInfo, setLeadInfo] = useState(
      { name: "",
        email: "",
        phone:"",
        address: ""
      });
    const [leadStatus, setLeadStatus] = useState("warm");
    const [leads, setLeads] = useState(localStorage.getItem('leads') ? JSON.parse(localStorage.getItem('leads')) : []);
    const [loggedIn, setLoggedIn] = useState(true); //if user is already logged in
    const navigate = useNavigate();
          
    let warmCount = 0;
    let hotCount = 0;
    let closedCount = 0;

    useEffect(() => {
      const fetchLeads = async () => {
        try {
          const response = await axios.get('https://react-backend-project-4.onrender.com/leads/contacts');
          const leadsData = response.data;
          setLeads(leadsData);
        } catch (error) {
          console.error(error);
        }
      };
    
      fetchLeads();
    }, []); 
  
    const handleLogoutClick = () => {
      setLoggedIn(false);
      navigate('/login'); // redirect to login page if logged out
    };
  
    /* redirect to login page if not logged in yet */
    if (!loggedIn) {
      return <Navigate to="/login" />;
    }

    /* function for lead info change*/
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLeadInfo((prevState) => ({...prevState,[name]: value}));
    };

    /* function for lead status change */
    const handleStatusChange = (e, index) => {
      const updatedLeads = [...leads];
      updatedLeads[index].status = e.target.value;
      setLeads(updatedLeads);
    };

    /* function to delete lead */
    const handleDeleteLead = async (index) => {
      const leadId = leads[index]._id;
    
      try {
        await axios.delete(`https://react-backend-project-4.onrender.com/leads/${leadId}`);
        const updatedLeads = [...leads];
        updatedLeads[index].deleted = true;
        setLeads(updatedLeads);
      } catch (error) {
        console.error(error);
      }
    };

    /* function for lead data on submit */
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      try {
        const response = await axios.post('https://react-backend-project-4.onrender.com/leads/', {
          name: leadInfo.name,
          phone: leadInfo.phone,
          email: leadInfo.email,
          address: leadInfo.address,
          status: leadStatus
        });
    
        const newLead = response.data;
        setLeads((prevLeads) => [...prevLeads, newLead]);
      } catch (error) {
        console.error(error);
      }
    
      // Clear the form inputs
      setLeadInfo({ name: '', email: '', phone: '', address: '' });
      setLeadStatus('warm');
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
        <h1 className="lead-header">My Leads</h1>
        <div className="lead-form-container">
          <div className="form-labels-container">
            <form onSubmit={handleSubmit}>
              <label>
                Name:
                <input
                  className="lead-input"
                  type="text"
                  name="name"
                  value={leadInfo.name}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Email:
                <input
                  className="lead-input"
                  type="email"
                  name="email"
                  value={leadInfo.email}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Phone:
                <input
                  className="lead-input"
                  type="text"
                  name="phone"
                  value={leadInfo.phone}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Address:
                <input
                  className="lead-input"
                  type="text"
                  name="address"
                  value={leadInfo.address}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Lead Status:
                <select
                  name="status"
                  value={leadStatus}
                  onChange={handleStatusChange}
                >
                  <option value="warm">Warm</option>
                  <option value="hot">Hot</option>
                  <option value="closed">Closed</option>
                </select>
              </label>
              <button type="submit" onClick={handleSubmit}>Submit</button>
            </form>
        </div>
            {leads.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Lead Status</th>
                            <th>Delete</th>
                            </tr>
                    </thead>
                    <tbody>
                        {leads.map((lead, index) => (
                            <tr key={index}>
                                <td>{lead.name}</td>
                                <td>{lead.email}</td>
                                <td>{lead.phone}</td>
                                <td>{lead.address}</td>
                                <td>
                                    <select
                                        name="status"
                                        value={lead.status}
                                        onChange={(e) => handleStatusChange(e, index)}
                                    >
                                        <option value="warm">Warm</option>
                                        <option value="hot">Hot</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </td>
                                <td>
                                  {lead.deleted ? (
                                    <span>Deleted</span>
                                  ) : (
                                  <button onClick={() => handleDeleteLead(index)}>
                                    <RiDeleteBin6Line />
                                  </button>
                                  )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
        <div className="lead-status-counts">
          <p>
            Warm Leads: <span>{warmCount}</span>
          </p>
          <p>
            Hot Leads: <span>{hotCount}</span>
          </p>
          <p>
            Closed leads: <span>{closedCount}</span>
          </p>
        </div>
      </div>
    )
}

export default LeadForm;