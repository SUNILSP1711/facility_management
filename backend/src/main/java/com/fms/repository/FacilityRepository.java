package com.fms.repository;

import com.fms.entity.Facility;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FacilityRepository extends MongoRepository<Facility, String> {
    List<Facility> findByType(Facility.FacilityType type);
    List<Facility> findByStatus(Facility.Status status);
}
