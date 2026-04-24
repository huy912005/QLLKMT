package com.Huy.WebBanHang.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name="DonDatHang")
public class DonDatHangEntity {
    @Id
    @Column(name = "idDonDat",columnDefinition = "char(5)")
    private String idDonDat;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idNguoiDung",nullable = false)
    private ApplicationUserEntity nguoiDung;
    @Column(name = "sdtGiaoHang",length = 11,nullable = false)
    private String sdtGiaoHang;
    @Column(name = "soNha", length = 50, nullable = false)
    private String soNha;
    @Column(name = "trangThai", length = 20, nullable = false)
    private String trangThai;
    @Column(name = "thanhToan", length = 15, nullable = false)
    private String thanhToan;
    @Column(name = "ngayDat")
    private LocalDateTime ngayDat;
    @Column(name = "ngayThanhToan")
    private LocalDateTime ngayThanhToan;
    @Column(name = "ngayGiaoDuKien")
    private LocalDateTime ngayGiaoDuKien;
    @Column(name = "daThanhToan", nullable = false)
    private boolean daThanhToan = false;
    // Quan hệ 1-Nhiều với ChiTietDonHang. mappedBy chính là tên file property viết ở class ghép nối
    @OneToMany(mappedBy = "donDatHang", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<ChiTietDonHangEntity> chiTietDonHangs;
}
