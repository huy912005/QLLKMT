package com.Huy.WebBanHang.dto.respoonse;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChiTietDonHangResponse {
    private String idSanPham;
    private String tenSanPham;
    private String imageURL;
    
    private int soLuong;
    
    private BigDecimal donGia; // Giá tại thời điểm đặt hàng
    
    private BigDecimal thanhTien; // soLuong * donGia
}
