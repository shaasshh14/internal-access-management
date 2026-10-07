package com.shashank.iam.iambackend.modules.accessrequest.repository;

import com.shashank.iam.iambackend.modules.accessrequest.entity.AccessRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AccessRequestRepository extends JpaRepository<AccessRequest, UUID> {

    List<AccessRequest> findByRequesterId(UUID requesterId);

    List<AccessRequest> findByStatus(String status);

    List<AccessRequest> findByApplicationId(UUID applicationId);
}