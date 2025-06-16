package com.eventmanagement.repository;

import com.eventmanagement.model.Event;
import com.eventmanagement.model.EventStatus;
import com.eventmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByOrganizer(User organizer);
    List<Event> findByStatus(EventStatus status);
    List<Event> findByCategory(String category);
    
    @Query("SELECT e FROM Event e WHERE e.eventDate >= :startDate AND e.eventDate <= :endDate")
    List<Event> findByEventDateBetween(@Param("startDate") LocalDateTime startDate, 
                                       @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT e FROM Event e WHERE e.title LIKE %:keyword% OR e.description LIKE %:keyword%")
    List<Event> findByTitleContainingOrDescriptionContaining(@Param("keyword") String keyword);
    
    @Query("SELECT e FROM Event e WHERE e.category = :category AND e.eventDate >= :currentDate")
    List<Event> findUpcomingEventsByCategory(@Param("category") String category, 
                                             @Param("currentDate") LocalDateTime currentDate);
    
    @Query("SELECT e FROM Event e WHERE e.eventDate >= :currentDate ORDER BY e.eventDate ASC")
    List<Event> findUpcomingEvents(@Param("currentDate") LocalDateTime currentDate);
    
    @Query("SELECT e FROM Event e WHERE e.eventDate < :currentDate ORDER BY e.eventDate DESC")
    List<Event> findPastEvents(@Param("currentDate") LocalDateTime currentDate);
    
    @Query("SELECT e FROM Event e JOIN e.registeredUsers u WHERE u.id = :userId")
    List<Event> findEventsByRegisteredUser(@Param("userId") Long userId);
    
    // New method for finding events by share code
    Event findByShareCode(String shareCode);
}

