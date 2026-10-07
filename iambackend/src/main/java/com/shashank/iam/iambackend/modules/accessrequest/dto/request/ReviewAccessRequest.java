package com.shashank.iam.iambackend.modules.accessrequest.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ReviewAccessRequest(

        @NotBlank(message = "Rejection reason is required")
        String rejectionReason
) {
}