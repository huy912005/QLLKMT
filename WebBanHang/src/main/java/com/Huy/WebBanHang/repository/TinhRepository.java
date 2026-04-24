package com.Huy.WebBanHang.repository;

import com.Huy.WebBanHang.entity.TinhEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TinhRepository extends JpaRepository<TinhEntity, String> {
}