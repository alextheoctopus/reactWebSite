package com.devops.board.service;

import com.devops.board.dto.auth.AuthResponse;
import com.devops.board.dto.auth.LoginRequest;
import com.devops.board.dto.auth.RegisterRequest;
import com.devops.board.entity.User;
import com.devops.board.exception.ApiException;
import com.devops.board.repository.UserRepository;
import com.devops.board.security.AuthenticatedUser;
import com.devops.board.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setName("Timur");
        registerRequest.setLogin("timur");
        registerRequest.setPassword("secret123");

        loginRequest = new LoginRequest();
        loginRequest.setLogin("timur");
        loginRequest.setPassword("secret123");
    }

    @Test
    void registerSuccess() {
        User saved = new User();
        saved.setId(10L);
        saved.setName("Timur");
        saved.setLogin("timur");
        saved.setPasswordHash("hashed");

        when(userRepository.existsByLogin("timur")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenReturn(saved);
        when(jwtService.generateToken(10L, "timur", "Timur")).thenReturn("jwt-token");

        AuthResponse response = authService.register(registerRequest);

        assertEquals("jwt-token", response.getToken());
        assertEquals("Timur", response.getUser().getName());
        assertEquals("timur", response.getUser().getLogin());
    }

    @Test
    void registerDuplicateLogin() {
        when(userRepository.existsByLogin("timur")).thenReturn(true);

        ApiException ex = assertThrows(ApiException.class, () -> authService.register(registerRequest));

        assertEquals(HttpStatus.CONFLICT, ex.getStatus());
    }

    @Test
    void loginSuccess() {
        User user = new User();
        user.setId(10L);
        user.setName("Timur");
        user.setLogin("timur");
        user.setPasswordHash("hashed");

        when(userRepository.findByLogin("timur")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("secret123", "hashed")).thenReturn(true);
        when(jwtService.generateToken(10L, "timur", "Timur")).thenReturn("jwt-token");

        AuthResponse response = authService.login(loginRequest);

        assertEquals("jwt-token", response.getToken());
        assertEquals("timur", response.getUser().getLogin());
    }

    @Test
    void loginBadCredentials() {
        when(userRepository.findByLogin("timur")).thenReturn(Optional.empty());

        ApiException ex = assertThrows(ApiException.class, () -> authService.login(loginRequest));

        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatus());
    }

    @Test
    void meReturnsCurrentUser() {
        User user = new User();
        user.setId(10L);
        user.setName("Timur");
        user.setLogin("timur");

        when(userRepository.findByLogin("timur")).thenReturn(Optional.of(user));

        var dto = authService.me(new AuthenticatedUser(10L, "timur", "Timur"));

        assertEquals("timur", dto.getLogin());
        assertEquals("Timur", dto.getName());
    }
}
