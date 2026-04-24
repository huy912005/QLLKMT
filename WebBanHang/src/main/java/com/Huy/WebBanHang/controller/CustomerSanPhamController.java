package com.Huy.WebBanHang.controller;

import com.Huy.WebBanHang.service.SanPhamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/customer/products")
@RequiredArgsConstructor
public class CustomerSanPhamController {

    private final SanPhamService sanPhamService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll(@RequestParam(required = false, defaultValue = "") String loai) {
        Map<String, Object> response = new HashMap<>();
        response.put("data", sanPhamService.getAllCustomerSanPham(loai));
        return ResponseEntity.ok(response); // Match the C# standard exactly: { data: [...] }
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> search(@RequestParam String q) {
        Map<String, Object> response = new HashMap<>();
        response.put("data", sanPhamService.searchSanPham(q));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable String id) {
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("data", sanPhamService.getSanPhamById(id));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/top")
    public ResponseEntity<Map<String, Object>> getTopSanPham() {
        Map<String, Object> response = new HashMap<>();
        response.put("data", sanPhamService.getTop10BanChay());
        return ResponseEntity.ok(response);
    }
}
