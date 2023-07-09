import React, { useState } from 'react';


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

export default SubMenu;