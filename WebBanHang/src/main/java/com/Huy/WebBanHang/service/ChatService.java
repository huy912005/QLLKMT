package com.Huy.WebBanHang.service;

import com.Huy.WebBanHang.dto.request.*;
import com.Huy.WebBanHang.dto.respoonse.*;
import com.Huy.WebBanHang.entity.*;
import com.Huy.WebBanHang.mapper.ChatMapper;
import com.Huy.WebBanHang.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ApplicationUserRepository userRepository;
    private final ChatMapper chatMapper;
    /* --- TẠO MỚI MỘT PHÒNG CHAT (KHI ẤN NÚT HỖ TRỢ) --- */
    @Transactional
    public ChatSessionResponse taoPhienChatMoi(ChatSessionRequest request) {
        ApplicationUserEntity user = userRepository.findById(request.getUserId()).orElseThrow(() -> new RuntimeException("Không tìm thấy account User này"));
        ChatSessionEntity session = chatMapper.toSessionEntity(request);
        session.setUser(user);
        session.setCreatedAt(LocalDateTime.now());
        // Default Logic nếu Title bị gửi lên chữ trống rỗng
        if (session.getTitle() == null || session.getTitle().trim().isEmpty())
            session.setTitle("Cuộc trò chuyện mới (" + LocalDateTime.now() + ")");
        return chatMapper.toSessionResponse(chatSessionRepository.save(session));
    }
    /* --- KHÁCH / ADMIN BẮN TIN NHẮN VÀO PHÒNG --- */
    @Transactional
    public ChatMessageResponse guiTinNhan(ChatMessageRequest request) {
        ChatSessionEntity session = chatSessionRepository.findById(request.getIdSession()).orElseThrow(() -> new RuntimeException("Phòng chat đã kết thúc hoặc không tồn tại!"));
        ChatMessageEntity message = chatMapper.toMessageEntity(request);
        message.setSession(session);
        message.setCreatedAt(LocalDateTime.now());
        return chatMapper.toMessageResponse(chatMessageRepository.save(message));
    }
    /* --- LOAD TIN NHẮN LÊN MÀN HÌNH THEO THỜI GIAN NHẮN --- */
    @Transactional(readOnly = true)
    public List<ChatMessageResponse> layLichSuTinNhanTrongPhong(int idSession) {
        return chatMessageRepository.findBySession_IdSessionOrderByCreatedAtAsc(idSession).stream().map(chatMapper::toMessageResponse).collect(Collectors.toList());
    }
}
