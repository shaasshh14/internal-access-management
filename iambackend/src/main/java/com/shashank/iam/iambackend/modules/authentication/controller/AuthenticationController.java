package com.shashank.iam.iambackend.modules.authentication.controller;

import com.shashank.iam.iambackend.modules.authentication.dto.request.LoginRequest;
import com.shashank.iam.iambackend.modules.authentication.dto.response.LoginResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import com.shashank.iam.iambackend.security.jwt.JwtService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        return ResponseEntity.ok(
                LoginResponse.builder()
                        .accessToken(
                                jwtService.generateAccessToken(
                                        request.getEmail()))
                        .build());
    }
}