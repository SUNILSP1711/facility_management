package com.fms.controller;

import com.fms.dto.BookingDTO;
import com.fms.entity.Booking;
import com.fms.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin/bookings")
@RequiredArgsConstructor
public class BookingAdminController {
    
    private final BookingService bookingService;
    
    @GetMapping
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable String id) {
        return bookingService.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}/approve")
    public ResponseEntity<BookingDTO> approveBooking(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, Booking.Status.APPROVED));
    }
    
    @PutMapping("/{id}/reject")
    public ResponseEntity<BookingDTO> rejectBooking(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, Booking.Status.REJECTED));
    }
}
