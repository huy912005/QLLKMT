package com.Huy.WebBanHang.dto.respoonse;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ThongBaoResponse {
    private int idThongBao;
    private String userId;
    private String tieuDe;
    private String noiDung;
    private boolean daDoc;
    private LocalDateTime ngayTao;
}
