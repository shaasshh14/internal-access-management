package com.shashank.iam.iambackend.modules.permission.service;

import com.shashank.iam.iambackend.modules.permission.dto.request.CreatePermissionRequest;
import com.shashank.iam.iambackend.modules.permission.dto.request.UpdatePermissionRequest;
import com.shashank.iam.iambackend.modules.permission.dto.response.PermissionResponse;
import com.shashank.iam.iambackend.modules.permission.entity.Permission;
import com.shashank.iam.iambackend.modules.permission.repository.PermissionRepository;
import com.shashank.iam.iambackend.modules.role.entity.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PermissionService {

    private final PermissionRepository permissionRepository;

    public List<PermissionResponse> getPermissions() {
        return permissionRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public PermissionResponse getPermissionById(UUID id) {
        return toResponse(findPermission(id));
    }

    public PermissionResponse createPermission(CreatePermissionRequest request) {
        String name = normalizeName(request.getName());

        if (permissionRepository.existsByNameIgnoreCase(name)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Permission already exists: " + name
            );
        }

        Permission permission = Permission.builder()
                .name(name)
                .description(normalizeOptional(request.getDescription()))
                .build();

        return toResponse(permissionRepository.save(permission));
    }

    public PermissionResponse updatePermission(
            UUID id,
            UpdatePermissionRequest request) {

        Permission permission = findPermission(id);
        String name = normalizeName(request.getName());

        permissionRepository.findByNameIgnoreCase(name)
                .filter(existingPermission ->
                        !existingPermission.getId().equals(id))
                .ifPresent(existingPermission -> {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "Permission already exists: " + name
                    );
                });

        permission.setName(name);
        permission.setDescription(
                normalizeOptional(request.getDescription())
        );

        return toResponse(permissionRepository.save(permission));
    }

    public void deletePermission(UUID id) {
        Permission permission = findPermission(id);

        if (!permission.getRoles().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot delete a permission assigned to roles"
            );
        }

        permissionRepository.delete(permission);
    }

    private Permission findPermission(UUID id) {
        return permissionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Permission not found: " + id
                ));
    }

    private PermissionResponse toResponse(Permission permission) {
        return PermissionResponse.builder()
                .id(permission.getId())
                .name(permission.getName())
                .description(permission.getDescription())
                .roleIds(
                        permission.getRoles()
                                .stream()
                                .map(Role::getId)
                                .collect(Collectors.toSet())
                )
                .createdAt(permission.getCreatedAt())
                .updatedAt(permission.getUpdatedAt())
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