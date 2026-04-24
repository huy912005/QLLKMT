package com.Huy.WebBanHang.repository;

import com.Huy.WebBanHang.entity.ChatSessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSessionEntity, Integer> {
    // Lấy tất cả phiên Chat của 1 User để hiện ở màn hình Lịch sử hỗ trợ
    List<ChatSessionEntity> findByUser_IdOrderByCreatedAtDesc(String userId);
}