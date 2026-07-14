import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Navbar.css';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const isAdmin = user.role === 'ADMIN';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <svg viewBox="0 0 24 24" className="brand-icon">
          <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        <div className="brand-text">
          <h2>Campus FMS</h2>
          <span>Facility Manager</span>
        </div>
      </div>

      <div className="user-profile-section">
        <div className="user-avatar">
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="user-info">
          <p className="user-name">{user.name || 'User'}</p>
          <span className="user-role-badge">{user.role}</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        {isAdmin ? (
          <>
            <NavLink to="/admin/dashboard" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <svg viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/admin/facilities" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <svg viewBox="0 0 24 24"><path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h20v-2H2v2zm14-12v7h3v-7h-3zm-4.5-6.5L2 9v1h20V9l-9.5-5.5z"/></svg>
              <span>Facilities CRUD</span>
            </NavLink>
            <NavLink to="/admin/bookings" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>
              <span>Bookings Admin</span>
            </NavLink>
            <NavLink to="/admin/issues" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              <span>Issues Admin</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/staff/facilities" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              <span>Browse Facilities</span>
            </NavLink>
            <NavLink to="/staff/booking" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              <span>New Booking</span>
            </NavLink>
            <NavLink to="/staff/my-bookings" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <svg viewBox="0 0 24 24"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>
              <span>My Bookings</span>
            </NavLink>
            <NavLink to="/staff/report-issue" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              <span>Report Issue</span>
            </NavLink>
            <NavLink to="/staff/my-issues" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
              <span>My Issues</span>
            </NavLink>
          </>
        )}
      </nav>

      <button className="logout-button" onClick={handleLogout}>
        <svg viewBox="0 0 24 24" className="logout-icon">
          <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
        </svg>
        <span>Logout</span>
      </button>
    </aside>
  );
};
