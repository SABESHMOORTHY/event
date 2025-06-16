package com.eventmanagement.service;

import com.eventmanagement.dto.EventRequest;
import com.eventmanagement.dto.EventResponse;
import com.eventmanagement.model.Event;
import com.eventmanagement.model.EventStatus;
import com.eventmanagement.model.User;
import com.eventmanagement.repository.EventRepository;
import com.eventmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::convertToEventResponse)
                .collect(Collectors.toList());
    }

    public List<EventResponse> getUpcomingEvents() {
        return eventRepository.findUpcomingEvents(LocalDateTime.now()).stream()
                .map(this::convertToEventResponse)
                .collect(Collectors.toList());
    }

    public List<EventResponse> getPastEvents() {
        return eventRepository.findPastEvents(LocalDateTime.now()).stream()
                .map(this::convertToEventResponse)
                .collect(Collectors.toList());
    }

    public List<EventResponse> getEventsByCategory(String category) {
        return eventRepository.findUpcomingEventsByCategory(category, LocalDateTime.now()).stream()
                .map(this::convertToEventResponse)
                .collect(Collectors.toList());
    }

    public List<EventResponse> searchEvents(String keyword) {
        return eventRepository.findByTitleContainingOrDescriptionContaining(keyword).stream()
                .map(this::convertToEventResponse)
                .collect(Collectors.toList());
    }

    public List<EventResponse> getUserRegisteredEvents(Long userId) {
        return eventRepository.findEventsByRegisteredUser(userId).stream()
                .map(event -> convertToEventResponse(event, userId))
                .collect(Collectors.toList());
    }

    public List<EventResponse> getUserOrganizedEvents(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return eventRepository.findByOrganizer(user.get()).stream()
                    .map(this::convertToEventResponse)
                    .collect(Collectors.toList());
        }
        return List.of();
    }

    public Optional<EventResponse> getEventById(Long id) {
        return eventRepository.findById(id)
                .map(this::convertToEventResponse);
    }

    public Optional<EventResponse> getEventById(Long id, Long userId) {
        return eventRepository.findById(id)
                .map(event -> convertToEventResponse(event, userId));
    }

    public EventResponse createEvent(EventRequest eventRequest, Long organizerId) {
        Optional<User> organizer = userRepository.findById(organizerId);
        if (organizer.isEmpty()) {
            throw new RuntimeException("Organizer not found");
        }

        Event event = new Event(
                eventRequest.getTitle(),
                eventRequest.getDescription(),
                eventRequest.getCategory(),
                eventRequest.getLocation(),
                eventRequest.getEventDate(),
                eventRequest.getRegistrationDeadline(),
                eventRequest.getMaxParticipants(),
                organizer.get()
        );

        // Generate unique share code
        event.setShareCode(generateUniqueShareCode());

        Event savedEvent = eventRepository.save(event);
        return convertToEventResponse(savedEvent);
    }

    public Optional<EventResponse> updateEvent(Long id, EventRequest eventRequest, Long userId) {
        Optional<Event> eventOpt = eventRepository.findById(id);
        if (eventOpt.isEmpty()) {
            return Optional.empty();
        }

        Event event = eventOpt.get();
        
        // Check if user is the organizer
        if (!event.getOrganizer().getId().equals(userId)) {
            throw new RuntimeException("Only the organizer can update this event");
        }

        event.setTitle(eventRequest.getTitle());
        event.setDescription(eventRequest.getDescription());
        event.setCategory(eventRequest.getCategory());
        event.setLocation(eventRequest.getLocation());
        event.setEventDate(eventRequest.getEventDate());
        event.setRegistrationDeadline(eventRequest.getRegistrationDeadline());
        event.setMaxParticipants(eventRequest.getMaxParticipants());

        Event updatedEvent = eventRepository.save(event);
        return Optional.of(convertToEventResponse(updatedEvent));
    }

    public boolean deleteEvent(Long id, Long userId) {
        Optional<Event> eventOpt = eventRepository.findById(id);
        if (eventOpt.isEmpty()) {
            return false;
        }

        Event event = eventOpt.get();
        
        // Check if user is the organizer
        if (!event.getOrganizer().getId().equals(userId)) {
            throw new RuntimeException("Only the organizer can delete this event");
        }

        eventRepository.delete(event);
        return true;
    }

    public boolean registerForEvent(Long eventId, Long userId) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        Optional<User> userOpt = userRepository.findById(userId);

        if (eventOpt.isEmpty() || userOpt.isEmpty()) {
            return false;
        }

        Event event = eventOpt.get();
        User user = userOpt.get();

        // Check if registration deadline has passed
        if (LocalDateTime.now().isAfter(event.getRegistrationDeadline())) {
            throw new RuntimeException("Registration deadline has passed");
        }

        // Check if event is full
        if (event.getMaxParticipants() != null && 
            event.getCurrentParticipants() >= event.getMaxParticipants()) {
            throw new RuntimeException("Event is full");
        }

        // Check if user is already registered
        if (event.getRegisteredUsers().contains(user)) {
            throw new RuntimeException("User is already registered for this event");
        }

        event.getRegisteredUsers().add(user);
        event.setCurrentParticipants(event.getCurrentParticipants() + 1);
        eventRepository.save(event);

        return true;
    }

    public boolean unregisterFromEvent(Long eventId, Long userId) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        Optional<User> userOpt = userRepository.findById(userId);

        if (eventOpt.isEmpty() || userOpt.isEmpty()) {
            return false;
        }

        Event event = eventOpt.get();
        User user = userOpt.get();

        if (event.getRegisteredUsers().remove(user)) {
            event.setCurrentParticipants(event.getCurrentParticipants() - 1);
            eventRepository.save(event);
            return true;
        }

        return false;
    }

    // New methods for share functionality
    public Optional<EventResponse> getEventByShareCode(String shareCode) {
        Event event = eventRepository.findByShareCode(shareCode);
        if (event != null) {
            return Optional.of(convertToEventResponse(event));
        }
        return Optional.empty();
    }

    public Optional<EventResponse> getEventByShareCode(String shareCode, Long userId) {
        Event event = eventRepository.findByShareCode(shareCode);
        if (event != null) {
            return Optional.of(convertToEventResponse(event, userId));
        }
        return Optional.empty();
    }

    public boolean registerForEventByShareCode(String shareCode, Long userId) {
        Event event = eventRepository.findByShareCode(shareCode);
        if (event != null) {
            return registerForEvent(event.getId(), userId);
        }
        return false;
    }

    private String generateUniqueShareCode() {
        String shareCode;
        do {
            shareCode = UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        } while (eventRepository.findByShareCode(shareCode) != null);
        return shareCode;
    }

    private EventResponse convertToEventResponse(Event event) {
        return convertToEventResponse(event, null);
    }

    private EventResponse convertToEventResponse(Event event, Long userId) {
        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setTitle(event.getTitle());
        response.setDescription(event.getDescription());
        response.setCategory(event.getCategory());
        response.setLocation(event.getLocation());
        response.setEventDate(event.getEventDate());
        response.setRegistrationDeadline(event.getRegistrationDeadline());
        response.setMaxParticipants(event.getMaxParticipants());
        response.setCurrentParticipants(event.getCurrentParticipants());
        response.setStatus(event.getStatus());
        response.setOrganizerName(event.getOrganizer().getFirstName() + " " + event.getOrganizer().getLastName());
        response.setOrganizerId(event.getOrganizer().getId());
        response.setCreatedAt(event.getCreatedAt());
        response.setUpdatedAt(event.getUpdatedAt());
        response.setShareCode(event.getShareCode());

        if (userId != null) {
            response.setRegistered(event.getRegisteredUsers().stream()
                    .anyMatch(user -> user.getId().equals(userId)));
        }

        return response;
    }
}

