package com.Huy.WebBanHang.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "LoaiSanPham")
public class LoaiSanPhamEntity {
    @Id
    @Column(name = "idLoaiSanPham")
    private String idLoaiSanPham;
    @Column(name = "tenLoaiSanPham")
    private String tenLoaiSanPham;
}
