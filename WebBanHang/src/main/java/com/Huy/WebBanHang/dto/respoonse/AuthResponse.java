package com.Huy.WebBanHang.dto.respoonse;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;     // Trả cục Token này về để React/Mobile nhét vào LocalStorage
    private String username;
    private String userId;    // Thêm userId để frontend dùng cho giỏ hàng
}
