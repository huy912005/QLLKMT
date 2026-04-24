package com.Huy.WebBanHang.controller;

import com.Huy.WebBanHang.dto.request.ChiTietGioHangRequest;
import com.Huy.WebBanHang.dto.respoonse.ApiResponse;
import com.Huy.WebBanHang.dto.respoonse.ChiTietGioHangResponse;
import com.Huy.WebBanHang.service.ChiTietGioHangService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/giohang")
@RequiredArgsConstructor
public class GioHangController {
    private final ChiTietGioHangService gioHangService;

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<ChiTietGioHangResponse>>> getGioHang(@PathVariable String userId) {
        List<ChiTietGioHangResponse> data = gioHangService.getUserCart(userId);
        return ResponseEntity.ok(ApiResponse.<List<ChiTietGioHangResponse>>builder().success(true)
                .message("Lấy giỏ hàng thành công!").data(data).build());
    }

    @PostMapping("/{userId}")
    public ResponseEntity<ApiResponse<Object>> themGioHang(@PathVariable String userId, @Valid @RequestBody ChiTietGioHangRequest gioHangRequest) {
        gioHangService.addToCart(userId, gioHangRequest);
        return ResponseEntity.ok(ApiResponse.builder().success(true).message("Đã thêm thành công!").data(null).build());
    }

    @GetMapping("/{userId}/count")
    public ResponseEntity<ApiResponse<Long>> demSoLuongMon(@PathVariable String userId) {
        long count = gioHangService.getCartCount(userId);
        return ResponseEntity
                .ok(ApiResponse.<Long>builder().success(true).message("Lấy số lượng thành công!").data(count).build());
    }

    @DeleteMapping("/{userId}/xoamon/{idSanPham}")
    public ResponseEntity<ApiResponse<Object>> xoaMonHang(@PathVariable String userId, @PathVariable String idSanPham) {
        gioHangService.deleteCartItem(userId, idSanPham);
        return ResponseEntity.ok(ApiResponse.builder().success(true).message("Xóa thành công!").data(null).build());
    }

    @PutMapping("/{userId}/plus/{idSanPham}")
    public ResponseEntity<ApiResponse<Integer>> tangSoLuong(@PathVariable String userId,
            @PathVariable String idSanPham) {
        int soLuongMoi = gioHangService.plus(userId, idSanPham);
        return ResponseEntity
                .ok(ApiResponse.<Integer>builder().success(true).message("Tăng thành công!").data(soLuongMoi).build());
    }

    @PutMapping("/{userId}/minus/{idSanPham}")
    public ResponseEntity<ApiResponse<Integer>> giamSoLuong(@PathVariable String userId,
            @PathVariable String idSanPham) {
        int soLuongMoi = gioHangService.minus(userId, idSanPham);
        return ResponseEntity
                .ok(ApiResponse.<Integer>builder().success(true).message("Giảm thành công!").data(soLuongMoi).build());
    }
}
