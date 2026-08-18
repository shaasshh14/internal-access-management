package com.shashank.iam.iambackend.config;

import com.shashank.iam.iambackend.modules.user.entity.User;
import com.shashank.iam.iambackend.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DevelopmentDataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initializeDevelopmentUser() {
        return args -> {
            if (userRepository.existsByEmail("admin@iam.local")) {
                return;
            }

            User user = User.builder()
                    .email("admin@iam.local")
                    .password(passwordEncoder.encode("Admin@123"))
                    .firstName("Admin")
                    .lastName("User")
                    .enabled(true)
                    .build();

            userRepository.save(user);
        };
    }
}