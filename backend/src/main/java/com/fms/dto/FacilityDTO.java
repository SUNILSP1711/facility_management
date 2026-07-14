package com.fms.dto;

import com.fms.entity.Facility;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacilityDTO {
    private String id;
    
    @NotBlank(message = "Facility name is required")
    private String name;
    
    @NotNull(message = "Facility type is required")
    private Facility.FacilityType type;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    @NotNull(message = "Capacity is required")
    @Positive(message = "Capacity must be positive")
    private Integer capacity;
    
    private Facility.Status status;
    
    private String imageUrl;
}
