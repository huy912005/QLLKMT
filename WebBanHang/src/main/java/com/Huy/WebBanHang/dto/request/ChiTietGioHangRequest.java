package com.Huy.WebBanHang.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietGioHangRequest {
    @NotBlank(message = "Mã sản phẩm không được để trống")
    private String idSanPham;
    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 1, message = "Số lượng tối thiểu phải là 1")
    private Integer soLuongTrongGio;
}
