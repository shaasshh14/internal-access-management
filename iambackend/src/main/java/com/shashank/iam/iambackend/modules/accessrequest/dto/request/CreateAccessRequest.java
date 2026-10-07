package com.shashank.iam.iambackend.modules.accessrequest.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateAccessRequest(

        @NotNull(message = "Application ID is required")
        UUID applicationId,

        @NotBlank(message = "Access level is required")
        @Size(max = 50, message = "Access level must not exceed 50 characters")
        String accessLevel,

        @NotBlank(message = "Justification is required")
        String justification
) {
}