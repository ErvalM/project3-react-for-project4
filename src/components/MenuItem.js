import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

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
  
export default MenuItem;