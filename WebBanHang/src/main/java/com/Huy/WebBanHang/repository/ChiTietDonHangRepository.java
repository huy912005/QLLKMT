package com.Huy.WebBanHang.repository;

import com.Huy.WebBanHang.entity.ChiTietDonHangEntity;
import com.Huy.WebBanHang.entity.ChiTietDonHangId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChiTietDonHangRepository extends JpaRepository<ChiTietDonHangEntity, ChiTietDonHangId> {
    List<ChiTietDonHangEntity> findByDonDatHang_IdDonDat(String idDonDat);
}
