package com.Huy.WebBanHang.dto.respoonse;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatSessionResponse {
    private int idSession;
    private String userId;
    private String title;
    private LocalDateTime createdAt;
}
