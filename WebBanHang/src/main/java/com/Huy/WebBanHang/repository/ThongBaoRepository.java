package com.Huy.WebBanHang.repository;

import com.Huy.WebBanHang.entity.ThongBaoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThongBaoRepository extends JpaRepository<ThongBaoEntity, Integer> {
    List<ThongBaoEntity> findByUser_IdOrderByNgayTaoDesc(String userId);
    int countByUser_IdAndDaDocFalse(String userId);
}