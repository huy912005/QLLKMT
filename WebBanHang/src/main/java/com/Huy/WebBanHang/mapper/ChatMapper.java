package com.Huy.WebBanHang.mapper;

import com.Huy.WebBanHang.dto.request.ChatMessageRequest;
import com.Huy.WebBanHang.dto.request.ChatSessionRequest;
import com.Huy.WebBanHang.dto.respoonse.ChatMessageResponse;
import com.Huy.WebBanHang.dto.respoonse.ChatSessionResponse;
import com.Huy.WebBanHang.entity.ChatMessageEntity;
import com.Huy.WebBanHang.entity.ChatSessionEntity;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ChatMapper {
    // Ánh xạ Session
    @Mapping(target = "idSession", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    ChatSessionEntity toSessionEntity(ChatSessionRequest request);
    @Mapping(source = "user.id", target = "userId")
    ChatSessionResponse toSessionResponse(ChatSessionEntity entity);
    // Ánh xạ Message
    @Mapping(target = "idMessage", ignore = true)
    @Mapping(target = "session", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    ChatMessageEntity toMessageEntity(ChatMessageRequest request);
    ChatMessageResponse toMessageResponse(ChatMessageEntity entity);
}
