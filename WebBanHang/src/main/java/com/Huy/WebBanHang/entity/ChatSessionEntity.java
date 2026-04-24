package com.Huy.WebBanHang.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ChatSessions")
@Getter
@Setter
public class ChatSessionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idSession")
    private Integer idSession;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private ApplicationUserEntity user;
    @Column(name = "title", length = 200)
    private String title = "Cuộc trò chuyện mới";
    @CreationTimestamp
    @Column(name = "createdAt", updatable = false)
    private LocalDateTime createdAt;
}
