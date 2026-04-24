package com.Huy.WebBanHang.dto.respoonse;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class YeuCauDoiTraResponse {
    private Integer idYeuCau;
    private String idDonDat;
    private String lyDo;
    private String trangThai;
    private LocalDateTime ngayTao;
}