import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import eventService from '../services/eventService';

const Dashboard = () => {
  const { user } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [organizedEvents, setOrganizedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('registered');

  useEffect(() => {
    fetchUserEvents();
  }, []);

  const fetchUserEvents = async () => {
    try {
      const [registered, organized] = await Promise.all([
        eventService.getUserRegisteredEvents(),
        eventService.getUserOrganizedEvents()
      ]);
      setRegisteredEvents(registered);
      setOrganizedEvents(organized);
    } catch (error) {
      console.error('Error fetching user events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventStatus = (event) => {
    const now = new Date();
    const eventDate = new Date(event.eventDate);
    
    if (eventDate < now) {
      return { text: 'Completed', class: 'bg-secondary' };
    } else if (eventDate.toDateString() === now.toDateString()) {
      return { text: 'Today', class: 'bg-warning' };
    } else {
      return { text: 'Upcoming', class: 'bg-success' };
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <span className="ms-2">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-4 fw-bold mb-2">Dashboard</h1>
          <p className="lead text-muted">Welcome back, {user?.firstName}!</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card dashboard-card">
            <div className="card-body text-center">
              <div className="text-primary mb-2">
                <i className="fas fa-calendar-check fa-2x"></i>
              </div>
              <h3 className="fw-bold">{registeredEvents.length}</h3>
              <p className="text-muted mb-0">Registered Events</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card dashboard-card">
            <div className="card-body text-center">
              <div className="text-success mb-2">
                <i className="fas fa-calendar-plus fa-2x"></i>
              </div>
              <h3 className="fw-bold">{organizedEvents.length}</h3>
              <p className="text-muted mb-0">Organized Events</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card dashboard-card">
            <div className="card-body text-center">
              <div className="text-info mb-2">
                <i className="fas fa-users fa-2x"></i>
              </div>
              <h3 className="fw-bold">
                {organizedEvents.reduce((total, event) => total + event.currentParticipants, 0)}
              </h3>
              <p className="text-muted mb-0">Total Participants</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-3">Quick Actions</h5>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/create-event" className="btn btn-primary">
                  <i className="fas fa-plus me-2"></i>Create New Event
                </Link>
                <Link to="/events" className="btn btn-outline-primary">
                  <i className="fas fa-search me-2"></i>Browse Events
                </Link>
                <button className="btn btn-outline-secondary" onClick={fetchUserEvents}>
                  <i className="fas fa-sync me-2"></i>Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Tabs */}
      <div className="card">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'registered' ? 'active' : ''}`}
                onClick={() => setActiveTab('registered')}
              >
                My Registered Events ({registeredEvents.length})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'organized' ? 'active' : ''}`}
                onClick={() => setActiveTab('organized')}
              >
                My Organized Events ({organizedEvents.length})
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {activeTab === 'registered' && (
            <div>
              {registeredEvents.length > 0 ? (
                <div className="row g-3">
                  {registeredEvents.map(event => {
                    const status = getEventStatus(event);
                    return (
                      <div key={event.id} className="col-md-6 col-lg-4">
                        <div className="card event-card h-100">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <span className="badge bg-primary event-category">{event.category}</span>
                              <span className={`badge ${status.class}`}>{status.text}</span>
                            </div>
                            <h6 className="card-title">{event.title}</h6>
                            <p className="card-text text-muted small">
                              {event.description.substring(0, 80)}...
                            </p>
                            <div className="mb-2">
                              <small className="event-date">
                                <i className="fas fa-calendar me-1"></i>
                                {formatDate(event.eventDate)}
                              </small>
                            </div>
                            <div className="mb-2">
                              <small className="event-location">
                                <i className="fas fa-map-marker-alt me-1"></i>
                                {event.location}
                              </small>
                            </div>
                            <Link to={`/events/${event.id}`} className="btn btn-sm btn-outline-primary">
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                  <h5>No Registered Events</h5>
                  <p className="text-muted">You haven't registered for any events yet.</p>
                  <Link to="/events" className="btn btn-primary">Browse Events</Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'organized' && (
            <div>
              {organizedEvents.length > 0 ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Event</th>
                        <th>Date</th>
                        <th>Participants</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {organizedEvents.map(event => {
                        const status = getEventStatus(event);
                        return (
                          <tr key={event.id}>
                            <td>
                              <div>
                                <h6 className="mb-1">{event.title}</h6>
                                <small className="text-muted">{event.category}</small>
                              </div>
                            </td>
                            <td>
                              <small>{formatDate(event.eventDate)}</small>
                            </td>
                            <td>
                              <span className="badge bg-info">
                                {event.currentParticipants}/{event.maxParticipants || '∞'}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${status.class}`}>{status.text}</span>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <Link 
                                  to={`/events/${event.id}`} 
                                  className="btn btn-outline-primary"
                                >
                                  View
                                </Link>
                                <Link 
                                  to={`/edit-event/${event.id}`} 
                                  className="btn btn-outline-secondary"
                                >
                                  Edit
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-calendar-plus fa-3x text-muted mb-3"></i>
                  <h5>No Organized Events</h5>
                  <p className="text-muted">You haven't created any events yet.</p>
                  <Link to="/create-event" className="btn btn-primary">Create Your First Event</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

