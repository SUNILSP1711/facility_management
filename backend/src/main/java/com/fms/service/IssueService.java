package com.fms.service;

import com.fms.dto.IssueDTO;
import com.fms.entity.Issue;
import com.fms.repository.IssueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IssueService {
    
    private final IssueRepository issueRepository;
    
    public IssueDTO reportIssue(IssueDTO dto) {
        Issue issue = Issue.builder()
                .facilityId(dto.getFacilityId())
                .reportedBy(dto.getReportedBy())
                .description(dto.getDescription())
                .severity(dto.getSeverity())
                .status(Issue.Status.OPEN)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        Issue saved = issueRepository.save(issue);
        return toDTO(saved);
    }
    
    public IssueDTO updateIssueStatus(String id, Issue.Status status) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));
        
        issue.setStatus(status);
        issue.setUpdatedAt(LocalDateTime.now());
        Issue updated = issueRepository.save(issue);
        return toDTO(updated);
    }
    
    public Optional<IssueDTO> getIssueById(String id) {
        return issueRepository.findById(id).map(this::toDTO);
    }
    
    public List<IssueDTO> getAllIssues() {
        return issueRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<IssueDTO> getIssuesByFacility(String facilityId) {
        return issueRepository.findByFacilityId(facilityId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<IssueDTO> getIssuesByReporter(String reportedBy) {
        return issueRepository.findByReportedBy(reportedBy).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<IssueDTO> getOpenIssues() {
        return issueRepository.findByStatus(Issue.Status.OPEN).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    private IssueDTO toDTO(Issue issue) {
        return IssueDTO.builder()
                .id(issue.getId())
                .facilityId(issue.getFacilityId())
                .reportedBy(issue.getReportedBy())
                .description(issue.getDescription())
                .severity(issue.getSeverity())
                .status(issue.getStatus())
                .build();
    }
}
