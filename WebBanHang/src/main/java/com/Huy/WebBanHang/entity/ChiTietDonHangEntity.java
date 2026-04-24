package com.Huy.WebBanHang.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@Table(name="ChiTietDonHang")
@IdClass(ChiTietDonHangId.class)//cho JPA biết có khóa chính kép
public class ChiTietDonHangEntity {
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idDonDat")
    private DonDatHangEntity donDatHang;
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idSanPham")
    private SanPhamEntity sanPham;
    @Column(name="soLuong")
    private int soLuong;
    @Column(name="donGia")
    private BigDecimal donGia;
}
