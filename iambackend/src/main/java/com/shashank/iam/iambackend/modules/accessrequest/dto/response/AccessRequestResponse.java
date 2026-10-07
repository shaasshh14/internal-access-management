package com.shashank.iam.iambackend.modules.accessrequest.dto.response;

import com.shashank.iam.iambackend.modules.accessrequest.entity.AccessRequestStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class AccessRequestResponse {

    private UUID id;

    private UUID requesterId;

    private String requesterName;

    private UUID applicationId;

    private String applicationName;

    private String accessLevel;

    private String justification;

    private AccessRequestStatus status;

    private UUID approverId;

    private String approverName;

    private LocalDateTime requestedAt;

    private LocalDateTime reviewedAt;

    private String rejectionReason;
}