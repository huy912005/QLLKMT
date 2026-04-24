package com.Huy.WebBanHang.repository;

import com.Huy.WebBanHang.entity.CongTyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CongTyRepository extends JpaRepository<CongTyEntity, String> {}
