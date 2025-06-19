import React, { useState } from 'react';

const ShareEventModal = ({ event, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !event) return null;

  const shareUrl = `${window.location.origin}/event/share/${event.shareCode}`;
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleWhatsAppShare = () => {
    console.log('WhatsApp share button clicked!');
    console.log('Event data:', event);
    console.log('Share URL:', shareUrl);

    if (!event.shareCode) {
      console.error('Event shareCode is missing!');
      alert('Error: Event sharing code is not available. Please try refreshing the page.');
      return;
    }

    try {
      const message = `🎉 Check out this event: *${event.title}*\n\n📅 Date: ${new Date(event.eventDate).toLocaleDateString()}\n📍 Location: ${event.location}\n\n${shareUrl}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      console.log('Generated WhatsApp URL:', whatsappUrl);
      
      // Try to open WhatsApp
      const newWindow = window.open(whatsappUrl, '_blank');
      
      if (!newWindow) {
        console.error('Pop-up blocked or failed to open');
        alert('Pop-up blocked! Please allow pop-ups for this site or copy the link manually.');
      } else {
        console.log('WhatsApp window opened successfully');
      }
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      alert('Error opening WhatsApp. Please try copying the link instead.');
    }
  };

  const handleEmailShare = () => {
    const subject = `Invitation: ${event.title}`;
    const body = `Hi!\n\nI'd like to invite you to this event:\n\n${event.title}\n\nDate: ${new Date(event.eventDate).toLocaleDateString()}\nLocation: ${event.location}\n\nDescription: ${event.description}\n\nRegister here: ${shareUrl}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  const handleTwitterShare = () => {
    const message = `🎉 Join me at ${event.title}! 📅 ${new Date(event.eventDate).toLocaleDateString()} 📍 ${event.location} ${shareUrl}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank');
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-share-alt me-2"></i>
              Share Event
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-4">
              <h6 className="fw-bold">{event.title}</h6>
              <p className="text-muted mb-0">
                <i className="fas fa-calendar me-2"></i>
                {new Date(event.eventDate).toLocaleDateString()}
              </p>
              <p className="text-muted">
                <i className="fas fa-map-marker-alt me-2"></i>
                {event.location}
              </p>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Share Link:</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={shareUrl}
                  readOnly
                />
                <button
                  className={`btn ${copied ? 'btn-success' : 'btn-outline-secondary'}`}
                  onClick={handleCopyLink}
                >
                  <i className={`fas ${copied ? 'fa-check' : 'fa-copy'} me-1`}></i>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-6">
                <button
                  className="btn btn-success w-100"
                  onClick={handleWhatsAppShare}
                  type="button"
                >
                  <i className="fab fa-whatsapp me-2"></i>
                  WhatsApp
                </button>
              </div>
              <div className="col-6">
                <button
                  className="btn btn-primary w-100"
                  onClick={handleEmailShare}
                  type="button"
                >
                  <i className="fas fa-envelope me-2"></i>
                  Email
                </button>
              </div>
              <div className="col-6">
                <button
                  className="btn btn-info w-100"
                  onClick={handleTwitterShare}
                  type="button"
                >
                  <i className="fab fa-twitter me-2"></i>
                  Twitter
                </button>
              </div>
              <div className="col-6">
                <button
                  className="btn btn-primary w-100"
                  onClick={handleFacebookShare}
                  type="button"
                  style={{ backgroundColor: '#1877f2' }}
                >
                  <i className="fab fa-facebook-f me-2"></i>
                  Facebook
                </button>
              </div>
            </div>

            {/* Debug information - remove this in production */}
            <div className="mt-3 p-2 bg-light rounded small">
              <strong>Debug Info:</strong><br/>
              Share Code: {event.shareCode || 'Missing'}<br/>
              Share URL: {shareUrl}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareEventModal;

