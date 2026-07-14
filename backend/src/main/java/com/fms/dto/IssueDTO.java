package com.fms.dto;

import com.fms.entity.Issue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssueDTO {
    private String id;
    
    @NotBlank(message = "Facility ID is required")
    private String facilityId;
    
    private String reportedBy;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotNull(message = "Severity is required")
    private Issue.Severity severity;
    
    private Issue.Status status;
}
