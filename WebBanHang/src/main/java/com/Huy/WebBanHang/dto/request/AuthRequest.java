package com.Huy.WebBanHang.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AuthRequest {
    @NotBlank(message = "Tài khoản không được để trống")
    private String username;
    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;
}