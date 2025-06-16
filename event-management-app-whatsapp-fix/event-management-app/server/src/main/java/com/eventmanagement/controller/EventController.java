package com.eventmanagement.controller;

import com.eventmanagement.config.UserDetailsImpl;
import com.eventmanagement.dto.EventRequest;
import com.eventmanagement.dto.EventResponse;
import com.eventmanagement.dto.MessageResponse;
import com.eventmanagement.service.EventService;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    // Public endpoints (no authentication required)
    @GetMapping("/public/all")
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        List<EventResponse> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/public/upcoming")
    public ResponseEntity<List<EventResponse>> getUpcomingEvents() {
        List<EventResponse> events = eventService.getUpcomingEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/public/past")
    public ResponseEntity<List<EventResponse>> getPastEvents() {
        List<EventResponse> events = eventService.getPastEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/public/category/{category}")
    public ResponseEntity<List<EventResponse>> getEventsByCategory(@PathVariable String category) {
        List<EventResponse> events = eventService.getEventsByCategory(category);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/public/search")
    public ResponseEntity<List<EventResponse>> searchEvents(@RequestParam String keyword) {
        List<EventResponse> events = eventService.searchEvents(keyword);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable Long id) {
        Optional<EventResponse> event = eventService.getEventById(id);
        return event.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Protected endpoints (authentication required)
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EventResponse> getEventByIdForUser(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Optional<EventResponse> event = eventService.getEventById(id, userDetails.getId());
        return event.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody EventRequest eventRequest, 
                                                   Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        try {
            EventResponse createdEvent = eventService.createEvent(eventRequest, userDetails.getId());
            return ResponseEntity.ok(createdEvent);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EventResponse> updateEvent(@PathVariable Long id, 
                                                   @Valid @RequestBody EventRequest eventRequest,
                                                   Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        try {
            Optional<EventResponse> updatedEvent = eventService.updateEvent(id, eventRequest, userDetails.getId());
            return updatedEvent.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteEvent(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        try {
            boolean deleted = eventService.deleteEvent(id, userDetails.getId());
            if (deleted) {
                return ResponseEntity.ok(new MessageResponse("Event deleted successfully"));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/{id}/register")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> registerForEvent(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        try {
            boolean registered = eventService.registerForEvent(id, userDetails.getId());
            if (registered) {
                return ResponseEntity.ok(new MessageResponse("Successfully registered for event"));
            } else {
                return ResponseEntity.badRequest().body(new MessageResponse("Failed to register for event"));
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/{id}/unregister")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> unregisterFromEvent(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        boolean unregistered = eventService.unregisterFromEvent(id, userDetails.getId());
        if (unregistered) {
            return ResponseEntity.ok(new MessageResponse("Successfully unregistered from event"));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Failed to unregister from event"));
        }
    }

    @GetMapping("/my-events")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<EventResponse>> getUserRegisteredEvents(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<EventResponse> events = eventService.getUserRegisteredEvents(userDetails.getId());
        return ResponseEntity.ok(events);
    }

    @GetMapping("/my-organized")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<EventResponse>> getUserOrganizedEvents(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<EventResponse> events = eventService.getUserOrganizedEvents(userDetails.getId());
        return ResponseEntity.ok(events);
    }

    // New endpoints for share functionality
    @GetMapping("/public/share/{shareCode}")
    public ResponseEntity<EventResponse> getEventByShareCode(@PathVariable String shareCode) {
        Optional<EventResponse> event = eventService.getEventByShareCode(shareCode);
        return event.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/share/{shareCode}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<EventResponse> getEventByShareCodeForUser(@PathVariable String shareCode, 
                                                                   Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Optional<EventResponse> event = eventService.getEventByShareCode(shareCode, userDetails.getId());
        return event.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/share/{shareCode}/register")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> registerForEventByShareCode(@PathVariable String shareCode, 
                                                                      Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        try {
            boolean registered = eventService.registerForEventByShareCode(shareCode, userDetails.getId());
            if (registered) {
                return ResponseEntity.ok(new MessageResponse("Successfully registered for event"));
            } else {
                return ResponseEntity.badRequest().body(new MessageResponse("Failed to register for event"));
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}

