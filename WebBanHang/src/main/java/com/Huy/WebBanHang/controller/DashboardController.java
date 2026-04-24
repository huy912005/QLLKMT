package com.Huy.WebBanHang.controller;

import com.Huy.WebBanHang.dto.respoonse.ApiResponse;
import com.Huy.WebBanHang.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Object>> getSummary() {
        return ResponseEntity.ok(ApiResponse.builder().success(true).data(dashboardService.getSummary()).build());
    }

    @GetMapping("/revenue-by-month")
    public ResponseEntity<ApiResponse<Object>> getRevenueByMonth() {
        return ResponseEntity.ok(ApiResponse.builder().success(true).data(dashboardService.getRevenueByMonth()).build());
    }

    @GetMapping("/order-status-ratio")
    public ResponseEntity<ApiResponse<Object>> getOrderStatusRatio() {
        return ResponseEntity.ok(ApiResponse.builder().success(true).data(dashboardService.getOrderStatusRatio()).build());
    }

    @GetMapping("/recent-orders")
    public ResponseEntity<ApiResponse<Object>> getRecentOrders() {
        return ResponseEntity.ok(ApiResponse.builder().success(true).data(dashboardService.getRecentOrders()).build());
    }
}
