import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../style/Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getMenuItems = () => {
    if (user?.role === 'mahasiswa') {
      return [
        { path: '/student/dashboard', icon: '📊', label: 'Beranda' },
        { path: '/student/tickets', icon: '🎫', label: 'Tiket Saya' },
        { path: '/student/create-ticket', icon: '➕', label: 'Buat Tiket' },
      ];
    } else if (user?.role === 'dosen') {
      return [
        { path: '/lecturer/dashboard', icon: '📊', label: 'Beranda' },
        { path: '/lecturer/tickets', icon: '🎫', label: 'Semua Tiket' },
      ];
    } else if (user?.role === 'admin') {
      return [
        { path: '/admin/dashboard', icon: '📊', label: 'Beranda' },
        { path: '/admin/tickets', icon: '🎫', label: 'Semua Tiket' },
        { path: '/admin/users', icon: '👥', label: 'Pengguna' },
      ];
    }
    return [];
  };

  const menuItems = getMenuItems();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-logo">📋 SiTeJo</h2>
        <p className="sidebar-subtitle">Sistem Tiket</p>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="user-info">
          <p className="user-name">{user?.name}</p>
          <p className="user-role">{user?.role}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="btn-logout">
          <span className="nav-icon">🚪</span>
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
