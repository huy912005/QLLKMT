package com.Huy.WebBanHang.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ThanhToanRequest {
    private String idDonDat;
    private String phuongThuc;
    private BigDecimal soTien;
}
