package com.Huy.WebBanHang.controller;

import com.Huy.WebBanHang.dto.request.CongTyRequest;
import com.Huy.WebBanHang.dto.respoonse.ApiResponse;
import com.Huy.WebBanHang.dto.respoonse.CongTyResponse;
import com.Huy.WebBanHang.service.CongTyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/congty")
@RequiredArgsConstructor
public class CongTyController {

    private final CongTyService congTyService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CongTyResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.<List<CongTyResponse>>builder().success(true).message("Lấy danh sách công ty (Hãng) thành công").data(congTyService.getAllCongTy()).build());
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CongTyResponse>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.<CongTyResponse>builder().success(true).message("Tìm công ty thành công").data(congTyService.getCongTyById(id)).build());
    }
    @PostMapping
    public ResponseEntity<ApiResponse<CongTyResponse>> create(@Valid @RequestBody CongTyRequest request) {
        return ResponseEntity.ok(ApiResponse.<CongTyResponse>builder().success(true).message("Thêm công ty thành công").data(congTyService.createOrUpdate(request)).build());
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CongTyResponse>> update(@PathVariable String id, @Valid @RequestBody CongTyRequest request) {
        request.setIdCongTy(id);
        return ResponseEntity.ok(ApiResponse.<CongTyResponse>builder().success(true).message("Cập nhật công ty thành công").data(congTyService.createOrUpdate(request)).build());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable String id) {
        congTyService.deleteCongTy(id);
        return ResponseEntity.ok(ApiResponse.builder().success(true).message("Xóa công ty thành công").data(null).build());
    }
}
