package com.Huy.WebBanHang.dto.respoonse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietGioHangResponse {
    private String idChiTietGioHang;
    private String idNguoiDung;
    private String idSanPham;
    private Integer soLuongTrongGio;
    private SanPhamResponse sanPham;
}
