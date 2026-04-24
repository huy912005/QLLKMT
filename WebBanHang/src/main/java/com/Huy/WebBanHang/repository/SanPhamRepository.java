package com.Huy.WebBanHang.repository;

import com.Huy.WebBanHang.entity.SanPhamEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface SanPhamRepository extends JpaRepository<SanPhamEntity,String> {
    List<SanPhamEntity> findByLoaiSanPham_IdLoaiSanPham(String idLoaiSanPham);
    boolean existsByCongTy_IdCongTy(String idCongTy);
    boolean existsByLoaiSanPham_IdLoaiSanPham(String idLoaiSanPham);

    long countBySoLuongHienConGreaterThan(int soLuong);

    // Dành cho Customer
    @org.springframework.data.jpa.repository.Query("SELECT s FROM SanPhamEntity s WHERE s.loaiSanPham.tenLoaiSanPham = :tenLoai")
    List<SanPhamEntity> getSanPhamByTenLoai(@org.springframework.data.repository.query.Param("tenLoai") String tenLoai);

    @org.springframework.data.jpa.repository.Query("SELECT s FROM SanPhamEntity s WHERE LOWER(s.tenSanPham) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.moTa) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<SanPhamEntity> searchSanPham(@org.springframework.data.repository.query.Param("keyword") String keyword);

    @org.springframework.data.jpa.repository.Query("SELECT s FROM SanPhamEntity s LEFT JOIN ChiTietDonHangEntity c ON s.idSanPham = c.sanPham.idSanPham GROUP BY s ORDER BY SUM(c.soLuong) DESC LIMIT 10")
    List<SanPhamEntity> findTop10BestSelling();
}
