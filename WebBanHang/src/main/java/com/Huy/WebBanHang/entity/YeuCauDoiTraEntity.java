package com.Huy.WebBanHang.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "YeuCauDoiTra")
@Getter
@Setter
public class YeuCauDoiTraEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idYeuCau")
    private Integer idYeuCau;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idDonDat", nullable = false)
    private DonDatHangEntity donDatHang;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private ApplicationUserEntity user;
    @Column(name = "lyDo", length = 300, nullable = false)
    private String lyDo;
    @Column(name = "trangThai", length = 20, nullable = false)
    private String trangThai;
    @CreationTimestamp
    @Column(name = "ngayTao", updatable = false)
    private LocalDateTime ngayTao;
}
