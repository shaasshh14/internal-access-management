package com.shashank.iam.iambackend.modules.user.dto.request;

import com.shashank.iam.iambackend.modules.user.entity.UserStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateUserStatusRequest {

    @NotNull
    private UserStatus status;
}
