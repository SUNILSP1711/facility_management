package com.fms.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "facilities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Facility {
    @Id
    private String id;
    private String name;
    private FacilityType type;
    private String location;
    private Integer capacity;
    private Status status;
    private String imageUrl;

    public enum FacilityType {
        SEMINAR_HALL, LAB, AUDITORIUM
    }

    public enum Status {
        AVAILABLE, UNDER_MAINTENANCE
    }
}
