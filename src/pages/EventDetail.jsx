import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import eventService from '../services/eventService';
import ShareEventModal from '../components/ShareEventModal';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      let eventData;
      if (isAuthenticated()) {
        eventData = await eventService.getEventByIdForUser(id);
      } else {
        eventData = await eventService.getEventById(id);
      }
      setEvent(eventData);
    } catch (error) {
      console.error('Error fetching event:', error);
      setMessage('Event not found');
      setMessageType('danger');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
      return;
    }

    setRegistering(true);
    try {
      await eventService.registerForEvent(id);
      setMessage('Successfully registered for the event!');
      setMessageType('success');
      fetchEvent(); // Refresh event data
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to register for event');
      setMessageType('danger');
    } finally {
      setRegistering(false);
    }
  };

  const handleUnregister = async () => {
    setRegistering(true);
    try {
      await eventService.unregisterFromEvent(id);
      setMessage('Successfully unregistered from the event');
      setMessageType('info');
      fetchEvent(); // Refresh event data
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to unregister from event');
      setMessageType('danger');
    } finally {
      setRegistering(false);
    }
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

  const isRegistrationOpen = () => {
    if (!event) return false;
    const now = new Date();
    const registrationDeadline = new Date(event.registrationDeadline);
    const eventDate = new Date(event.eventDate);
    
    return now < registrationDeadline && now < eventDate;
  };

  const isEventFull = () => {
    return event?.maxParticipants && event.currentParticipants >= event.maxParticipants;
  };

  const canUserEdit = () => {
    return isAuthenticated() && user && event && user.id === event.organizerId;
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <span className="ms-2">Loading event...</span>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Event Not Found</h2>
          <p className="text-muted">The event you're looking for doesn't exist.</p>
          <Link to="/events" className="btn btn-primary">Back to Events</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <span className="badge bg-primary event-category">{event.category}</span>
                {canUserEdit() && (
                  <div>
                    <Link to={`/edit-event/${event.id}`} className="btn btn-sm btn-outline-primary me-2">
                      Edit Event
                    </Link>
                  </div>
                )}
              </div>
              
              <h1 className="card-title mb-3">{event.title}</h1>
              
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">
                      <i className="fas fa-calendar me-2"></i>Date & Time
                    </h6>
                    <p className="mb-0">{formatDate(event.eventDate)}</p>
                  </div>
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">
                      <i className="fas fa-map-marker-alt me-2"></i>Location
                    </h6>
                    <p className="mb-0">{event.location}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">
                      <i className="fas fa-user me-2"></i>Organizer
                    </h6>
                    <p className="mb-0">{event.organizerName}</p>
                  </div>
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">
                      <i className="fas fa-users me-2"></i>Participants
                    </h6>
                    <p className="mb-0">
                      {event.currentParticipants} / {event.maxParticipants || '∞'} registered
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h5>About This Event</h5>
                <p className="text-muted">{event.description}</p>
              </div>

              <div className="mb-4">
                <h6 className="text-muted">Registration Deadline</h6>
                <p>{formatDate(event.registrationDeadline)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Registration</h5>
              
              {message && (
                <div className={`alert alert-${messageType}`} role="alert">
                  {message}
                </div>
              )}

              {isAuthenticated() ? (
                <div>
                  {event.isRegistered ? (
                    <div>
                      <div className="alert alert-success">
                        <i className="fas fa-check-circle me-2"></i>
                        You are registered for this event
                      </div>
                      <button 
                        className="btn btn-outline-danger w-100"
                        onClick={handleUnregister}
                        disabled={registering}
                      >
                        {registering ? (
                          <>
                            <span className="loading-spinner me-2"></span>
                            Unregistering...
                          </>
                        ) : (
                          'Unregister'
                        )}
                      </button>
                    </div>
                  ) : (
                    <div>
                      {!isRegistrationOpen() ? (
                        <div className="alert alert-warning">
                          <i className="fas fa-exclamation-triangle me-2"></i>
                          Registration is closed
                        </div>
                      ) : isEventFull() ? (
                        <div className="alert alert-danger">
                          <i className="fas fa-users me-2"></i>
                          Event is full
                        </div>
                      ) : (
                        <button 
                          className="btn btn-primary w-100"
                          onClick={handleRegister}
                          disabled={registering}
                        >
                          {registering ? (
                            <>
                              <span className="loading-spinner me-2"></span>
                              Registering...
                            </>
                          ) : (
                            'Register for Event'
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-muted mb-3">
                    You need to be logged in to register for this event.
                  </p>
                  <Link 
                    to="/login" 
                    state={{ from: { pathname: `/events/${id}` } }}
                    className="btn btn-primary w-100"
                  >
                    Login to Register
                  </Link>
                </div>
              )}

              <hr />

              <div className="text-center">
                <h6 className="text-muted mb-3">Share this event</h6>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowShareModal(true)}
                >
                  <i className="fas fa-share-alt me-2"></i>
                  Share Event
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <Link to="/events" className="btn btn-outline-secondary">
              <i className="fas fa-arrow-left me-2"></i>
              Back to Events
            </Link>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareEventModal 
        event={event}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
};

export default EventDetail;

