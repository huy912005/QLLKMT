package com.Huy.WebBanHang.controller;

import com.Huy.WebBanHang.dto.respoonse.ApiResponse;
import com.Huy.WebBanHang.dto.respoonse.TinhResponse;
import com.Huy.WebBanHang.dto.respoonse.XaPhuongResponse;
import com.Huy.WebBanHang.service.DiaChiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/diachi")
@RequiredArgsConstructor
public class DiaChiController {
    private final DiaChiService diaChiService;
    @GetMapping("/tinh")
    public ResponseEntity<ApiResponse<List<TinhResponse>>> layDanhSachTinh() {
        List<TinhResponse> data = diaChiService.layTatCaTinhThanh();
        ApiResponse<List<TinhResponse>> response = ApiResponse.<List<TinhResponse>>builder().success(true).message("Lấy danh sách Tỉnh thành công").data(data).build();
        return ResponseEntity.ok(response);
    }
    @GetMapping("/xa/{idTinh}")
    public ResponseEntity<ApiResponse<List<XaPhuongResponse>>> layDanhSachXa(@PathVariable String idTinh) {
        List<XaPhuongResponse> data = diaChiService.layXaPhuongTheoTinh(idTinh);
        ApiResponse<List<XaPhuongResponse>> response = ApiResponse.<List<XaPhuongResponse>>builder().success(true).message("Lấy danh sách Xã thành công").data(data).build();
        return ResponseEntity.ok(response);
    }
}
