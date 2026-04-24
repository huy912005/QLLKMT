package com.Huy.WebBanHang.service;

import com.Huy.WebBanHang.entity.DonDatHangEntity;
import com.Huy.WebBanHang.repository.DonDatHangRepository;
import com.Huy.WebBanHang.repository.SanPhamRepository;
import com.Huy.WebBanHang.repository.ThanhToanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final DonDatHangRepository donDatHangRepository;
    private final ThanhToanRepository thanhToanRepository;
    private final SanPhamRepository sanPhamRepository;

    public Map<String, Object> getSummary() {
        LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime sevenDaysAgo = startOfDay.minusDays(7);

        BigDecimal todayRevenue = thanhToanRepository.sumRevenueToday(startOfDay);
        long todayOrders = donDatHangRepository.countOrdersToday(startOfDay);
        long newUsers7Days = donDatHangRepository.countNewUsersLast7Days(sevenDaysAgo);
        long totalActiveProducts = sanPhamRepository.countBySoLuongHienConGreaterThan(0);

        Map<String, Object> summary = new HashMap<>();
        summary.put("todayRevenue", todayRevenue);
        summary.put("todayOrders", todayOrders);
        summary.put("newUsers7Days", newUsers7Days);
        summary.put("totalActiveProducts", totalActiveProducts);

        return summary;
    }

    public Map<String, Object> getRevenueByMonth() {
        int currentYear = LocalDateTime.now().getYear();
        List<Map<String, Object>> monthData = thanhToanRepository.sumRevenueByMonth(currentYear);

        String[] labels = new String[12];
        BigDecimal[] values = new BigDecimal[12];

        for (int i = 0; i < 12; i++) {
            labels[i] = "Th" + (i + 1);
            values[i] = BigDecimal.ZERO;
        }

        for (Map<String, Object> data : monthData) {
            int month = ((Number) data.get("month")).intValue();
            BigDecimal total = (BigDecimal) data.get("total");
            values[month - 1] = total;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("labels", labels);
        result.put("values", values);

        return result;
    }

    public List<Map<String, Object>> getOrderStatusRatio() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return donDatHangRepository.countOrderStatusRatio(thirtyDaysAgo);
    }

    public List<Map<String, Object>> getRecentOrders() {
        List<DonDatHangEntity> recentOrders = donDatHangRepository.findTop5RecentOrders();
        return recentOrders.stream().map(d -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", d.getIdDonDat());
            map.put("code", d.getIdDonDat());
            map.put("customer", d.getNguoiDung() != null ? d.getNguoiDung().getUserName() : d.getSoNha());
            map.put("date", d.getNgayDat());
            
            BigDecimal total = BigDecimal.ZERO;
            if (d.getChiTietDonHangs() != null) {
                for (com.Huy.WebBanHang.entity.ChiTietDonHangEntity ct : d.getChiTietDonHangs()) {
                    total = total.add(ct.getDonGia().multiply(BigDecimal.valueOf(ct.getSoLuong())));
                }
            }
            map.put("total", total);
            map.put("status", d.getTrangThai());
            return map;
        }).collect(Collectors.toList());
    }
}
