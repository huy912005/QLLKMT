package com.Huy.WebBanHang.dto.respoonse;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SanPhamResponse {
    private String idSanPham;
    private String tenSanPham;
    private BigDecimal gia;
    private int soLuongHienCon;
    private String imageURL;
    private String imageLienQuan;
    private String moTa;
    private String thongSoSanPham;
    // Tên hiển thị
    private String tenCongTy;
    private String tenLoaiSanPham;
    // ID để form edit có thể pre-select dropdown
    private String idCongTy;
    private String idLoaiSanPham;
}
