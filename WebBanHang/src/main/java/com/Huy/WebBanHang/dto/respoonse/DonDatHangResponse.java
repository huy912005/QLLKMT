package com.Huy.WebBanHang.dto.respoonse;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonDatHangResponse {
    private String idDonDat;
    
    private String idNguoiDung;
    private String tenNguoiDung;
    
    private String sdtGiaoHang;
    private String soNha;
    
    private String trangThai; // CHO_XAC_NHAN, DA_GIAO, etc.
    private String thanhToan; // COD, MOMO, etc.
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime ngayDat;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime ngayThanhToan;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime ngayGiaoDuKien;
    
    private boolean daThanhToan;
    
    private BigDecimal tongTien;
    
    private List<ChiTietDonHangResponse> chiTietDonHangs;
}
