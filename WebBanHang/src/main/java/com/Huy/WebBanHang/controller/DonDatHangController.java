package com.Huy.WebBanHang.controller;

import com.Huy.WebBanHang.dto.request.DonHangRequest;
import com.Huy.WebBanHang.dto.respoonse.ApiResponse;
import com.Huy.WebBanHang.dto.respoonse.DonDatHangResponse;
import com.Huy.WebBanHang.service.DonDatHangService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dondathang")
@RequiredArgsConstructor
public class DonDatHangController {
    private final DonDatHangService donDatHangService;

    // ================== 1. CUSTOMER - ĐẶT HÀNG ==================
    @PostMapping("/checkout/{userId}")
    public ResponseEntity<ApiResponse<String>> datHang(@PathVariable String userId, @Valid @RequestBody DonHangRequest request) {
        // Service sẽ quét DB giỏ hàng, trừ tiền, tạo đơn xuất mã D[xxxxx]
        String maDonHangMoi = donDatHangService.checkout(userId, request);
        // Trả ra Mã đơn hàng để Front-end chuyển hướng (Navigate) sang trang Báo Chúc mừng thành công!
        ApiResponse<String> apiResponse = ApiResponse.<String>builder()
                .success(true)
                .message("Đặt hàng thành công!")
                .data(maDonHangMoi)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    // ================== 2. CUSTOMER - DANH SÁCH ĐƠN HÀNG CỦA USER ==================
    @GetMapping("/my-orders/{userId}")
    public ResponseEntity<ApiResponse<List<DonDatHangResponse>>> getMyOrders(@PathVariable String userId) {
        List<DonDatHangResponse> orders = donDatHangService.getOrdersByUserId(userId);
        return ResponseEntity.ok(ApiResponse.<List<DonDatHangResponse>>builder()
                .success(true)
                .message("Lấy danh sách đơn hàng thành công")
                .data(orders)
                .build());
    }

    // ================== 3. CUSTOMER - CHI TIẾT ĐƠN HÀNG ==================
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<DonDatHangResponse>> getOrderDetail(@PathVariable String orderId) {
        DonDatHangResponse order = donDatHangService.getOrderById(orderId);
        return ResponseEntity.ok(ApiResponse.<DonDatHangResponse>builder()
                .success(true)
                .message("Lấy chi tiết đơn hàng thành công")
                .data(order)
                .build());
    }

    // ================== 4. ADMIN - DANH SÁCH TẤT CẢ ĐƠN HÀNG ==================
    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<List<DonDatHangResponse>>> getAllOrders() {
        List<DonDatHangResponse> orders = donDatHangService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.<List<DonDatHangResponse>>builder()
                .success(true)
                .message("Lấy danh sách tất cả đơn hàng thành công")
                .data(orders)
                .build());
    }

    // ================== 5. ADMIN - CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG ==================
    /**
     * Cập nhật trạng thái đơn hàng
     * Query Parameters: ?newStatus=DA_GIAO
     * Các trạng thái hợp lệ: CHO_XAC_NHAN, DA_GIAO, DA_HUY, DANG_GIAO, TRA_LAI
     */
    @PutMapping("/{orderId}/trangthai")
    public ResponseEntity<ApiResponse<Object>> capNhatTrangThai(
            @PathVariable String orderId,
            @RequestParam String newStatus) {
        donDatHangService.updateOrderStatus(orderId, newStatus);
        ApiResponse<Object> apiResponse = ApiResponse.builder()
                .success(true)
                .message("Đã cập nhật đơn hàng thành: " + newStatus)
                .data(null)
                .build();
        return ResponseEntity.ok(apiResponse);
    }
    // ================== 6. CUSTOMER - HỦY ĐƠN HÀNG ==================
    @PutMapping("/{orderId}/cancel/{userId}")
    public ResponseEntity<ApiResponse<String>> cancelOrder(@PathVariable String orderId, @PathVariable String userId) {
        donDatHangService.cancelOrder(userId, orderId);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("Hủy đơn hàng thành công!")
                .data(null)
                .build());
    }

    // ================== 7. CUSTOMER - MUA LẠI ĐƠN HÀNG ==================
    @PostMapping("/{orderId}/reorder/{userId}")
    public ResponseEntity<ApiResponse<String>> reorder(@PathVariable String orderId, @PathVariable String userId) {
        donDatHangService.reorder(userId, orderId);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("Đã thêm các sản phẩm vào giỏ hàng!")
                .data(null)
                .build());
    }

    // ================== 8. ADMIN - XÓA ĐƠN HÀNG ==================
    @DeleteMapping("/admin/{orderId}")
    public ResponseEntity<ApiResponse<Object>> deleteOrder(@PathVariable String orderId) {
        donDatHangService.deleteOrder(orderId);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Đã xóa đơn hàng thành công")
                .data(null)
                .build());
    }
}
