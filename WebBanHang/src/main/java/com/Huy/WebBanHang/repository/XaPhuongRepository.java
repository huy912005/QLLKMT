package com.Huy.WebBanHang.repository;

import com.Huy.WebBanHang.entity.XaPhuongEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface XaPhuongRepository extends JpaRepository<XaPhuongEntity, String> {
    List<XaPhuongEntity> findByTinh_IdTinh(String idTinh);
}