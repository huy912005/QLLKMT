package com.Huy.WebBanHang.controller;

import com.Huy.WebBanHang.dto.request.AuthRequest;
import com.Huy.WebBanHang.dto.respoonse.ApiResponse;
import com.Huy.WebBanHang.dto.respoonse.AuthResponse;
import com.Huy.WebBanHang.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth") // Route chễm chệ ngay trước Cửa nhà, được tha bổng trong SecurityConfig
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse tokenInfo = authService.login(request);
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("Đăng nhập thành công!")
                .data(tokenInfo)
                .build());
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody com.Huy.WebBanHang.dto.request.RegisterRequest request) {
        AuthResponse tokenInfo = authService.register(request);
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("Đăng ký thành công!")
                .data(tokenInfo)
                .build());
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Object>> forgotPassword(@Valid @RequestBody com.Huy.WebBanHang.dto.request.ForgotPasswordRequest request) {
        try {
            authService.forgotPassword(request);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("Nếu email tồn tại, một hướng dẫn khôi phục sẽ được gửi!")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder()
                    .success(false)
                    .message(e.getMessage())
                    .build());
        }
    }

    /**
     * [CHỈ DÙNG KHI DEV] Đặt lại password cho user cũ từ C# sang BCrypt
     * POST /api/auth/reset-password-dev
     * Body: { "username": "admin", "password": "matkhaumoi123" }
     */
    @PostMapping("/reset-password-dev")
    public ResponseEntity<ApiResponse<Object>> resetPasswordDev(@RequestBody AuthRequest request) {
        authService.resetPasswordDev(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Đã đặt lại mật khẩu BCrypt cho user: " + request.getUsername())
                .build());
    }
}
