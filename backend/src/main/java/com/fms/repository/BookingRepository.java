package com.fms.repository;

import com.fms.entity.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByFacilityId(String facilityId);
    List<Booking> findByBookedBy(String bookedBy);
    List<Booking> findByFacilityIdAndDate(String facilityId, LocalDate date);
    List<Booking> findByFacilityIdAndDateAndStatus(String facilityId, LocalDate date, Booking.Status status);
    
    @Query("{ 'facilityId': ?0, 'date': ?1, 'status': { $in: ['PENDING', 'APPROVED'] }, " +
           "$or: [ " +
           "{ 'startTime': { $lt: ?3 }, 'endTime': { $gt: ?2 } } " +
           "] }")
    List<Booking> findConflictingBookings(String facilityId, LocalDate date, LocalTime startTime, LocalTime endTime);

    @Query("{ 'id': { $ne: ?0 }, 'facilityId': ?1, 'date': ?2, 'status': 'APPROVED', " +
           "$or: [ " +
           "{ 'startTime': { $lt: ?4 }, 'endTime': { $gt: ?3 } } " +
           "] }")
    List<Booking> findConflictingApprovedBookings(String bookingId, String facilityId, LocalDate date, LocalTime startTime, LocalTime endTime);
}
