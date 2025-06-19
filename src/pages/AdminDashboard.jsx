import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import eventService from '../services/eventService';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [usersData, eventsData, statsData] = await Promise.all([
        adminService.getAllUsers(),
        eventService.getAllEvents(),
        adminService.getAdminStats()
      ]);
      setUsers(usersData);
      setEvents(eventsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setMessage('Failed to load admin data');
      setMessageType('danger');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await adminService.deleteUser(userId);
        setMessage('User deleted successfully');
        setMessageType('success');
        fetchAdminData(); // Refresh data
      } catch (error) {
        setMessage('Failed to delete user');
        setMessageType('danger');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getEventStats = () => {
    const now = new Date();
    const upcoming = events.filter(event => new Date(event.eventDate) > now).length;
    const past = events.filter(event => new Date(event.eventDate) <= now).length;
    const totalParticipants = events.reduce((total, event) => total + event.currentParticipants, 0);
    
    return { upcoming, past, totalParticipants };
  };

  const eventStats = getEventStats();

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <span className="ms-2">Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-4 fw-bold mb-2">Admin Dashboard</h1>
          <p className="lead text-muted">Manage users and monitor platform activity</p>
        </div>
      </div>

      {message && (
        <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
          {message}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setMessage('')}
          ></button>
        </div>
      )}

      {/* Stats Overview */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card dashboard-card">
            <div className="card-body text-center">
              <div className="text-primary mb-2">
                <i className="fas fa-users fa-2x"></i>
              </div>
              <h3 className="fw-bold">{users.length}</h3>
              <p className="text-muted mb-0">Total Users</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card dashboard-card">
            <div className="card-body text-center">
              <div className="text-success mb-2">
                <i className="fas fa-calendar fa-2x"></i>
              </div>
              <h3 className="fw-bold">{events.length}</h3>
              <p className="text-muted mb-0">Total Events</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card dashboard-card">
            <div className="card-body text-center">
              <div className="text-info mb-2">
                <i className="fas fa-calendar-check fa-2x"></i>
              </div>
              <h3 className="fw-bold">{eventStats.upcoming}</h3>
              <p className="text-muted mb-0">Upcoming Events</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card dashboard-card">
            <div className="card-body text-center">
              <div className="text-warning mb-2">
                <i className="fas fa-user-friends fa-2x"></i>
              </div>
              <h3 className="fw-bold">{eventStats.totalParticipants}</h3>
              <p className="text-muted mb-0">Total Registrations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="card">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                Users ({users.length})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'events' ? 'active' : ''}`}
                onClick={() => setActiveTab('events')}
              >
                Events ({events.length})
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {activeTab === 'overview' && (
            <div>
              <h5 className="mb-3">Platform Overview</h5>
              <div className="row">
                <div className="col-md-6">
                  <h6>Recent Activity</h6>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between">
                      <span>New users this month</span>
                      <span className="badge bg-primary">{users.filter(user => {
                        const userDate = new Date(user.createdAt);
                        const now = new Date();
                        return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
                      }).length}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Events created this month</span>
                      <span className="badge bg-success">{events.filter(event => {
                        const eventDate = new Date(event.createdAt);
                        const now = new Date();
                        return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
                      }).length}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Upcoming events</span>
                      <span className="badge bg-info">{eventStats.upcoming}</span>
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6>System Health</h6>
                  <div className="alert alert-success">
                    <i className="fas fa-check-circle me-2"></i>
                    All systems operational
                  </div>
                  <button className="btn btn-outline-primary" onClick={fetchAdminData}>
                    <i className="fas fa-sync me-2"></i>Refresh Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>User Management</h5>
                <span className="text-muted">{users.length} total users</span>
              </div>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>
                          <div>
                            <h6 className="mb-1">{user.firstName} {user.lastName}</h6>
                            <small className="text-muted">@{user.username}</small>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge ${user.role === 'ADMIN' ? 'bg-danger' : 'bg-primary'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <small>{formatDate(user.createdAt)}</small>
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.role === 'ADMIN'}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Event Management</h5>
                <span className="text-muted">{events.length} total events</span>
              </div>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Organizer</th>
                      <th>Date</th>
                      <th>Participants</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(event => {
                      const now = new Date();
                      const eventDate = new Date(event.eventDate);
                      const status = eventDate > now ? 'Upcoming' : 'Completed';
                      const statusClass = eventDate > now ? 'bg-success' : 'bg-secondary';
                      
                      return (
                        <tr key={event.id}>
                          <td>
                            <div>
                              <h6 className="mb-1">{event.title}</h6>
                              <small className="text-muted">{event.category}</small>
                            </div>
                          </td>
                          <td>{event.organizerName}</td>
                          <td>
                            <small>{formatDate(event.eventDate)}</small>
                          </td>
                          <td>
                            <span className="badge bg-info">
                              {event.currentParticipants}/{event.maxParticipants || '∞'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${statusClass}`}>{status}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

