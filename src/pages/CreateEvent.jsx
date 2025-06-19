import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import eventService from '../services/eventService';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    eventDate: '',
    registrationDeadline: '',
    maxParticipants: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Technology', 'Business', 'Arts', 'Sports', 'Education', 'Health', 'Music', 'Food'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate dates
    const eventDate = new Date(formData.eventDate);
    const registrationDeadline = new Date(formData.registrationDeadline);
    const now = new Date();

    if (eventDate <= now) {
      setError('Event date must be in the future');
      setLoading(false);
      return;
    }

    if (registrationDeadline >= eventDate) {
      setError('Registration deadline must be before the event date');
      setLoading(false);
      return;
    }

    if (registrationDeadline <= now) {
      setError('Registration deadline must be in the future');
      setLoading(false);
      return;
    }

    try {
      const eventData = {
        ...formData,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null
      };

      const createdEvent = await eventService.createEvent(eventData);
      navigate(`/events/${createdEvent.id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // At least 30 minutes from now
    return now.toISOString().slice(0, 16);
  };

  const getMaxRegistrationDateTime = () => {
    if (formData.eventDate) {
      const eventDate = new Date(formData.eventDate);
      eventDate.setHours(eventDate.getHours() - 1); // At least 1 hour before event
      return eventDate.toISOString().slice(0, 16);
    }
    return '';
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="form-container">
            <div className="text-center mb-4">
              <h1 className="display-5 fw-bold">Create New Event</h1>
              <p className="lead text-muted">Share your event with the community</p>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-8 mb-3">
                  <label htmlFor="title" className="form-label">Event Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    maxLength="100"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="category" className="form-label">Category *</label>
                  <select
                    className="form-select"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description *</label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  maxLength="1000"
                  placeholder="Describe your event, what attendees can expect, and any special requirements..."
                />
                <div className="form-text">
                  {formData.description.length}/1000 characters
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="location" className="form-label">Location *</label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  maxLength="200"
                  placeholder="e.g., Conference Room A, 123 Main St, Online"
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="eventDate" className="form-label">Event Date & Time *</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    id="eventDate"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    min={getMinDateTime()}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="registrationDeadline" className="form-label">Registration Deadline *</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    id="registrationDeadline"
                    name="registrationDeadline"
                    value={formData.registrationDeadline}
                    onChange={handleChange}
                    min={getMinDateTime()}
                    max={getMaxRegistrationDateTime()}
                    required
                  />
                  <div className="form-text">
                    Must be before the event date
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="maxParticipants" className="form-label">Maximum Participants</label>
                <input
                  type="number"
                  className="form-control"
                  id="maxParticipants"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  min="1"
                  max="10000"
                  placeholder="Leave empty for unlimited"
                />
                <div className="form-text">
                  Leave empty if you don't want to limit the number of participants
                </div>
              </div>

              <div className="d-flex justify-content-between">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner me-2"></span>
                      Creating Event...
                    </>
                  ) : (
                    'Create Event'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;

