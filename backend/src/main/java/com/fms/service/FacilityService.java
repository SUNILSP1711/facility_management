package com.fms.service;

import com.fms.dto.FacilityDTO;
import com.fms.entity.Facility;
import com.fms.repository.FacilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FacilityService {
    
    private final FacilityRepository facilityRepository;
    
    public FacilityDTO createFacility(FacilityDTO dto) {
        Facility facility = Facility.builder()
                .name(dto.getName())
                .type(dto.getType())
                .location(dto.getLocation())
                .capacity(dto.getCapacity())
                .status(Facility.Status.AVAILABLE)
                .imageUrl(dto.getImageUrl())
                .build();
        
        Facility saved = facilityRepository.save(facility);
        return toDTO(saved);
    }
    
    public FacilityDTO updateFacility(String id, FacilityDTO dto) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facility not found"));
        
        facility.setName(dto.getName());
        facility.setType(dto.getType());
        facility.setLocation(dto.getLocation());
        facility.setCapacity(dto.getCapacity());
        if (dto.getStatus() != null) {
            facility.setStatus(dto.getStatus());
        }
        if (dto.getImageUrl() != null) {
            facility.setImageUrl(dto.getImageUrl());
        }
        
        Facility updated = facilityRepository.save(facility);
        return toDTO(updated);
    }
    
    public void deleteFacility(String id) {
        facilityRepository.deleteById(id);
    }
    
    public Optional<FacilityDTO> getFacilityById(String id) {
        return facilityRepository.findById(id).map(this::toDTO);
    }
    
    public List<FacilityDTO> getAllFacilities() {
        return facilityRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<FacilityDTO> getFacilitiesByType(Facility.FacilityType type) {
        return facilityRepository.findByType(type).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<FacilityDTO> getAvailableFacilities() {
        return facilityRepository.findByStatus(Facility.Status.AVAILABLE).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    private FacilityDTO toDTO(Facility facility) {
        return FacilityDTO.builder()
                .id(facility.getId())
                .name(facility.getName())
                .type(facility.getType())
                .location(facility.getLocation())
                .capacity(facility.getCapacity())
                .status(facility.getStatus())
                .imageUrl(facility.getImageUrl())
                .build();
    }
}
