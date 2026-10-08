package com.shashank.iam.iambackend.modules.audit.controller;

import com.shashank.iam.iambackend.modules.audit.dto.response.AuditLogResponse;
import com.shashank.iam.iambackend.modules.audit.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    @PreAuthorize("hasAuthority('AUDIT_READ')")
    public ResponseEntity<List<AuditLogResponse>> getAuditLogs() {
        return ResponseEntity.ok(
                auditLogService.getAuditLogs()
        );
    }

    @GetMapping("/actor/{actorId}")
    @PreAuthorize("hasAuthority('AUDIT_READ')")
    public ResponseEntity<List<AuditLogResponse>> getAuditLogsByActor(
            @PathVariable UUID actorId
    ) {
        return ResponseEntity.ok(
                auditLogService.getAuditLogsByActor(actorId)
        );
    }

    @GetMapping("/entity/{entityType}/{entityId}")
    @PreAuthorize("hasAuthority('AUDIT_READ')")
    public ResponseEntity<List<AuditLogResponse>> getAuditLogsByEntity(
            @PathVariable String entityType,
            @PathVariable UUID entityId
    ) {
        return ResponseEntity.ok(
                auditLogService.getAuditLogsByEntity(entityType, entityId)
        );
    }
}