package com.fms.controller;

import com.fms.dto.FacilityDTO;
import com.fms.entity.Facility;
import com.fms.service.BookingService;
import com.fms.service.FacilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
public class PublicController {
    
    private final FacilityService facilityService;
    private final BookingService bookingService;
    
    @GetMapping("/facilities")
    public ResponseEntity<List<FacilityDTO>> getAllFacilities() {
        return ResponseEntity.ok(facilityService.getAllFacilities());
    }
    
    @GetMapping("/facilities/available")
    public ResponseEntity<List<FacilityDTO>> getAvailableFacilities() {
        return ResponseEntity.ok(facilityService.getAvailableFacilities());
    }
    
    @GetMapping("/facilities/type/{type}")
    public ResponseEntity<List<FacilityDTO>> getFacilitiesByType(@PathVariable Facility.FacilityType type) {
        return ResponseEntity.ok(facilityService.getFacilitiesByType(type));
    }
    
    @PostMapping("/check-availability")
    public ResponseEntity<Map<String, Object>> checkAvailability(
            @RequestParam String facilityId,
            @RequestParam LocalDate date,
            @RequestParam LocalTime startTime,
            @RequestParam LocalTime endTime) {
        
        boolean hasConflict = bookingService.hasConflict(facilityId, date, startTime, endTime);
        return ResponseEntity.ok(Map.of(
                "available", !hasConflict,
                "message", hasConflict ? "Facility already booked for the selected time slot" : "Facility is available"
        ));
    }
}
