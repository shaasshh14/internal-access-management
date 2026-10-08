package com.shashank.iam.iambackend.modules.audit.repository;

import com.shashank.iam.iambackend.modules.audit.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    List<AuditLog> findByActorId(UUID actorId);

    List<AuditLog> findByAction(String action);

    List<AuditLog> findByEntityTypeAndEntityId(
            String entityType,
            UUID entityId
    );
}