package com.Huy.WebBanHang.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "HinhAnhDanhGia")
@Getter
@Setter
public class HinhAnhDanhGiaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idHinhAnh")
    private Integer idHinhAnh;
    // mappedBy bên DanhGiaSanPham đang gọi đến biến danhGiaSanPham này đấy
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idDanhGia", nullable = true)
    private DanhGiaSanPhamEntity danhGiaSanPham;
    @Column(name = "imageUrl", nullable = false)
    private String imageUrl;
}
