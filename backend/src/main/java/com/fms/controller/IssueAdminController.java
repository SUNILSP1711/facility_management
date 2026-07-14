package com.fms.controller;

import com.fms.dto.IssueDTO;
import com.fms.entity.Issue;
import com.fms.service.IssueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin/issues")
@RequiredArgsConstructor
public class IssueAdminController {
    
    private final IssueService issueService;
    
    @GetMapping
    public ResponseEntity<List<IssueDTO>> getAllIssues() {
        return ResponseEntity.ok(issueService.getAllIssues());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<IssueDTO> getIssueById(@PathVariable String id) {
        return issueService.getIssueById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<IssueDTO> updateIssueStatus(@PathVariable String id, @RequestParam Issue.Status status) {
        return ResponseEntity.ok(issueService.updateIssueStatus(id, status));
    }
    
    @GetMapping("/open")
    public ResponseEntity<List<IssueDTO>> getOpenIssues() {
        return ResponseEntity.ok(issueService.getOpenIssues());
    }
}
