package com.fms.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalTime;

@Document(collection = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {
    @Id
    private String id;
    private String facilityId;
    private String bookedBy;
    private String purpose;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private Status status;

    public enum Status {
        PENDING, APPROVED, REJECTED, CANCELLED
    }
}
