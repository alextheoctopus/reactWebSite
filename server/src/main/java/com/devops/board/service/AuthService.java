package com.devops.board.service;

import com.devops.board.dto.auth.AuthResponse;
import com.devops.board.dto.auth.LoginRequest;
import com.devops.board.dto.auth.RegisterRequest;
import com.devops.board.dto.auth.UserDto;
import com.devops.board.entity.User;
import com.devops.board.exception.ApiException;
import com.devops.board.repository.UserRepository;
import com.devops.board.security.AuthenticatedUser;
import com.devops.board.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String login = normalize(request.getLogin());
        String name = request.getName().trim();

        if (userRepository.existsByLogin(login)) {
            throw new ApiException(HttpStatus.CONFLICT, "Login already exists");
        }

        User user = new User();
        user.setName(name);
        user.setLogin(login);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        User saved = userRepository.save(user);

        String token = jwtService.generateToken(saved.getId(), saved.getLogin(), saved.getName());
        return new AuthResponse(token, toDto(saved));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String login = normalize(request.getLogin());
        User user = userRepository.findByLogin(login)
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        String token = jwtService.generateToken(user.getId(), user.getLogin(), user.getName());
        return new AuthResponse(token, toDto(user));
    }

    @Transactional(readOnly = true)
    public UserDto me(AuthenticatedUser principal) {
        User user = userRepository.findByLogin(principal.getLogin())
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Unauthorized"));
        return toDto(user);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    private UserDto toDto(User user) {
        return new UserDto(user.getId(), user.getName(), user.getLogin());
    }
}
