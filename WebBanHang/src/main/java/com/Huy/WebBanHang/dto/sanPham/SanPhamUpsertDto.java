package com.Huy.WebBanHang.dto.sanPham;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Data
public class SanPhamUpsertDto {
    private String idSanPham;// Có thể null nếu là Thêm mới
    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String tenSanPham;
    private BigDecimal gia;
    private int soLuongHienCon;
    private String idCongTy;
    private String idLoaiSanPham;
    private String moTa;
    private String thongSoSanPham;
    private String imageLienQuan;
    // Spring dùng MultipartFile thay cho IFormFile của C#
    private MultipartFile image;
}
