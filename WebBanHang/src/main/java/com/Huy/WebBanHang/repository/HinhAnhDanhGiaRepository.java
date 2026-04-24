package com.Huy.WebBanHang.repository;

import com.Huy.WebBanHang.entity.HinhAnhDanhGiaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HinhAnhDanhGiaRepository extends JpaRepository<HinhAnhDanhGiaEntity, Integer> {
    List<HinhAnhDanhGiaEntity> findByDanhGiaSanPhamIdDanhGia(Integer idDanhGia);
}
