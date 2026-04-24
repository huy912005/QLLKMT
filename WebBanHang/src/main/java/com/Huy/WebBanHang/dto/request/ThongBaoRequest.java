package com.Huy.WebBanHang.dto.request;

import lombok.Data;

@Data
public class ThongBaoRequest {
    private String userId; // ID người nhận
    private String tieuDe;
    private String noiDung;
}