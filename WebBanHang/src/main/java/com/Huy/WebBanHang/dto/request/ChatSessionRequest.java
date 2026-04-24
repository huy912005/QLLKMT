package com.Huy.WebBanHang.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChatSessionRequest {
    @NotBlank(message = "ID User không được để trống")
    private String userId;
    private String title;
}