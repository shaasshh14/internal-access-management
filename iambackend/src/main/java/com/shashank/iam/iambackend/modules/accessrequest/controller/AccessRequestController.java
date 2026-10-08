package com.shashank.iam.iambackend.modules.accessrequest.controller;

import com.shashank.iam.iambackend.modules.accessrequest.dto.request.CreateAccessRequest;
import com.shashank.iam.iambackend.modules.accessrequest.dto.request.ReviewAccessRequest;
import com.shashank.iam.iambackend.modules.accessrequest.dto.response.AccessRequestResponse;
import com.shashank.iam.iambackend.modules.accessrequest.service.AccessRequestService;
import com.shashank.iam.iambackend.modules.accessrequest.dto.response.ApplicationAccessResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/access-requests")
@RequiredArgsConstructor
public class AccessRequestController {

    private final AccessRequestService accessRequestService;

    @PostMapping
    @PreAuthorize("hasAuthority('ACCESS_REQUEST_CREATE')")
    public ResponseEntity<AccessRequestResponse> createRequest(
            @Valid @RequestBody CreateAccessRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(accessRequestService.createRequest(request));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAuthority('ACCESS_REQUEST_READ')")
    public ResponseEntity<List<AccessRequestResponse>> getMyRequests() {
        return ResponseEntity.ok(
                accessRequestService.getMyRequests()
        );
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ACCESS_REQUEST_READ')")
    public ResponseEntity<List<AccessRequestResponse>> getAllRequests() {
        return ResponseEntity.ok(
                accessRequestService.getAllRequests()
        );
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('ACCESS_REQUEST_APPROVE')")
    public ResponseEntity<AccessRequestResponse> approveRequest(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                accessRequestService.approveRequest(id)
        );
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAuthority('ACCESS_REQUEST_REJECT')")
    public ResponseEntity<AccessRequestResponse> rejectRequest(
            @PathVariable UUID id,
            @Valid @RequestBody ReviewAccessRequest request
    ) {
        return ResponseEntity.ok(
                accessRequestService.rejectRequest(id, request)
        );
    }

    @DeleteMapping("/{id}/revoke")
    @PreAuthorize("hasAuthority('ACCESS_REVOKE')")
    public ResponseEntity<AccessRequestResponse> revokeAccess(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                accessRequestService.revokeAccess(id)
        );
    }

    @GetMapping("/my/access")
    @PreAuthorize("hasAuthority('ACCESS_REQUEST_READ')")
    public ResponseEntity<List<ApplicationAccessResponse>> getMyAccess() {
        return ResponseEntity.ok(
                accessRequestService.getMyAccess()
        );
    }

    @GetMapping("/applications/{applicationId}/access")
    @PreAuthorize("hasAuthority('ACCESS_REQUEST_READ')")
    public ResponseEntity<List<ApplicationAccessResponse>> getApplicationAccess(
            @PathVariable UUID applicationId
    ) {
        return ResponseEntity.ok(
                accessRequestService.getApplicationAccess(applicationId)
        );
    }
}