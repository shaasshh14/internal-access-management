package com.shashank.iam.iambackend.modules.accessrequest.service;

import com.shashank.iam.iambackend.modules.accessrequest.dto.request.CreateAccessRequest;
import com.shashank.iam.iambackend.modules.accessrequest.dto.request.ReviewAccessRequest;
import com.shashank.iam.iambackend.modules.accessrequest.dto.response.AccessRequestResponse;
import com.shashank.iam.iambackend.modules.accessrequest.entity.AccessRequest;
import com.shashank.iam.iambackend.modules.accessrequest.entity.AccessRequestStatus;
import com.shashank.iam.iambackend.modules.accessrequest.entity.ApplicationAccess;
import com.shashank.iam.iambackend.modules.accessrequest.entity.ApplicationAccessStatus;
import com.shashank.iam.iambackend.modules.accessrequest.repository.AccessRequestRepository;
import com.shashank.iam.iambackend.modules.accessrequest.repository.ApplicationAccessRepository;
import com.shashank.iam.iambackend.modules.application.entity.Application;
import com.shashank.iam.iambackend.modules.application.repository.ApplicationRepository;
import com.shashank.iam.iambackend.modules.user.entity.User;
import com.shashank.iam.iambackend.modules.user.repository.UserRepository;
import com.shashank.iam.iambackend.modules.accessrequest.dto.response.ApplicationAccessResponse;
import com.shashank.iam.iambackend.modules.audit.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccessRequestService {

    private final AccessRequestRepository accessRequestRepository;
    private final ApplicationAccessRepository applicationAccessRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public AccessRequestResponse createRequest(CreateAccessRequest request) {

        User requester = getCurrentUser();

        Application application = applicationRepository
            .findById(request.applicationId())
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Application not found: " + request.applicationId()
            ));

        if (application.getStatus().name().equals("INACTIVE")) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Cannot request access to an inactive application"
            );
        }

        applicationAccessRepository
            .findByApplicationIdAndUserId(
                application.getId(),
                requester.getId()
            )
            .ifPresent(access -> {
                if (access.getStatus() == ApplicationAccessStatus.ACTIVE) {
                    throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "User already has active access to this application"
                    );
                }
            });

        boolean pendingRequestExists = accessRequestRepository
            .findByRequesterId(requester.getId())
            .stream()
            .anyMatch(existing ->
                existing.getApplication().getId().equals(application.getId())
                    && existing.getStatus() == AccessRequestStatus.PENDING
            );

        if (pendingRequestExists) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "A pending access request already exists for this application"
            );
        }

        AccessRequest accessRequest = AccessRequest.builder()
            .requester(requester)
            .application(application)
            .accessLevel(request.accessLevel())
            .justification(request.justification())
            .status(AccessRequestStatus.PENDING)
            .build();

        AccessRequest savedRequest = accessRequestRepository.save(accessRequest);

        auditLogService.log(
            "ACCESS_REQUEST_CREATED",
            "ACCESS_REQUEST",
            savedRequest.getId(),
            "Access request created for application "
                + savedRequest.getApplication().getName()
        );

        return toResponse(savedRequest);
    }

    @Transactional(readOnly = true)
    public List<AccessRequestResponse> getMyRequests() {

        User currentUser = getCurrentUser();

        return accessRequestRepository
            .findByRequesterId(currentUser.getId())
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<AccessRequestResponse> getAllRequests() {

        return accessRequestRepository
            .findAll()
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional
    public AccessRequestResponse approveRequest(
        UUID requestId
    ) {

        AccessRequest accessRequest = findRequest(requestId);

        if (accessRequest.getStatus() != AccessRequestStatus.PENDING) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Only pending requests can be approved"
            );
        }

        User approver = getCurrentUser();

        ApplicationAccess access = applicationAccessRepository
                .findByApplicationIdAndUserId(
                    accessRequest.getApplication().getId(),
                    accessRequest.getRequester().getId()
                )
                .orElse(null);

        if (access == null) {

            access = ApplicationAccess.builder()
                .application(accessRequest.getApplication())
                .user(accessRequest.getRequester())
                .accessLevel(accessRequest.getAccessLevel())
                .grantedAt(LocalDateTime.now())
                .status(ApplicationAccessStatus.ACTIVE)
                .build();

        } else {

            access.setAccessLevel(accessRequest.getAccessLevel());
            access.setGrantedAt(LocalDateTime.now());
            access.setStatus(ApplicationAccessStatus.ACTIVE);
            access.setExpiresAt(null);
        }

        applicationAccessRepository.save(access);

        accessRequest.setStatus(AccessRequestStatus.APPROVED);
        accessRequest.setApprover(approver);
        accessRequest.setReviewedAt(LocalDateTime.now());
        accessRequest.setRejectionReason(null);

        AccessRequest savedRequest = accessRequestRepository.save(accessRequest);

        auditLogService.log(
            "ACCESS_REQUEST_APPROVED",
            "ACCESS_REQUEST",
            savedRequest.getId(),
            "Access request approved for application "
                + savedRequest.getApplication().getName()
        );

        return toResponse(savedRequest);
    }

    @Transactional
    public AccessRequestResponse rejectRequest(
            UUID requestId,
            ReviewAccessRequest request
    ) {

        AccessRequest accessRequest = findRequest(requestId);

        if (accessRequest.getStatus() != AccessRequestStatus.PENDING) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Only pending requests can be rejected"
            );
        }

        User approver = getCurrentUser();

        accessRequest.setStatus(AccessRequestStatus.REJECTED);
        accessRequest.setApprover(approver);
        accessRequest.setReviewedAt(LocalDateTime.now());
        accessRequest.setRejectionReason(request.rejectionReason());

        AccessRequest savedRequest = accessRequestRepository.save(accessRequest);

        auditLogService.log(
                "ACCESS_REQUEST_REJECTED",
                "ACCESS_REQUEST",
                savedRequest.getId(),
                "Access request rejected for application "
                        + savedRequest.getApplication().getName()
        );

        return toResponse(savedRequest);
    }

    @Transactional
    public AccessRequestResponse revokeAccess(UUID requestId) {

        AccessRequest accessRequest = findRequest(requestId);

        if (accessRequest.getStatus() != AccessRequestStatus.APPROVED) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Only approved requests can be revoked"
            );
        }

        ApplicationAccess access = applicationAccessRepository
                .findByApplicationIdAndUserId(
                        accessRequest.getApplication().getId(),
                        accessRequest.getRequester().getId()
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Application access not found"
                ));

        if (access.getStatus() != ApplicationAccessStatus.ACTIVE) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Application access is not active"
            );
        }

        access.setStatus(ApplicationAccessStatus.REVOKED);
        applicationAccessRepository.save(access);

        accessRequest.setStatus(AccessRequestStatus.REVOKED);
        accessRequest.setReviewedAt(LocalDateTime.now());
        accessRequest.setApprover(getCurrentUser());

        AccessRequest savedRequest =
        accessRequestRepository.save(accessRequest);

        auditLogService.log(
                "ACCESS_REQUEST_REVOKED",
                "ACCESS_REQUEST",
                savedRequest.getId(),
                "Application access revoked for "
                        + savedRequest.getApplication().getName()
        );

        return toResponse(savedRequest);
    }

    @Transactional(readOnly = true)
    public List<ApplicationAccessResponse> getMyAccess() {

        User currentUser = getCurrentUser();

        return applicationAccessRepository
            .findByUserId(currentUser.getId())
            .stream()
            .map(this::toAccessResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<ApplicationAccessResponse> getApplicationAccess(
            UUID applicationId
    ) {

        applicationRepository
            .findById(applicationId)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Application not found: " + applicationId
            ));

        return applicationAccessRepository
            .findByApplicationId(applicationId)
            .stream()
            .map(this::toAccessResponse)
            .toList();
    }

    private ApplicationAccessResponse toAccessResponse(
            ApplicationAccess access
    ) {

        User user = access.getUser();
        Application application = access.getApplication();

        return ApplicationAccessResponse.builder()
            .id(access.getId())
            .applicationId(application.getId())
            .applicationName(application.getName())
            .userId(user.getId())
            .userName(
                    user.getFirstName() + " " + user.getLastName()
            )
            .accessLevel(access.getAccessLevel())
            .grantedAt(access.getGrantedAt())
            .expiresAt(access.getExpiresAt())
            .status(access.getStatus())
            .build();
    }

    private AccessRequest findRequest(UUID id) {

        return accessRequestRepository
            .findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Access request not found: " + id
            ));
    }

    private User getCurrentUser() {

        String email = SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getName();

        return userRepository
            .findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Current user not found"
            ));
    }

    private AccessRequestResponse toResponse(AccessRequest request) {

        User requester = request.getRequester();
        User approver = request.getApprover();
        Application application = request.getApplication();

        return AccessRequestResponse.builder()
            .id(request.getId())
            .requesterId(requester.getId())
            .requesterName(
                    requester.getFirstName() + " " + requester.getLastName()
            )
            .applicationId(application.getId())
            .applicationName(application.getName())
            .accessLevel(request.getAccessLevel())
            .justification(request.getJustification())
            .status(request.getStatus())
            .approverId(
                    approver != null ? approver.getId() : null
            )
            .approverName(
                    approver != null
                            ? approver.getFirstName() + " " + approver.getLastName()
                            : null
            )
            .requestedAt(request.getRequestedAt())
            .reviewedAt(request.getReviewedAt())
            .rejectionReason(request.getRejectionReason())
            .build();
    }
}