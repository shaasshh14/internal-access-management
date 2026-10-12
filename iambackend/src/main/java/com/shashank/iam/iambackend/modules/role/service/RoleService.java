package com.shashank.iam.iambackend.modules.role.service;

import com.shashank.iam.iambackend.modules.permission.entity.Permission;
import com.shashank.iam.iambackend.modules.permission.repository.PermissionRepository;
import com.shashank.iam.iambackend.modules.role.dto.request.CreateRoleRequest;
import com.shashank.iam.iambackend.modules.role.dto.request.UpdateRoleRequest;
import com.shashank.iam.iambackend.modules.role.dto.response.RoleResponse;
import com.shashank.iam.iambackend.modules.role.entity.Role;
import com.shashank.iam.iambackend.modules.role.repository.RoleRepository;
import com.shashank.iam.iambackend.modules.audit.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Set;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final AuditLogService auditLogService;

    public List<RoleResponse> getRoles() {
        return roleRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public RoleResponse getRoleById(UUID id) {
        return toResponse(findRole(id));
    }

    public RoleResponse createRole(CreateRoleRequest request,
        HttpServletRequest httpRequest) {
        String name = normalizeName(request.getName());

        if (roleRepository.existsByNameIgnoreCase(name)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Role already exists: " + name
            );
        }

        Role role = Role.builder()
                .name(name)
                .description(normalizeOptional(request.getDescription()))
                .build();

        Role savedRole = roleRepository.save(role);

        auditLogService.log(
            "ROLE_CREATED",
            "ROLE",
            savedRole.getId(),
            "Role created: " + savedRole.getName(),
            httpRequest
        );

        return toResponse(savedRole);
    }

    public RoleResponse updateRole(UUID id, UpdateRoleRequest request,
        HttpServletRequest httpRequest) {
        Role role = findRole(id);
        String name = normalizeName(request.getName());

        roleRepository.findByNameIgnoreCase(name)
                .filter(existingRole -> !existingRole.getId().equals(id))
                .ifPresent(existingRole -> {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "Role already exists: " + name
                    );
                });

        role.setName(name);
        role.setDescription(normalizeOptional(request.getDescription()));

        Role savedRole = roleRepository.save(role);

        auditLogService.log(
            "ROLE_UPDATED",
            "ROLE",
            savedRole.getId(),
            "Role updated: " + savedRole.getName(),
            httpRequest
        );

        return toResponse(savedRole);
    }

    public void deleteRole(UUID id, HttpServletRequest httpRequest) {
        Role role = findRole(id);

        if (!role.getUsers().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot delete a role assigned to users"
            );
        }

        UUID deletedRoleId = role.getId();
        String deletedRoleName = role.getName();

        roleRepository.delete(role);

        auditLogService.log(
                "ROLE_DELETED",
                "ROLE",
                deletedRoleId,
                "Role deleted: " + deletedRoleName,
                httpRequest
        );
    }

    @Transactional(readOnly = true)
    public Set<UUID> getRolePermissions(UUID roleId) {
        Role role = findRole(roleId);

        return role.getPermissions()
                .stream()
                .map(Permission::getId)
                .collect(Collectors.toSet());
    }

    @Transactional
    public RoleResponse assignPermissionToRole(
            UUID roleId,
            UUID permissionId,
            HttpServletRequest httpRequest) {

        Role role = findRole(roleId);

        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Permission not found: " + permissionId
                ));

        if (role.getPermissions().contains(permission)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Permission is already assigned to role"
            );
        }

        role.getPermissions().add(permission);

        Role savedRole = roleRepository.save(role);

        auditLogService.log(
                "ROLE_PERMISSION_ASSIGNED",
                "ROLE",
                savedRole.getId(),
                "Permission " + permission.getName()
                        + " assigned to role " + savedRole.getName(),
                httpRequest
        );

        return toResponse(savedRole);
    }

    @Transactional
    public RoleResponse removePermissionFromRole(
            UUID roleId,
            UUID permissionId,
            HttpServletRequest httpRequest) {

        Role role = findRole(roleId);

        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Permission not found: " + permissionId
                ));

        if (!role.getPermissions().contains(permission)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Permission is not assigned to role"
            );
        }

        role.getPermissions().remove(permission);

        Role savedRole = roleRepository.save(role);

        auditLogService.log(
                "ROLE_PERMISSION_REMOVED",
                "ROLE",
                savedRole.getId(),
                "Permission " + permission.getName()
                        + " removed from role " + savedRole.getName(),
                httpRequest
        );

        return toResponse(savedRole);
    }

    private Role findRole(UUID id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Role not found: " + id
                ));
    }

    private RoleResponse toResponse(Role role) {
        return RoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .description(role.getDescription())
                .permissionIds(
                        role.getPermissions()
                                .stream()
                                .map(Permission::getId)
                                .collect(Collectors.toSet())
                )
                .createdAt(role.getCreatedAt())
                .updatedAt(role.getUpdatedAt())
                .build();
    }

    private String normalizeName(String name) {
        return name == null ? null : name.trim();
    }

    private String normalizeOptional(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }
}