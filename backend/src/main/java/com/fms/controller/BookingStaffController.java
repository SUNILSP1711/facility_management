package com.fms.controller;

import com.fms.dto.BookingDTO;
import com.fms.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/staff/bookings")
@RequiredArgsConstructor
public class BookingStaffController {
    
    private final BookingService bookingService;
    
    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(@Valid @RequestBody BookingDTO dto, Authentication auth) {
        dto.setBookedBy(auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(dto));
    }
    
    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingDTO>> getMyBookings(Authentication auth) {
        return ResponseEntity.ok(bookingService.getBookingsByUser(auth.getName()));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable String id) {
        return bookingService.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelBooking(@PathVariable String id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }
}
