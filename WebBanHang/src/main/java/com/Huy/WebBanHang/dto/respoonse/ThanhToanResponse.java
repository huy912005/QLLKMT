package com.Huy.WebBanHang.dto.respoonse;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ThanhToanResponse {
    private int idThanhToan;
    private String idDonDat;
    private String phuongThuc;
    private BigDecimal soTien;
    private boolean daThanhToan;
    private LocalDateTime ngayThanhToan;
    private String maGiaoDich;
}