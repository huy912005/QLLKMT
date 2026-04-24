package com.Huy.WebBanHang.repository;

import com.Huy.WebBanHang.entity.DonDatHangEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonDatHangRepository extends JpaRepository<DonDatHangEntity,String> {
    List<DonDatHangEntity> findByNguoiDung_Id(String idNguoiDung);
    DonDatHangEntity findTopByOrderByIdDonDatDesc();

    // Dành cho Thống Kê Admin
    @org.springframework.data.jpa.repository.Query("SELECT COUNT(d) FROM DonDatHangEntity d WHERE d.ngayDat >= :today")
    long countOrdersToday(@org.springframework.data.repository.query.Param("today") java.time.LocalDateTime today);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(DISTINCT d.nguoiDung.id) FROM DonDatHangEntity d WHERE d.ngayDat >= :sevenDaysAgo")
    long countNewUsersLast7Days(@org.springframework.data.repository.query.Param("sevenDaysAgo") java.time.LocalDateTime sevenDaysAgo);

    @org.springframework.data.jpa.repository.Query("SELECT d.trangThai AS status, COUNT(d) AS count FROM DonDatHangEntity d WHERE d.ngayDat >= :from GROUP BY d.trangThai")
    java.util.List<java.util.Map<String, Object>> countOrderStatusRatio(@org.springframework.data.repository.query.Param("from") java.time.LocalDateTime from);

    @org.springframework.data.jpa.repository.Query("SELECT d FROM DonDatHangEntity d ORDER BY d.ngayDat DESC LIMIT 5")
    List<DonDatHangEntity> findTop5RecentOrders();
}
