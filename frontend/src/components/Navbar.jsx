import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Shield, Menu, X, Sun, Moon, User, ChevronDown, Bell } from 'lucide-react';
import { getNotifications, markAsRead, markAllAsRead } from '../services/notificationService';
import '../styles/cybershield.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      if (res && res.success) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="cyber-navbar">
      <Link to="/" className="nav-brand">
        <Shield size={28} color="var(--accent-cyan)" />
        <span>CyberShield</span>
      </Link>
      
      <div className="nav-links" style={{ display: mobileMenuOpen ? 'flex' : '' }}>
        {user ? (
          <>
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
            <Link to="/learn" onClick={() => setMobileMenuOpen(false)}>Learn</Link>
            <Link to="/missions" onClick={() => setMobileMenuOpen(false)}>Missions</Link>
            <Link to="/challenges" onClick={() => setMobileMenuOpen(false)}>Challenges</Link>
            <Link to="/paths" onClick={() => setMobileMenuOpen(false)}>Paths</Link>
          </>
        ) : (
          <>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/missions" onClick={() => setMobileMenuOpen(false)}>Missions</Link>
            <Link to="/learn" onClick={() => setMobileMenuOpen(false)}>Learn</Link>
          </>
        )}
      </div>
      
      <div className="nav-actions">
        <button 
          onClick={toggleTheme} 
          className="theme-toggle"
          aria-label="Toggle theme"
          style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        {user ? (
          <>
            <div className="profile-dropdown-container">
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setNotificationDropdownOpen(!notificationDropdownOpen);
                  setProfileDropdownOpen(false);
                }}
                style={{ position: 'relative', background: 'transparent', border: 'none', color: 'var(--text-primary)', padding: '0.5rem' }}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </button>
              {notificationDropdownOpen && (
                <div className="profile-dropdown-menu notification-menu" style={{ width: '300px', right: '-50px' }}>
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>Notifications</strong>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllAsRead} style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', padding: 0 }}>Mark all read</button>
                    )}
                  </div>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>You're all caught up.</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n._id} onClick={() => !n.isRead && handleMarkAsRead(n._id)} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: n.isRead ? 'transparent' : 'rgba(74, 222, 128, 0.1)', cursor: 'pointer' }}>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>{n.type}</div>
                          <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{n.title}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="profile-dropdown-container">
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setNotificationDropdownOpen(false);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
              >
                <User size={18} />
                <span>Account</span>
                <ChevronDown size={16} />
              </button>
              {profileDropdownOpen && (
                <div className="profile-dropdown-menu">
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.5rem' }}>
                    <strong>{user.username}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.email}</div>
                  </div>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setProfileDropdownOpen(false)} style={{ color: 'var(--accent-red)' }}>Admin Panel</Link>
                  )}
                  <Link to="/profile" onClick={() => setProfileDropdownOpen(false)}>Profile Settings</Link>
                  <button onClick={() => { handleLogout(); setProfileDropdownOpen(false); }} style={{ color: '#EF4444' }}>Logout</button>
                </div>
              )}
            </div>
            
            <button className="auth-side-menu-btn" onClick={() => setSideMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary btn-outline">Login</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </>
        )}
      </div>

      {!user && (
        <button className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Auth Side Menu Overlay */}
      {user && (
        <div className={`side-menu-overlay ${sideMenuOpen ? 'open' : ''}`}>
          <div className="side-menu-header">
            <h3>Menu</h3>
            <button onClick={() => setSideMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>
          <div className="side-menu-links">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', marginTop: '1rem' }}>Main</div>
            <Link to="/dashboard" onClick={() => setSideMenuOpen(false)}>Dashboard</Link>
            <Link to="/missions" onClick={() => setSideMenuOpen(false)}>Missions</Link>
            <Link to="/challenges" onClick={() => setSideMenuOpen(false)}>Challenges</Link>
            <Link to="/learn" onClick={() => setSideMenuOpen(false)}>Learn</Link>
            <Link to="/paths" onClick={() => setSideMenuOpen(false)}>Learning Paths</Link>
            
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', marginTop: '1.5rem' }}>Progress</div>
            <Link to="/skills" onClick={() => setSideMenuOpen(false)}>My Skills</Link>
            <Link to="/profile" onClick={() => setSideMenuOpen(false)}>Achievements</Link>
            <Link to="/leaderboard" onClick={() => setSideMenuOpen(false)}>Leaderboard</Link>
            
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', marginTop: '1.5rem' }}>Tools</div>
            <Link to="/assistant" onClick={() => setSideMenuOpen(false)}>Security Assistant</Link>
            <Link to="/history" onClick={() => setSideMenuOpen(false)}>Investigation History</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
