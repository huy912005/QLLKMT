package com.Huy.WebBanHang.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class DanhGiaRequest {
    @NotBlank(message = "Mã sản phẩm không được bỏ trống")
    private String idSanPham;
    @Min(value = 1, message = "Số sao tối thiểu là 1")
    @Max(value = 5, message = "Số sao tối đa là 5")
    private int soSao;
    private String noiDung;
    // Ảnh có thể null nếu người dùng không up hình
    private List<MultipartFile> hinhAnhs;
}
