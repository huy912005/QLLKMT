package com.Huy.WebBanHang.repository;

import com.Huy.WebBanHang.entity.LoaiSanPhamEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoaiSanPhamRepository extends JpaRepository<LoaiSanPhamEntity,String> {
}
