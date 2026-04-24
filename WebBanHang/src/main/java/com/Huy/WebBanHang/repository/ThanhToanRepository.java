package com.Huy.WebBanHang.repository;

import com.Huy.WebBanHang.entity.ThanhToanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ThanhToanRepository extends JpaRepository<ThanhToanEntity, Integer> {
    Optional<ThanhToanEntity> findByDonDatHang_IdDonDat(String idDonDat);
    List<ThanhToanEntity> findByPhuongThuc(String phuongThuc);
    List<ThanhToanEntity> findByDaThanhToanAndNgayThanhToanBetween(boolean daThanhToan, LocalDateTime tuNgay, LocalDateTime denNgay);

    // Dành cho Dashboard Thống kê
    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(t.soTien), 0) FROM ThanhToanEntity t WHERE t.daThanhToan = true AND t.ngayThanhToan >= :today")
    java.math.BigDecimal sumRevenueToday(@org.springframework.data.repository.query.Param("today") LocalDateTime today);

    @org.springframework.data.jpa.repository.Query("SELECT MONTH(t.ngayThanhToan) AS month, SUM(t.soTien) AS total FROM ThanhToanEntity t WHERE t.daThanhToan = true AND YEAR(t.ngayThanhToan) = :year GROUP BY MONTH(t.ngayThanhToan)")
    java.util.List<java.util.Map<String, Object>> sumRevenueByMonth(@org.springframework.data.repository.query.Param("year") int year);
}
