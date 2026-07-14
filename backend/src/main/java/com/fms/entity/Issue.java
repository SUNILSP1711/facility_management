package com.fms.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "issues")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Issue {
    @Id
    private String id;
    private String facilityId;
    private String reportedBy;
    private String description;
    private Severity severity;
    private Status status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum Severity {
        LOW, MEDIUM, HIGH
    }

    public enum Status {
        OPEN, IN_PROGRESS, RESOLVED
    }
}
