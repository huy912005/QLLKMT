package com.Huy.WebBanHang.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChatMessageRequest {
    @NotNull(message = "ID của Phiên chat là bắt buộc")
    private Integer idSession;
    @NotBlank(message = "Vui lòng cung cấp Role (user hoặc admin)")
    private String role;
    @NotBlank(message = "Nội dung tin nhắn không được để trống")
    private String message;
}
