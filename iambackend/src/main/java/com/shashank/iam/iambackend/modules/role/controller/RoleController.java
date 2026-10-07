package com.shashank.iam.iambackend.modules.role.controller;

import com.shashank.iam.iambackend.modules.role.dto.request.CreateRoleRequest;
import com.shashank.iam.iambackend.modules.role.dto.request.UpdateRoleRequest;
import com.shashank.iam.iambackend.modules.role.dto.response.RoleResponse;
import com.shashank.iam.iambackend.modules.role.service.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.UUID;
import java.util.Set;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @PreAuthorize("hasAuthority('ROLE_READ')")
    @GetMapping
    public ResponseEntity<List<RoleResponse>> getRoles() {
        return ResponseEntity.ok(roleService.getRoles());
    }

    @PreAuthorize("hasAuthority('ROLE_READ')")
    @GetMapping("/{id}")
    public ResponseEntity<RoleResponse> getRoleById(@PathVariable UUID id) {
        return ResponseEntity.ok(roleService.getRoleById(id));
    }

    @PreAuthorize("hasAuthority('ROLE_WRITE')")
    @PostMapping
    public ResponseEntity<RoleResponse> createRole(
            @Valid @RequestBody CreateRoleRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(roleService.createRole(request));
    }

    @PreAuthorize("hasAuthority('ROLE_WRITE')")
    @PutMapping("/{id}")
    public ResponseEntity<RoleResponse> updateRole(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateRoleRequest request) {

        return ResponseEntity.ok(roleService.updateRole(id, request));
    }

    @PreAuthorize("hasAuthority('ROLE_WRITE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable UUID id) {
        roleService.deleteRole(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAuthority('ROLE_READ')")
    @GetMapping("/{roleId}/permissions")
    public ResponseEntity<Set<UUID>> getRolePermissions(
            @PathVariable UUID roleId) {

        return ResponseEntity.ok(
                roleService.getRolePermissions(roleId)
        );
    }

    @PreAuthorize("hasAuthority('PERMISSION_WRITE')")
    @PostMapping("/{roleId}/permissions/{permissionId}")
    public ResponseEntity<RoleResponse> assignPermissionToRole(
            @PathVariable UUID roleId,
            @PathVariable UUID permissionId) {

        return ResponseEntity.ok(
                roleService.assignPermissionToRole(roleId, permissionId)
        );
    }

    @PreAuthorize("hasAuthority('PERMISSION_WRITE')")
    @DeleteMapping("/{roleId}/permissions/{permissionId}")
    public ResponseEntity<RoleResponse> removePermissionFromRole(
            @PathVariable UUID roleId,
            @PathVariable UUID permissionId) {

        return ResponseEntity.ok(
                roleService.removePermissionFromRole(roleId, permissionId)
        );
    }
}