import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import eventService from '../services/eventService';
import ShareEventModal from '../components/ShareEventModal';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [eventType, setEventType] = useState('upcoming'); // upcoming, past, all
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const categories = ['Technology', 'Business', 'Arts', 'Sports', 'Education', 'Health', 'Music', 'Food'];

  useEffect(() => {
    fetchEvents();
  }, [eventType]);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, selectedCategory]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let eventsData;
      switch (eventType) {
        case 'upcoming':
          eventsData = await eventService.getUpcomingEvents();
          break;
        case 'past':
          eventsData = await eventService.getPastEvents();
          break;
        default:
          eventsData = await eventService.getAllEvents();
      }
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    setFilteredEvents(filtered);
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      setLoading(true);
      try {
        const searchResults = await eventService.searchEvents(searchTerm);
        setEvents(searchResults);
      } catch (error) {
        console.error('Error searching events:', error);
      } finally {
        setLoading(false);
      }
    } else {
      fetchEvents();
    }
  };

  const handleQuickShare = (event) => {
    setSelectedEvent(event);
    setShowShareModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (event) => {
    const now = new Date();
    const eventDate = new Date(event.eventDate);
    const registrationDeadline = new Date(event.registrationDeadline);

    if (eventDate < now) {
      return <span className="badge bg-secondary">Completed</span>;
    } else if (registrationDeadline < now) {
      return <span className="badge bg-warning">Registration Closed</span>;
    } else if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
      return <span className="badge bg-danger">Full</span>;
    } else {
      return <span className="badge bg-success">Open</span>;
    }
  };

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-4 fw-bold mb-3">Events</h1>
          <p className="lead text-muted">Discover amazing events happening around you</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="search-container">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="btn btn-primary" onClick={handleSearch}>
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            >
              <option value="upcoming">Upcoming Events</option>
              <option value="past">Past Events</option>
              <option value="all">All Events</option>
            </select>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="mt-3">
          <div className="d-flex flex-wrap">
            <span 
              className={`filter-chip ${selectedCategory === '' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('')}
            >
              All
            </span>
            {categories.map(category => (
              <span
                key={category}
                className={`filter-chip ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="loading-spinner"></div>
          <span className="ms-2">Loading events...</span>
        </div>
      ) : (
        <div className="row g-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <div key={event.id} className="col-md-6 col-lg-4">
                <div className="card event-card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge bg-primary event-category">{event.category}</span>
                      {getStatusBadge(event)}
                    </div>
                    <h5 className="card-title">{event.title}</h5>
                    <p className="card-text text-muted">
                      {event.description.length > 100 
                        ? `${event.description.substring(0, 100)}...` 
                        : event.description
                      }
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
                    <div className="mb-3">
                      <small className="text-muted">
                        <i className="fas fa-user me-1"></i>
                        Organized by {event.organizerName}
                      </small>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        {event.currentParticipants}/{event.maxParticipants || '∞'} participants
                      </small>
                      <div>
                        <Link to={`/events/${event.id}`} className="btn btn-outline-primary btn-sm me-2">
                          View Details
                        </Link>
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleQuickShare(event)}
                          title="Share Event"
                        >
                          <i className="fas fa-share-alt"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
              <h4>No Events Found</h4>
              <p className="text-muted">
                {searchTerm || selectedCategory 
                  ? 'Try adjusting your search criteria or filters.'
                  : 'No events are currently available.'
                }
              </p>
              <Link to="/create-event" className="btn btn-primary">
                Create an Event
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Share Modal */}
      <ShareEventModal 
        event={selectedEvent}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
};

export default Events;

