package com.shashank.iam.iambackend.modules.application.controller;

import com.shashank.iam.iambackend.modules.application.dto.request.CreateApplicationRequest;
import com.shashank.iam.iambackend.modules.application.dto.request.UpdateApplicationRequest;
import com.shashank.iam.iambackend.modules.application.dto.request.UpdateApplicationStatusRequest;
import com.shashank.iam.iambackend.modules.application.dto.response.ApplicationResponse;
import com.shashank.iam.iambackend.modules.application.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PreAuthorize("hasAuthority('APPLICATION_READ')")
    @GetMapping
    public ResponseEntity<List<ApplicationResponse>> getApplications() {
        return ResponseEntity.ok(
                applicationService.getApplications());
    }

    @PreAuthorize("hasAuthority('APPLICATION_READ')")
    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponse> getApplicationById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                applicationService.getApplicationById(id));
    }

    @PreAuthorize("hasAuthority('APPLICATION_WRITE')")
    @PostMapping
    public ResponseEntity<ApplicationResponse> createApplication(
            @Valid @RequestBody CreateApplicationRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(applicationService.createApplication(request));
    }

    @PreAuthorize("hasAuthority('APPLICATION_WRITE')")
    @PutMapping("/{id}")
    public ResponseEntity<ApplicationResponse> updateApplication(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateApplicationRequest request) {

        return ResponseEntity.ok(
                applicationService.updateApplication(id, request));
    }

    @PreAuthorize("hasAuthority('APPLICATION_WRITE')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApplicationResponse> updateApplicationStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateApplicationStatusRequest request) {

        return ResponseEntity.ok(
                applicationService.updateApplicationStatus(id, request));
    }
}