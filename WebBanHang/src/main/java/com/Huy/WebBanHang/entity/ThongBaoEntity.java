package com.Huy.WebBanHang.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ThongBao")
@Getter
@Setter
public class ThongBaoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idThongBao")
    private Integer idThongBao;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private ApplicationUserEntity user;
    @Column(name = "tieuDe", length = 200, nullable = false)
    private String tieuDe;
    @Column(name = "noiDung", length = 500, nullable = false)
    private String noiDung;
    @Column(name = "daDoc", nullable = false)
    private boolean daDoc = false;
    // Lấy thời gian tự động của Application Server lúc Insert CSDL
    @CreationTimestamp
    @Column(name = "ngayTao", updatable = false)
    private LocalDateTime ngayTao;
}
