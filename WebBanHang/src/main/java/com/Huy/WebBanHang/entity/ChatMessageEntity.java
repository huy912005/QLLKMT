package com.Huy.WebBanHang.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ChatMessages")
@Getter
@Setter
public class ChatMessageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idMessage")
    private Integer idMessage;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idSession", nullable = false)
    private ChatSessionEntity session;
    @Column(name = "role", length = 20, nullable = false)
    private String role; // Phân vai: 'user' hoặc 'bot' đúng không nào?
    @Column(name = "message", columnDefinition = "nvarchar(max)", nullable = false)
    private String message;
    @CreationTimestamp
    @Column(name = "createdAt", updatable = false)
    private LocalDateTime createdAt;
}
