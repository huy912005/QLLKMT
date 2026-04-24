package com.Huy.WebBanHang.controller;

import com.Huy.WebBanHang.dto.request.LoaiSanPhamRequest;
import com.Huy.WebBanHang.dto.respoonse.*;
import com.Huy.WebBanHang.service.LoaiSanPhamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loaisanpham")
@RequiredArgsConstructor
public class LoaiSanPhamController {
    private final LoaiSanPhamService loaiSanPhamService;
    @GetMapping
    public ResponseEntity<ApiResponse<List<LoaiSanPhamResponse>>> layTatCa() {
        List<LoaiSanPhamResponse> data = loaiSanPhamService.getAllLoaiSanPham();
        ApiResponse<List<LoaiSanPhamResponse>> apiResponse = ApiResponse.<List<LoaiSanPhamResponse>>builder().success(true).message("Lấy danh mục sản phẩm thành công").data(data).build();
        return ResponseEntity.ok(apiResponse);
    }
    @PostMapping("/upsert")
    public ResponseEntity<ApiResponse<LoaiSanPhamResponse>> themHoacSua(@Valid @RequestBody LoaiSanPhamRequest request) {
        LoaiSanPhamResponse data = loaiSanPhamService.createOrUpdate(request);
        ApiResponse<LoaiSanPhamResponse> apiResponse = ApiResponse.<LoaiSanPhamResponse>builder().success(true).message("Lưu danh mục thành công").data(data).build();
        return ResponseEntity.ok(apiResponse);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> xoaLoaiSanPham(@PathVariable String id) {
        loaiSanPhamService.deleteLoaiSanPham(id);
        ApiResponse<Object> apiResponse = ApiResponse.builder().success(true).message("Xóa danh mục thành công!").data(null).build();
        return ResponseEntity.ok(apiResponse);
    }
}