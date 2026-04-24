package com.Huy.WebBanHang.dto.respoonse;

import lombok.Data;

import java.util.List;

@Data
public class DanhGiaTongHopResponse {
    private Double diemTrungBinh; // VD: 4.8
    private List<DanhGiaResponse> danhGiaList;
}