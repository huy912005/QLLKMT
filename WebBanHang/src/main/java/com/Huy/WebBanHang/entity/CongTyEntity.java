package com.Huy.WebBanHang.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Setter
@Getter
@Table(name = "Congty")
public class CongTyEntity {
    @Id
    @Column(name = "idCongTy")
    private String idCongTy;
    @Column(name = "tenCongTy")
    private String tenCongTy;
    @OneToMany(mappedBy = "congTy",fetch = FetchType.LAZY)
    private List<SanPhamEntity> sanPhams;
}
