package com.Huy.WebBanHang.repository;

import com.Huy.WebBanHang.entity.ApplicationUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApplicationUserRepository extends JpaRepository<ApplicationUserEntity,String> {
    Optional<ApplicationUserEntity> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<ApplicationUserEntity> findByUserName(String userName);
    
    @org.springframework.data.jpa.repository.Query("SELECT u FROM ApplicationUserEntity u WHERE u.userName = :userName OR u.email = :email")
    Optional<ApplicationUserEntity> findByUserNameOrEmail(String userName, String email);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT u FROM ApplicationUserEntity u LEFT JOIN FETCH u.xaPhuong LEFT JOIN FETCH u.roles")
    java.util.List<ApplicationUserEntity> findAllWithRolesAndXaPhuong();
}
