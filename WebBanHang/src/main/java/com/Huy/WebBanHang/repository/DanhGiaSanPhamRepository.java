package com.Huy.WebBanHang.repository;

import com.Huy.WebBanHang.entity.DanhGiaSanPhamEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DanhGiaSanPhamRepository extends JpaRepository<DanhGiaSanPhamEntity, Integer> {
    @Query("SELECT AVG(c.soSao) FROM DanhGiaSanPhamEntity c WHERE c.sanPham.idSanPham = :idSanPham")
    Double getAverageRatingBySanPham(@Param("idSanPham") String idSanPham);
    boolean existsByUser_IdAndSanPham_IdSanPham(String userId, String idSanPham);
    List<DanhGiaSanPhamEntity> findBySanPhamIdSanPham(String idSanPham);
}
