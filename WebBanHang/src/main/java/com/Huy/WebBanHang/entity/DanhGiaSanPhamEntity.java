package com.Huy.WebBanHang.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "DanhGiaSanPham")
@Getter
@Setter
public class DanhGiaSanPhamEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idDanhGia")
    private Integer idDanhGia;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idSanPham", nullable = false)
    private SanPhamEntity sanPham;
    // Chú ý tên map lại cột: C# dùng userId, nên đây map theo userId
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private ApplicationUserEntity user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idDonDat")
    private DonDatHangEntity donDatHang;
    @Min(1)
    @Max(5)
    @Column(name = "soSao", nullable = false)
    private int soSao;
    @Column(name = "noiDung", length = 500)
    private String noiDung;
    // Lấy thời gian tự động của Application Server lúc Insert CSDL
    @CreationTimestamp
    @Column(name = "ngayDanhGia", updatable = false)
    private LocalDateTime ngayDanhGia;
    @OneToMany(mappedBy = "danhGiaSanPham", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<HinhAnhDanhGiaEntity> hinhAnhDanhGias;
}
