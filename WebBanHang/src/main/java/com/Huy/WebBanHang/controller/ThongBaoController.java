package com.Huy.WebBanHang.controller;

import com.Huy.WebBanHang.dto.request.ThongBaoRequest;
import com.Huy.WebBanHang.dto.respoonse.*;
import com.Huy.WebBanHang.service.ThongBaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/thongbao")
@RequiredArgsConstructor
public class ThongBaoController {
    private final ThongBaoService thongBaoService;
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<ThongBaoResponse>>> layDanhSach(@PathVariable String userId) {
        return ResponseEntity.ok(ApiResponse.<List<ThongBaoResponse>>builder().success(true).message("Lấy hòm thư thành công").data(thongBaoService.layDanhSachThongBaoCuaUser(userId)).build());
    }
    @GetMapping("/{userId}/chuadoc")
    public ResponseEntity<ApiResponse<Integer>> demSoChuaDoc(@PathVariable String userId) {
        return ResponseEntity.ok(ApiResponse.<Integer>builder().success(true).message("Dem thanh cong").data(thongBaoService.demSoThongBaoChuaDoc(userId)).build());
    }
    @PostMapping("/gui")
    public ResponseEntity<ApiResponse<ThongBaoResponse>> guiThongBao(@Valid @RequestBody ThongBaoRequest request) {
        return ResponseEntity.ok(ApiResponse.<ThongBaoResponse>builder().success(true).message("Server đã đẩy Thông báo vào màn hình khách").data(thongBaoService.taoThongBao(request)).build());
    }
    @PutMapping("/{idThongBao}/danhdaudadoc")
    public ResponseEntity<ApiResponse<Object>> danhDauDaDoc(@PathVariable int idThongBao) {
        thongBaoService.danhDauDaDoc(idThongBao);
        return ResponseEntity.ok(ApiResponse.builder().success(true).message("Bạn đã xem").data(null).build());
    }
}
