package com.Huy.WebBanHang.repository;

import com.Huy.WebBanHang.entity.ChatMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Integer> {
    // Lấy nội dung chat trong 1 phòng (Session) và sắp xếp Cũ -> Mới (Asc) để trải từ trên xuống dưới
    List<ChatMessageEntity> findBySession_IdSessionOrderByCreatedAtAsc(int idSession);
}
