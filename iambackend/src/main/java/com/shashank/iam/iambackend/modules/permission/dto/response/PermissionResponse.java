package com.shashank.iam.iambackend.modules.permission.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PermissionResponse {

    private UUID id;
    private String name;
    private String description;
    private Set<UUID> roleIds;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}