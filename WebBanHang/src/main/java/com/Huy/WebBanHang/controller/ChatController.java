package com.Huy.WebBanHang.controller;

import com.Huy.WebBanHang.dto.request.ChatRequest;
import com.Huy.WebBanHang.dto.respoonse.ChatMessageResponse;
import com.Huy.WebBanHang.security.CustomUserDetails;
import com.Huy.WebBanHang.service.ChatService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;
//    lấy ID từ Token JWT đính kèm dưới Headers
    private String getUserIdFromToken() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof CustomUserDetails) {
            return ((CustomUserDetails) principal).getId();
        }
        throw new RuntimeException("Truy cập bị từ chối: Nguồn xác thực không hợp lệ.");
    }
    @PostMapping("/send")
    public ResponseEntity<Object> send(@RequestBody ChatRequest req) {
        String userId = getUserIdFromToken();
        String userMessage = req.getMessage();
        String fixedReply = "Hệ thống AI Ollama hiện đang trong quá trình lắp rạp lõi Java Spring. Tính năng AI Stream sẽ sớm quay lại!";
        if (userMessage.toLowerCase().contains("chào") || userMessage.toLowerCase().contains("hello")) {
            fixedReply = "Chào bạn, tôi có thể tư vấn linh kiện điện tử hoặc hỗ trợ thông tin giỏ hàng cho bạn (Java Bot).";
        }
        return ResponseEntity.ok(Map.of("reply", fixedReply));
    }
    @GetMapping("/history")
    public ResponseEntity<List<ChatMessageResponse>> history() {
        String userId = getUserIdFromToken();
        int currentSessionId = 1;
        List<ChatMessageResponse> messages = chatService.layLichSuTinNhanTrongPhong(currentSessionId);
        return ResponseEntity.ok(messages);
    }

}

