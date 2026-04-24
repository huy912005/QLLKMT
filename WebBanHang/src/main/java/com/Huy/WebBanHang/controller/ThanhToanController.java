package com.Huy.WebBanHang.controller;

import com.Huy.WebBanHang.dto.request.*;
import com.Huy.WebBanHang.dto.respoonse.*;
import com.Huy.WebBanHang.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/thanhtoan")
@RequiredArgsConstructor
public class ThanhToanController {
    private final ThanhToanService thanhToanService;
    @PostMapping("/taomoi")
    public ResponseEntity<ApiResponse<ThanhToanResponse>> taoThanhToan(@Valid @RequestBody ThanhToanRequest request) {
        ThanhToanResponse data = thanhToanService.taoMoiThanhToan(request);
        return ResponseEntity.ok(ApiResponse.<ThanhToanResponse>builder().success(true).message("Khởi tạo bill thanh toán thành công").data(data).build());
    }
    @PutMapping("/xacnhan/{idDonDat}")
    public ResponseEntity<ApiResponse<ThanhToanResponse>> xacNhanThanhToan(@PathVariable String idDonDat, @RequestParam String maGiaoDich) {
        ThanhToanResponse data = thanhToanService.xacNhanThanhToan(idDonDat, maGiaoDich);
        return ResponseEntity.ok(ApiResponse.<ThanhToanResponse>builder().success(true).message("Tuyệt! Khách đã xì tiền!").data(data).build());
    }

}
