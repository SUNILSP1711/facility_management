package com.fms.controller;

import com.fms.dto.FacilityDTO;
import com.fms.entity.Facility;
import com.fms.service.FacilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin/facilities")
@RequiredArgsConstructor
public class FacilityController {
    
    private final FacilityService facilityService;
    
    @PostMapping
    public ResponseEntity<FacilityDTO> createFacility(@Valid @RequestBody FacilityDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(facilityService.createFacility(dto));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<FacilityDTO> updateFacility(@PathVariable String id, @Valid @RequestBody FacilityDTO dto) {
        return ResponseEntity.ok(facilityService.updateFacility(id, dto));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFacility(@PathVariable String id) {
        facilityService.deleteFacility(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping
    public ResponseEntity<List<FacilityDTO>> getAllFacilities() {
        return ResponseEntity.ok(facilityService.getAllFacilities());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<FacilityDTO> getFacilityById(@PathVariable String id) {
        return facilityService.getFacilityById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
