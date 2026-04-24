package com.Huy.WebBanHang.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoaiSanPhamRequest {
    private String idLoaiSanPham;
    @NotBlank(message = "Tên loại sản phẩm không được để trống")
    private String tenLoaiSanPham;
}
