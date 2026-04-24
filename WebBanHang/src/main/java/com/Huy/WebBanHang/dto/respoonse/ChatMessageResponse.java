package com.Huy.WebBanHang.dto.respoonse;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatMessageResponse {
    private int idMessage;
    private String role;
    private String message;
    private LocalDateTime createdAt;
}