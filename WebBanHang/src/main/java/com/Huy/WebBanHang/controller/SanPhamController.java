package com.Huy.WebBanHang.controller;

import com.Huy.WebBanHang.dto.respoonse.ApiResponse;
import com.Huy.WebBanHang.dto.respoonse.SanPhamResponse;
import com.Huy.WebBanHang.service.SanPhamService;
import lombok.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/sanpham")
@RequiredArgsConstructor
public class SanPhamController {
    private final SanPhamService sanPhamService;
    @GetMapping
    public ResponseEntity< ApiResponse<List<SanPhamResponse>>> getAll(){
        return ResponseEntity.ok(ApiResponse.<List<SanPhamResponse>>builder().success(true).message("Lấy danh sách thành công").data(sanPhamService.getAllSanPham()).build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SanPhamResponse>> getById(@PathVariable String id) {
        try {
            SanPhamResponse sanPham = sanPhamService.getSanPhamById(id);
            return ResponseEntity.ok(ApiResponse.<SanPhamResponse>builder().success(true).data(sanPham).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.<SanPhamResponse>builder().success(false).message(e.getMessage()).build());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable String id) {
        try {
            sanPhamService.deleteSanPham(id);
            return ResponseEntity.ok(ApiResponse.builder().success(true).message("Xóa sản phẩm thành công").build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder().success(false).message(e.getMessage()).build());
        }
    }

    @PostMapping(value = "/upsert", consumes = {"multipart/form-data"})
    public ResponseEntity<ApiResponse<Object>> upsert(@ModelAttribute com.Huy.WebBanHang.dto.sanPham.SanPhamUpsertDto dto) {
        try {
            sanPhamService.upsertSanPham(dto);
            return ResponseEntity.ok(ApiResponse.builder().success(true).message("Lưu sản phẩm thành công!").data(null).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder().success(false).message(e.getMessage()).build());
        }
    }
}
