package com.Huy.WebBanHang.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "SanPham")
@Getter
@Setter
public class SanPhamEntity {
    @Id
    @Column(name = "idSanPham", columnDefinition = "char(5)")
    private String idSanPham;
    @Column(name = "tenSanPham", nullable = false)
    private String tenSanPham;
    @Column(name = "imageURL")
    private String imageURL;
    @Column(name = "imageLienQuan")
    private String imageLienQuan;
    @Column(name = "moTa", columnDefinition = "nvarchar(max)")
    private String moTa;
    @Column(name = "thongSoSanPham")
    private String thongSoSanPham;
    @Column(name = "gia")
    private BigDecimal gia;
    @Column(name = "soLuongCanDuoi")
    private int soLuongCanDuoi;
    @Column(name = "soLuongHienCon")
    private int soLuongHienCon;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idCongTy", nullable = false)
    private CongTyEntity congTy;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idLoaiSanPham", nullable = false)
    private LoaiSanPhamEntity loaiSanPham;
}
