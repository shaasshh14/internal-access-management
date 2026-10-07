package com.shashank.iam.iambackend.modules.permission.controller;

import com.shashank.iam.iambackend.modules.permission.dto.request.CreatePermissionRequest;
import com.shashank.iam.iambackend.modules.permission.dto.request.UpdatePermissionRequest;
import com.shashank.iam.iambackend.modules.permission.dto.response.PermissionResponse;
import com.shashank.iam.iambackend.modules.permission.service.PermissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionService permissionService;

    @PreAuthorize("hasAuthority('PERMISSION_READ')")
    @GetMapping
    public ResponseEntity<List<PermissionResponse>> getPermissions() {
        return ResponseEntity.ok(permissionService.getPermissions());
    }

    @PreAuthorize("hasAuthority('PERMISSION_READ')")
    @GetMapping("/{id}")
    public ResponseEntity<PermissionResponse> getPermissionById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                permissionService.getPermissionById(id)
        );
    }

    @PreAuthorize("hasAuthority('PERMISSION_WRITE')")
    @PostMapping
    public ResponseEntity<PermissionResponse> createPermission(
            @Valid @RequestBody CreatePermissionRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(permissionService.createPermission(request));
    }

    @PreAuthorize("hasAuthority('PERMISSION_WRITE')")
    @PutMapping("/{id}")
    public ResponseEntity<PermissionResponse> updatePermission(
            @PathVariable UUID id,
            @Valid @RequestBody UpdatePermissionRequest request) {

        return ResponseEntity.ok(
                permissionService.updatePermission(id, request)
        );
    }

    @PreAuthorize("hasAuthority('PERMISSION_WRITE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePermission(
            @PathVariable UUID id) {

        permissionService.deletePermission(id);

        return ResponseEntity.noContent().build();
    }
}