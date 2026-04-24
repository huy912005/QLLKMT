package com.Huy.WebBanHang.controller;

import com.Huy.WebBanHang.dto.request.MomoPaymentRequest;
import com.Huy.WebBanHang.dto.respoonse.ApiResponse;
import com.Huy.WebBanHang.dto.respoonse.MomoPaymentResponse;
import com.Huy.WebBanHang.service.CheckoutService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * CheckoutController
 *
 * Các endpoint React gọi:
 *   POST /api/checkout/confirm          → Đặt hàng COD
 *   POST /api/checkout/momo/create      → Tạo link MoMo
 *   POST /api/checkout/momo/ipn         → MoMo server callback (IPN)
 */
@Slf4j
@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    private final CheckoutService checkoutService;

    // ─────────────────────────────────────────────────────────
    // POST /api/checkout/confirm
    // React gọi khi chọn COD → Đặt hàng + tạo bản ghi ThanhToan
    // ─────────────────────────────────────────────────────────
    @PostMapping("/confirm")
    public ResponseEntity<ApiResponse<Map<String, String>>> confirmOrder(
            @AuthenticationPrincipal UserDetails userDetails) {

        String userId = userDetails.getUsername(); // = idNguoiDung stored in JWT
        String orderId = checkoutService.confirmCodOrder(userId);

        Map<String, String> data = new HashMap<>();
        data.put("orderId", orderId);

        return ResponseEntity.ok(
            ApiResponse.<Map<String, String>>builder()
                .success(true)
                .message("Đặt hàng COD thành công!")
                .data(data)
                .build()
        );
    }

    // ─────────────────────────────────────────────────────────
    // POST /api/checkout/momo/create
    // React gọi khi chọn MoMo → Tạo đơn hàng + lấy payUrl MoMo
    // ─────────────────────────────────────────────────────────
    @PostMapping("/momo/create")
    public ResponseEntity<MomoPaymentResponse> createMomoPayment(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody MomoPaymentRequest request) {

        String userId = userDetails.getUsername();
        MomoPaymentResponse response = checkoutService.createMomoPayment(userId, request);

        return ResponseEntity.ok(response);
    }

    // ─────────────────────────────────────────────────────────
    // POST /api/checkout/momo/ipn
    // MoMo server gọi vào đây sau khi thanh toán xong (server-to-server)
    // Endpoint này KHÔNG cần JWT → permitAll trong SecurityConfig
    // ─────────────────────────────────────────────────────────
    @PostMapping("/momo/ipn")
    public ResponseEntity<Map<String, Object>> handleMomoIpn(
            @RequestBody Map<String, String> params,
            HttpServletRequest request) {

        log.info("[IPN] Received MoMo IPN from {}: {}", request.getRemoteAddr(), params);
        checkoutService.handleMomoIpn(params);

        // MoMo yêu cầu trả về HTTP 200 + JSON này
        Map<String, Object> ack = new HashMap<>();
        ack.put("partnerCode", params.getOrDefault("partnerCode", ""));
        ack.put("requestId",   params.getOrDefault("requestId", ""));
        ack.put("orderId",     params.getOrDefault("orderId", ""));
        ack.put("resultCode",  0);
        ack.put("message",     "Confirmed");
        return ResponseEntity.ok(ack);
    }
}
