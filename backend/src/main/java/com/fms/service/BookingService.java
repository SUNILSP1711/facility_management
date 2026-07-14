package com.fms.service;

import com.fms.dto.BookingDTO;
import com.fms.entity.Booking;
import com.fms.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {
    
    private final BookingRepository bookingRepository;
    
    public BookingDTO createBooking(BookingDTO dto) {
        if (hasConflict(dto.getFacilityId(), dto.getDate(), dto.getStartTime(), dto.getEndTime())) {
            throw new RuntimeException("Facility already booked for the selected time slot");
        }
        
        Booking booking = Booking.builder()
                .facilityId(dto.getFacilityId())
                .bookedBy(dto.getBookedBy())
                .purpose(dto.getPurpose())
                .date(dto.getDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .status(Booking.Status.PENDING)
                .build();
        
        Booking saved = bookingRepository.save(booking);
        return toDTO(saved);
    }
    
    public BookingDTO updateBookingStatus(String id, Booking.Status status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (status == Booking.Status.APPROVED) {
            List<Booking> approvedConflicts = bookingRepository.findConflictingApprovedBookings(
                    booking.getId(), booking.getFacilityId(), booking.getDate(), booking.getStartTime(), booking.getEndTime()
            );
            if (!approvedConflicts.isEmpty()) {
                throw new RuntimeException("Already booked");
            }
        }

        booking.setStatus(status);
        Booking updated = bookingRepository.save(booking);
        return toDTO(updated);
    }
    
    public void cancelBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getStatus() == Booking.Status.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }
        
        booking.setStatus(Booking.Status.CANCELLED);
        bookingRepository.save(booking);
    }
    
    public Optional<BookingDTO> getBookingById(String id) {
        return bookingRepository.findById(id).map(this::toDTO);
    }
    
    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<BookingDTO> getBookingsByFacility(String facilityId) {
        return bookingRepository.findByFacilityId(facilityId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<BookingDTO> getBookingsByUser(String userId) {
        return bookingRepository.findByBookedBy(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public boolean hasConflict(String facilityId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        List<Booking> conflicts = bookingRepository.findConflictingBookings(facilityId, date, startTime, endTime);
        return !conflicts.isEmpty();
    }
    
    private BookingDTO toDTO(Booking booking) {
        return BookingDTO.builder()
                .id(booking.getId())
                .facilityId(booking.getFacilityId())
                .bookedBy(booking.getBookedBy())
                .purpose(booking.getPurpose())
                .date(booking.getDate())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .status(booking.getStatus())
                .build();
    }
}
