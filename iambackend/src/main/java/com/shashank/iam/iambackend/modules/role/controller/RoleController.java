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

import java.util.List;
import java.util.UUID;
import java.util.Set;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    public ResponseEntity<List<RoleResponse>> getRoles() {
        return ResponseEntity.ok(roleService.getRoles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoleResponse> getRoleById(@PathVariable UUID id) {
        return ResponseEntity.ok(roleService.getRoleById(id));
    }

    @PostMapping
    public ResponseEntity<RoleResponse> createRole(
            @Valid @RequestBody CreateRoleRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(roleService.createRole(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoleResponse> updateRole(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateRoleRequest request) {

        return ResponseEntity.ok(roleService.updateRole(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable UUID id) {
        roleService.deleteRole(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{roleId}/permissions")
    public ResponseEntity<Set<UUID>> getRolePermissions(
            @PathVariable UUID roleId) {

        return ResponseEntity.ok(
                roleService.getRolePermissions(roleId)
        );
    }

    @PostMapping("/{roleId}/permissions/{permissionId}")
    public ResponseEntity<RoleResponse> assignPermissionToRole(
            @PathVariable UUID roleId,
            @PathVariable UUID permissionId) {

        return ResponseEntity.ok(
                roleService.assignPermissionToRole(roleId, permissionId)
        );
    }

    @DeleteMapping("/{roleId}/permissions/{permissionId}")
    public ResponseEntity<RoleResponse> removePermissionFromRole(
            @PathVariable UUID roleId,
            @PathVariable UUID permissionId) {

        return ResponseEntity.ok(
                roleService.removePermissionFromRole(roleId, permissionId)
        );
    }
}