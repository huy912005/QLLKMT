package com.Huy.WebBanHang.controller;

import com.Huy.WebBanHang.dto.request.DanhGiaRequest;
import com.Huy.WebBanHang.dto.respoonse.ApiResponse;
import com.Huy.WebBanHang.security.CustomUserDetails;
import com.Huy.WebBanHang.service.DanhGiaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/DanhGia")
@RequiredArgsConstructor
public class DanhGiaSanPhamController {
    private final DanhGiaService danhGiaService;
    private String getUserIdFromToken() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) auth.getPrincipal()).getId();
        }
        return null;
    }
    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getDanhGia(@RequestParam("idSanPham") String idSanPham) {
        Object data = danhGiaService.getDanhGiaBySanPham(idSanPham);
        return ResponseEntity.ok(ApiResponse.builder().success(true).message("Tải đánh giá thành công").data(data).build());
    }
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<ApiResponse<Object>> submitDanhGia(@Valid @ModelAttribute DanhGiaRequest request) throws IOException {
        String userId = getUserIdFromToken();
        if (userId == null)
            throw new RuntimeException("Bạn cần đăng nhập để gửi đánh giá.");
        danhGiaService.taoDanhGia(userId,request);
        return ResponseEntity.ok(ApiResponse.builder().success(true).message("Đánh giá sản phẩm thành công! Xin cảm ơn.").data(null).build());
    }
}
