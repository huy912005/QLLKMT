package com.Huy.WebBanHang.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminUpdateUserRequest {
    @NotBlank(message = "Email không được bỏ trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @NotBlank(message = "Số điện thoại không được bỏ trống")
    private String phoneNumber;

    private String password; // Optional
    private String roleName; // Optional
}
