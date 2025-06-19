import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import eventService from '../services/eventService';

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const events = await eventService.getUpcomingEvents();
        setUpcomingEvents(events.slice(0, 6)); // Show only first 6 events
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Discover Amazing Events
              </h1>
              <p className="lead mb-4">
                Join thousands of people discovering and attending incredible events. 
                From workshops to conferences, find your next great experience.
              </p>
              <div className="d-flex gap-3">
                <Link to="/events" className="btn btn-light btn-lg">
                  Browse Events
                </Link>
                <Link to="/signup" className="btn btn-outline-light btn-lg">
                  Get Started
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <i className="fas fa-calendar-alt" style={{ fontSize: '10rem', opacity: 0.3 }}></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="display-5 fw-bold mb-3">Why Choose EventHub?</h2>
              <p className="lead text-muted">Everything you need to discover and manage events</p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="text-center">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '80px', height: '80px' }}>
                  <i className="fas fa-search fa-2x"></i>
                </div>
                <h4>Easy Discovery</h4>
                <p className="text-muted">Find events that match your interests with our powerful search and filtering tools.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '80px', height: '80px' }}>
                  <i className="fas fa-users fa-2x"></i>
                </div>
                <h4>Community Driven</h4>
                <p className="text-muted">Connect with like-minded people and build lasting relationships through shared experiences.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '80px', height: '80px' }}>
                  <i className="fas fa-calendar-plus fa-2x"></i>
                </div>
                <h4>Create Events</h4>
                <p className="text-muted">Organize your own events and reach a wider audience with our easy-to-use platform.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12 text-center">
              <h2 className="display-5 fw-bold mb-3">Upcoming Events</h2>
              <p className="lead text-muted">Don't miss out on these amazing upcoming events</p>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center">
              <div className="loading-spinner"></div>
              <span className="ms-2">Loading events...</span>
            </div>
          ) : (
            <div className="row g-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map(event => (
                  <div key={event.id} className="col-md-6 col-lg-4">
                    <div className="card event-card h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <span className="badge bg-primary event-category">{event.category}</span>
                          <small className="text-muted">{event.currentParticipants}/{event.maxParticipants || '∞'}</small>
                        </div>
                        <h5 className="card-title">{event.title}</h5>
                        <p className="card-text text-muted">{event.description.substring(0, 100)}...</p>
                        <div className="mb-2">
                          <small className="event-date">
                            <i className="fas fa-calendar me-1"></i>
                            {formatDate(event.eventDate)}
                          </small>
                        </div>
                        <div className="mb-3">
                          <small className="event-location">
                            <i className="fas fa-map-marker-alt me-1"></i>
                            {event.location}
                          </small>
                        </div>
                        <Link to={`/events/${event.id}`} className="btn btn-outline-primary">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center">
                  <p className="text-muted">No upcoming events found.</p>
                  <Link to="/create-event" className="btn btn-primary">Create the First Event</Link>
                </div>
              )}
            </div>
          )}
          
          {upcomingEvents.length > 0 && (
            <div className="text-center mt-4">
              <Link to="/events" className="btn btn-primary btn-lg">
                View All Events
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-3">Ready to Get Started?</h2>
          <p className="lead mb-4">Join our community and start discovering amazing events today!</p>
          <Link to="/signup" className="btn btn-light btn-lg">
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

