package com.Huy.WebBanHang.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminCreateUserRequest {
    @NotBlank(message = "Tên tài khoản không được bỏ trống")
    private String userName;

    @NotBlank(message = "Email không được bỏ trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @NotBlank(message = "Mật khẩu không được bỏ trống")
    private String password;

    @NotBlank(message = "Số điện thoại không được bỏ trống")
    private String phoneNumber;

    private String roleName;
}
