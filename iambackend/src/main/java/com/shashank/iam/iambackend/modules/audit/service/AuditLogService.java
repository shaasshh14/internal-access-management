package com.shashank.iam.iambackend.modules.audit.service;

import com.shashank.iam.iambackend.modules.audit.dto.response.AuditLogResponse;
import com.shashank.iam.iambackend.modules.audit.entity.AuditLog;
import com.shashank.iam.iambackend.modules.audit.repository.AuditLogRepository;
import com.shashank.iam.iambackend.modules.user.entity.User;
import com.shashank.iam.iambackend.modules.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    @Transactional
    public void log(
            String action,
            String entityType,
            UUID entityId,
            String description,
            HttpServletRequest httpRequest
    ) {

        User actor = getCurrentUser();

        AuditLog auditLog = AuditLog.builder()
                .actor(actor)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .description(description)
                .ipAddress(getClientIpAddress(httpRequest))
                .build();

        auditLogRepository.save(auditLog);
    }

    @Transactional
    public void log(
            String action,
            String entityType,
            UUID entityId,
            String description
    ) {

        User actor = getCurrentUser();

        AuditLog auditLog = AuditLog.builder()
                .actor(actor)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .description(description)
                .build();

        auditLogRepository.save(auditLog);
    }

    @Transactional(readOnly = true)
    public List<AuditLogResponse> getAuditLogs() {

        return auditLogRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AuditLogResponse> getAuditLogsByActor(UUID actorId) {

        return auditLogRepository.findByActorId(actorId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AuditLogResponse> getAuditLogsByEntity(
            String entityType,
            UUID entityId
    ) {

        return auditLogRepository
                .findByEntityTypeAndEntityId(entityType, entityId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private User getCurrentUser() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new IllegalStateException("Current user not found")
                );
    }

    private String getClientIpAddress(HttpServletRequest request) {

        String forwardedFor = request.getHeader("X-Forwarded-For");

        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }

        return request.getRemoteAddr();
    }

    private AuditLogResponse toResponse(AuditLog auditLog) {

        User actor = auditLog.getActor();

        return AuditLogResponse.builder()
            .id(auditLog.getId())
            .actorId(actor != null ? actor.getId() : null)
            .actorName(
                    actor != null
                            ? actor.getFirstName() + " " + actor.getLastName()
                            : null
            )
            .action(auditLog.getAction())
            .entityType(auditLog.getEntityType())
            .entityId(auditLog.getEntityId())
            .description(auditLog.getDescription())
            .ipAddress(auditLog.getIpAddress())
            .createdAt(auditLog.getCreatedAt())
            .build();
    }
}