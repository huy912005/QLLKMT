package com.Huy.WebBanHang.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ThanhToan")
@Getter
@Setter
public class ThanhToanEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Tư duy mới: Khóa chính tự tăng (Auto Increment)
    @Column(name = "idThanhToan")
    private Integer idThanhToan;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idDonDat", nullable = false)
    private DonDatHangEntity donDatHang;
    @Column(name = "phuongThuc")
    private String phuongThuc;
    @Column(name = "soTien")
    private BigDecimal soTien;
    @Column(name = "daThanhToan")
    private boolean daThanhToan = false;
    @Column(name = "ngayThanhToan")
    private LocalDateTime ngayThanhToan;
    @Column(name = "maGiaoDich")
    private String maGiaoDich;
}
