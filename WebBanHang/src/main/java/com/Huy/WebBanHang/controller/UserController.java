package com.Huy.WebBanHang.controller;

import com.Huy.WebBanHang.dto.request.AdminCreateUserRequest;
import com.Huy.WebBanHang.dto.respoonse.ApiResponse;
import com.Huy.WebBanHang.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<Object> getAll() {
        return ResponseEntity.ok(userService.getAllUsers()); // Match exactly the C# output format
    }

    @GetMapping("/roles")
    public ResponseEntity<Object> getRoles() {
        return ResponseEntity.ok(userService.getAllRoles());
    }

    @GetMapping("/debug-tables")
    public ResponseEntity<Object> debugTables() {
        return ResponseEntity.ok(userService.getDatabaseTables());
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Object>> createUser(@Valid @RequestBody AdminCreateUserRequest request) {
        try {
            userService.createUser(request);
            return ResponseEntity.ok(ApiResponse.builder().success(true).message("Tạo tài khoản thành công").build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder().success(false).message(e.getMessage()).build());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> updateUser(@PathVariable String id, @Valid @RequestBody com.Huy.WebBanHang.dto.request.AdminUpdateUserRequest request) {
        try {
            userService.updateUser(id, request);
            return ResponseEntity.ok(ApiResponse.builder().success(true).message("Cập nhật thông tin thành công").build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder().success(false).message(e.getMessage()).build());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteUser(@PathVariable String id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(ApiResponse.builder().success(true).message("Xóa tài khoản thành công").build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder().success(false).message(e.getMessage()).build());
        }
    }
}
