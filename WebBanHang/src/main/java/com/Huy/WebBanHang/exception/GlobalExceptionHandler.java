package com.Huy.WebBanHang.exception;

import com.Huy.WebBanHang.dto.respoonse.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

        // 1. Bắt lỗi @Valid (thiếu field, sai format...)
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ApiResponse<Object>> handleValidationException(MethodArgumentNotValidException ex) {
                String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                                .map(error -> error.getDefaultMessage())
                                .collect(Collectors.joining(", "));
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body(ApiResponse.builder().success(false)
                                                .message("Lỗi kiểm tra dữ liệu: " + errorMessage).data(null).build());
        }

        // 2. Bắt lỗi xác thực (Sai mật khẩu, tài khoản không tồn tại...) → 401
        @ExceptionHandler(AuthenticationException.class)
        public ResponseEntity<ApiResponse<Object>> handleAuthenticationException(AuthenticationException ex) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(ApiResponse.builder().success(false)
                                                .message("Tên đăng nhập hoặc mật khẩu không đúng!").data(null).build());
        }

        // 3. Bắt RuntimeException từ Service (tài khoản đã tồn tại, email đã dùng...) →
        // 400
        @ExceptionHandler(RuntimeException.class)
        public ResponseEntity<ApiResponse<Object>> handleRuntimeException(RuntimeException ex) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body(ApiResponse.builder().success(false).message(ex.getMessage()).data(null).build());
        }

        // 4. Bắt lỗi hệ thống không xác định → 500
        @ExceptionHandler(Exception.class)
        public ResponseEntity<ApiResponse<Object>> handleGeneralException(Exception ex) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(ApiResponse.builder().success(false)
                                                .message("Có lỗi hệ thống xảy ra, vui lòng báo Admin: "
                                                                + ex.getMessage())
                                                .data(null).build());
        }
}
