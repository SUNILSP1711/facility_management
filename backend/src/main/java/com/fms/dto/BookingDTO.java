package com.fms.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fms.entity.Booking;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingDTO {
    private String id;
    
    @NotBlank(message = "Facility ID is required")
    private String facilityId;
    
    private String bookedBy;
    
    @NotBlank(message = "Purpose is required")
    private String purpose;
    
    @NotNull(message = "Date is required")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate date;
    
    @NotNull(message = "Start time is required")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;
    
    @NotNull(message = "End time is required")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime endTime;
    
    private Booking.Status status;
}
