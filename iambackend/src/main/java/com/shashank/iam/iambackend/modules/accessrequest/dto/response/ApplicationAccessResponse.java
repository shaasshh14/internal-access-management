package com.shashank.iam.iambackend.modules.accessrequest.dto.response;

import com.shashank.iam.iambackend.modules.accessrequest.entity.ApplicationAccessStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class ApplicationAccessResponse {

    private UUID id;

    private UUID applicationId;

    private String applicationName;

    private UUID userId;

    private String userName;

    private String accessLevel;

    private LocalDateTime grantedAt;

    private LocalDateTime expiresAt;

    private ApplicationAccessStatus status;
}