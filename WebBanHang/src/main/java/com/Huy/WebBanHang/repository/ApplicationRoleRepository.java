package com.Huy.WebBanHang.repository;

import com.Huy.WebBanHang.entity.ApplicationRoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApplicationRoleRepository extends JpaRepository<ApplicationRoleEntity, String> {
    Optional<ApplicationRoleEntity> findByName(String name);
}
