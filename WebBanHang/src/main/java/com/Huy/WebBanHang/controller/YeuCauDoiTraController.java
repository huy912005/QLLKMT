package com.Huy.WebBanHang.controller;

import com.Huy.WebBanHang.dto.request.YeuCauDoiTraRequest;
import com.Huy.WebBanHang.dto.respoonse.ApiResponse;
import com.Huy.WebBanHang.dto.respoonse.YeuCauDoiTraResponse;
import com.Huy.WebBanHang.security.CustomUserDetails;
import com.Huy.WebBanHang.service.YeuCauDoiTraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/YeuCauDoiTra")
@RequiredArgsConstructor
public class YeuCauDoiTraController {
    private final YeuCauDoiTraService yeuCauDoiTraService;
//    Trích xuất ID từ JWT.
    private String getUserIdFromToken() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof CustomUserDetails)
            return ((CustomUserDetails) principal).getId();
        throw new RuntimeException("Lỗi xác thực: Vui lòng đăng nhập lại.");
    }
    @PostMapping
    public ResponseEntity<ApiResponse<Object>> taoYeuCau(@Valid @ModelAttribute YeuCauDoiTraRequest request) {
        String userId = getUserIdFromToken();
        yeuCauDoiTraService.taoYeuCauDoiTra(userId, request);
        return ResponseEntity.ok(ApiResponse.builder().success(true).message("Gửi yêu cầu đổi trả thành công!").data(null).build());
    }
    @GetMapping("/get-my-requests")
    public ResponseEntity<ApiResponse<List<YeuCauDoiTraResponse>>> getMyRequests() {
        String userId = getUserIdFromToken();
        List<YeuCauDoiTraResponse> data = yeuCauDoiTraService.layDanhSachYeuCauCuaUser(userId);
        return ResponseEntity.ok(ApiResponse.<List<YeuCauDoiTraResponse>>builder().success(true).message("Lấy danh sách yêu cầu đổi trả thành công.").data(data).build());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> huyYeuCau(@PathVariable("id") int id) {
        // LƯU Ý: Hiện tại Service bạn hình như chưa có hàm huyYeuCau(id, userId).
        // Hãy tự mở YeuCauDoiTraService thêm hàm huyYeuCau vào nhé.
        String userId = getUserIdFromToken();
         yeuCauDoiTraService.huyYeuCau(id, userId);
        return ResponseEntity.ok(ApiResponse.builder().success(true).message("Đã hủy yêu cầu thành công.").data(null).build());
    }
}
