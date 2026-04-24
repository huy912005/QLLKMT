package com.Huy.WebBanHang.entity;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
@Table(name="ChiTietGioHang")
public class ChiTietGioHangEntity {
    @Id
    @Column(name = "idChiTietGioHang")
    private String idChiTietGioHang;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idNguoiDung",nullable = false)
    private ApplicationUserEntity user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idSanPham", nullable = false)
    private SanPhamEntity sanPham;
    @Min(value = 1, message = "Vui lòng nhập từ 1 - 10000")
    @Max(value = 10000, message = "Vui lòng nhập từ 1 - 10000")
    @Column(name = "soLuongTrongGio", nullable = false)
    private int soLuongTrongGio;
}
