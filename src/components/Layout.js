import React from 'react';
import Sidebar from './Sidebar';
import '../style/Sidebar.css';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;
