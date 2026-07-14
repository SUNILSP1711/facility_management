package com.fms.repository;

import com.fms.entity.Issue;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IssueRepository extends MongoRepository<Issue, String> {
    List<Issue> findByFacilityId(String facilityId);
    List<Issue> findByReportedBy(String reportedBy);
    List<Issue> findByStatus(Issue.Status status);
}
