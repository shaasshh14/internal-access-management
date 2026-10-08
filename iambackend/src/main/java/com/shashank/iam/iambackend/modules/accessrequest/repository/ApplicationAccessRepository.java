package com.shashank.iam.iambackend.modules.accessrequest.repository;

import com.shashank.iam.iambackend.modules.accessrequest.entity.ApplicationAccess;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ApplicationAccessRepository
        extends JpaRepository<ApplicationAccess, UUID> {

    Optional<ApplicationAccess> findByApplicationIdAndUserId(
            UUID applicationId,
            UUID userId
    );

    List<ApplicationAccess> findByUserId(UUID userId);

    List<ApplicationAccess> findByApplicationId(UUID applicationId);
}