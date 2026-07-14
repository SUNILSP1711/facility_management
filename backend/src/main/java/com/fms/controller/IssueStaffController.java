package com.fms.controller;

import com.fms.dto.IssueDTO;
import com.fms.service.IssueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/staff/issues")
@RequiredArgsConstructor
public class IssueStaffController {
    
    private final IssueService issueService;
    
    @PostMapping
    public ResponseEntity<IssueDTO> reportIssue(@Valid @RequestBody IssueDTO dto, Authentication auth) {
        dto.setReportedBy(auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(issueService.reportIssue(dto));
    }
    
    @GetMapping("/my-issues")
    public ResponseEntity<List<IssueDTO>> getMyIssues(Authentication auth) {
        return ResponseEntity.ok(issueService.getIssuesByReporter(auth.getName()));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<IssueDTO> getIssueById(@PathVariable String id) {
        return issueService.getIssueById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
