package com.shashank.iam.iambackend.modules.audit.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class AuditLogResponse {

    private UUID id;

    private UUID actorId;

    private String actorName;

    private String action;

    private String entityType;

    private UUID entityId;

    private String description;

    private String ipAddress;

    private LocalDateTime createdAt;
}