package com.Huy.WebBanHang.repository;

import com.Huy.WebBanHang.entity.ChiTietGioHangEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChiTietGioHangRepository extends JpaRepository<ChiTietGioHangEntity, String> {
    // List<ChiTietGioHang> findByUser_Id(String userId);
    @Query("SELECT c FROM ChiTietGioHangEntity c WHERE c.user.id = :idNguoiDung AND c.sanPham.idSanPham = :idSanPham")
    ChiTietGioHangEntity findByUser_IdAndSanPham_IdSanPham(@Param("idNguoiDung") String idNguoiDung, @Param("idSanPham") String idSanPham);
    @Query("SELECT c FROM ChiTietGioHangEntity c WHERE c.user.id = :userId")
    List<ChiTietGioHangEntity> findByUser_IdNguoiDung(@Param("userId") String userId);
    @Query("SELECT count(c) FROM ChiTietGioHangEntity c WHERE c.user.id = :userId")
    long countByUser_IdNguoiDung(@Param("userId") String userId);
}
