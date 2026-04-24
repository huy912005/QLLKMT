package com.Huy.WebBanHang.dto.respoonse;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class DanhGiaResponse {
    private String userName;
    private int soSao;
    private String noiDung;
    private LocalDateTime ngayDanhGia;
    private List<String> imageUrls;
}
