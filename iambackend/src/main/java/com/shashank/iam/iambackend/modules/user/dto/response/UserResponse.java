package com.shashank.iam.iambackend.modules.user.dto.response;

import com.shashank.iam.iambackend.modules.user.entity.UserStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class UserResponse {

    private UUID id;
    private String name;
    private String email;
    private String employeeId;
    private String department;
    private String role;
    private UserStatus status;
    private LocalDateTime lastActive;
    private LocalDateTime createdAt;
    private int applicationCount;
}
